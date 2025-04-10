const express = require('express')
const MachineCalculatorFactory = require('./MachineCalculator');
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './config.env' });

let Chapter2Routes = express.Router();
const Chapter2Function = MachineCalculatorFactory.getChapter("Chapter2");

Chapter2Routes.post('/chapter2/:userid/:recordid?', async (request, response) => {
  const supabase = request.supabase;
  const userid = jwt.decode(request.params.userid, process.env.SECRET_KEY);
  const { recordid } = request.params;

  try {
    const InputChapter2Data = Chapter2FirstCalculation(request.body);

    const { data: engineData, error } = await supabase
      .from('Engine')
      .select('*')
      .gte('cong_suat', InputChapter2Data.cong_suat_can_thiet_tren_truc_dong_co)
      .gte('van_toc_vong_quay', InputChapter2Data.so_vong_quay_so_bo);

    if (error) {
      console.error(error);
      return;
    }

    const SelectEngineList = EngineSelect(engineData, InputChapter2Data.cong_suat_can_thiet_tren_truc_dong_co, InputChapter2Data);

    if (recordid) {
      const decodedRecord = jwt.decode(recordid, process.env.SECRET_KEY);
      const existingRecordId = decodedRecord.id;

      const { data: existingRecord, error: fetchError } = await supabase
        .from('HistoryRecord')
        .select('chapter2_id')
        .eq('id', existingRecordId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingRecord) {
        const { data: updatedChapter2, error: updateError } = await supabase
          .from('Chapter2')
          .update(InputChapter2Data)
          .eq('id', existingRecord.chapter2_id);

        if (updateError) {
          return response.status(400).json({ message: updateError.message });
        }

        return response.status(200).json({
          message: 'Đã cập nhật dữ liệu thành công',
          record_id: recordid,
          engine_list: SelectEngineList
        });
      }
    }

    const Chapter2Id = uuidv4();
    const NewChapter2 = {
      id: Chapter2Id,
      ...InputChapter2Data
    };

    const { data: insertedChapter, error: insertChapterError } = await supabase
      .from('Chapter2')
      .insert([NewChapter2]);

    if (insertChapterError) {
      console.error("Insert Chapter2 Error:", insertChapterError);
      return response.status(400).json({ message: insertChapterError.message });
    }

    const HistoryRecordId = uuidv4();
    const EncryptedRecordId = jwt.sign(
      { id: HistoryRecordId },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    const NewHistoryRecord = {
      id: HistoryRecordId,
      chapter2_id: Chapter2Id,
      user_id: userid.id
    };

    const { data: insertedHistory, error: insertHistoryError } = await supabase
      .from('HistoryRecord')
      .insert([NewHistoryRecord]);

    if (insertHistoryError) {
      return response.status(400).json({ message: insertHistoryError.message });
    }

    return response.status(201).json({
      message: 'Đã tính toán thành công',
      record_id: EncryptedRecordId,
      engine_list: SelectEngineList
    });

  } catch (err) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
  }
});


Chapter2Routes.get('/chapter2/:recordid', async (request, response) => {
  const supabase = request.supabase
  const record_id = jwt.decode(request.params.recordid, process.env.SECRET_KEY);

  try {
    const {data: recordData, error: recordDataError } = await supabase.from('HistoryRecord').select('*').eq('id', record_id.id)

    const { data: chapter2data, error: chapter2DataError } = await supabase.from('Chapter2').select('*').eq('id', recordData[0].chapter2_id);
    
    if (recordDataError) {
      return response.status(400).json({ message: recordDataError.message });
    }
    
    if (chapter2DataError) {
      return response.status(400).json({ message: chapter2DataError.message });
    }

    return response.status(201).json({
      message: 'Đã lấy dữ liệu chương 2 thành công',
      chapter2data: chapter2data
    });
    
  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }

})

Chapter2Routes.post('/chapter2/update/engine/:record_id', async (request, response) => {
  const supabase = request.supabase
  const record_id = jwt.decode(request.params.record_id, process.env.SECRET_KEY);

  try {
    // Lấy data từ history record
    const { data: recordData, error: recordDataError } = await supabase.from('HistoryRecord').select('*').eq('id', record_id.id);

    if (recordDataError) {
      console.error("recordDataError", recordDataError)
      return response.status(400).json({ message: recordDataError.message });
    }

    // Lấy data từ bảng động cơ
    const { data: engineData, error: engineDataError } = await supabase.from('Engine').select('*').eq('id', request.body.selectEngineID);
    
    if (engineDataError) {
      console.error("engineDataError", engineDataError)
      return response.status(400).json({ message: engineDataError.message });
    }

    // Lấy data từ bảng Chapter2
    const { data: chapter2data, error: chapter2DataError } = await supabase.from('Chapter2').select('*').eq('id', recordData[0].chapter2_id);

    if(chapter2DataError) {
      console.error("chapter2DataError", chapter2DataError)
      return response.status(400).json({ message: chapter2DataError.message });
    }

    // Gọi hàm tính toán phân phối tỉ số truyền
    const updateChapter2Data = Chapter2SecondCalculation(chapter2data[0], engineData[0]);

    // Tính toán và cập nhật dữ liệu
    const { data: updateData, error: updataDataError } = await supabase.from('Chapter2').update(updateChapter2Data).eq('id', recordData[0].chapter2_id);

    if(updataDataError) {
      console.error("updataDataError", updataDataError)
      return response.status(400).json({ message: updataDataError.message });
    }

    // Cập nhật key của engine vô historyRecord
    const { data: updateEngineId, error: updateEngineIdError } = await supabase.from('HistoryRecord').update({engine_id: request.body.selectEngineID}).eq('id', record_id.id);

    if(updateEngineIdError) {
      console.error("updateEngineIdError", updateEngineIdError)
      return response.status(400).json({ message: updateEngineIdError.message });
    }
    return response.status(200).json({ message: 'Đã tính toán và cập nhật thành công chương 2' });
  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
})

function Chapter2FirstCalculation(input) {
  const luc_vong_bang_tai = Number(input.f);
  const van_toc_bang_tai = Number(input.v);
  const duong_kinh_tang_dan = Number(input.D);
  const thoi_gian_phuc_vu = Number(input.L);
  const t1 = Number(input.t1);
  const t2 = Number(input.t2);
  const t1_momen = input.T1;
  const t2_momen = input.T2;
  const t1_t = Number(input.T1_numeric);
  const t2_t = Number(input.T2_numeric);
  const hieu_suat_noi_truc = Number(input.nk);
  const hieu_suat_o_lan = Number(input.nol);
  const hieu_suat_banh_rang = Number(input.nbr);
  const hieu_suat_xich = Number(input.nx);
  const ty_so_truyen_hop_giam_toc = Number(input.uh);
  const ty_so_truyen_xich = Number(input.ux);
  const ty_so_truyen_so_bo = Number(input.usb);
  const cong_suat_truc_cong_tac = Chapter2Function.cong_suat_truc_cong_tac(luc_vong_bang_tai, van_toc_bang_tai);
  const hieu_suat_chung = Chapter2Function.hieu_suat_chung(hieu_suat_noi_truc, hieu_suat_o_lan, hieu_suat_banh_rang, hieu_suat_xich);
  const cong_suat_tuong_duong_truc_cong_tac = Chapter2Function.cong_suat_tuong_duong_truc_cong_tac(cong_suat_truc_cong_tac, t1_t, t2_t, t1, t2);
  const cong_suat_can_thiet_tren_truc_dong_co = Chapter2Function.cong_suat_can_thiet_tren_truc_dong_co(cong_suat_tuong_duong_truc_cong_tac, hieu_suat_chung);
  const so_vong_quay_truc_cong_tac = Chapter2Function.so_vong_quay_truc_cong_tac(van_toc_bang_tai, duong_kinh_tang_dan)
  const so_vong_quay_so_bo = Chapter2Function.so_vong_quay_so_bo(so_vong_quay_truc_cong_tac, ty_so_truyen_so_bo)

  return {
    luc_vong_bang_tai: luc_vong_bang_tai,
    van_toc_bang_tai: van_toc_bang_tai,
    duong_kinh_tang_dan: duong_kinh_tang_dan,
    thoi_gian_phuc_vu: thoi_gian_phuc_vu,
    t1: t1,
    t2: t2,
    t1_momen: t1_momen,
    t2_momen: t2_momen,
    t1_t: t1_t,
    t2_t: t2_t,
    hieu_suat_noi_truc: hieu_suat_noi_truc,
    hieu_suat_o_lan: hieu_suat_o_lan,
    hieu_suat_banh_rang: hieu_suat_banh_rang,
    hieu_suat_xich: hieu_suat_xich,
    ty_so_truyen_hop_giam_toc: ty_so_truyen_hop_giam_toc,
    ty_so_truyen_xich: ty_so_truyen_xich,
    ty_so_truyen_so_bo: ty_so_truyen_so_bo,
    cong_suat_truc_cong_tac: cong_suat_truc_cong_tac,
    hieu_suat_chung: hieu_suat_chung,
    cong_suat_tuong_duong_truc_cong_tac: cong_suat_tuong_duong_truc_cong_tac,
    cong_suat_can_thiet_tren_truc_dong_co: cong_suat_can_thiet_tren_truc_dong_co,
    so_vong_quay_truc_cong_tac: so_vong_quay_truc_cong_tac,
    so_vong_quay_so_bo: so_vong_quay_so_bo
  }
}

function EngineSelect(engineData) {
  const engines = engineData.sort((a, b) => {
    if (a.cong_suat === b.cong_suat) {
      return a.van_toc_vong_quay - b.van_toc_vong_quay;
    }
    return a.cong_suat - b.cong_suat;
  });
  return engines.slice(0,3);
}

function Chapter2SecondCalculation(Chapter2Input, EngineInput) {
  const ty_so_truyen_chung = 
    Chapter2Function.ty_so_truyen_chung(EngineInput.van_toc_vong_quay, Chapter2Input.so_vong_quay_truc_cong_tac);

  const he_so_truyen_cap_nhanh =
    Chapter2Function.he_so_truyen_cap_nhanh(Chapter2Input.ty_so_truyen_hop_giam_toc);

  const he_so_truyen_cap_cham = 
    Chapter2Function.he_so_truyen_cap_cham(Chapter2Input.ty_so_truyen_hop_giam_toc);

  const he_so_truyen_dong_xich =
    Chapter2Function.he_so_truyen_dong_xich(ty_so_truyen_chung, he_so_truyen_cap_nhanh, he_so_truyen_cap_cham);

  const he_so_truyen_dong_hop = Chapter2Function.he_so_truyen_dong_hop(Chapter2Input.ty_so_truyen_hop_giam_toc);

  const Pbt = Chapter2Function.Pbt(Chapter2Input.cong_suat_truc_cong_tac, Chapter2Input.hieu_suat_o_lan);

  const P3 = Chapter2Function.P3(Pbt, Chapter2Input.hieu_suat_xich, Chapter2Input.hieu_suat_o_lan);

  const P2 = Chapter2Function.P2(P3, Chapter2Input.hieu_suat_banh_rang, Chapter2Input.hieu_suat_o_lan);

  const P1 = Chapter2Function.P1(P2, Chapter2Input.hieu_suat_banh_rang, Chapter2Input.hieu_suat_o_lan);

  const Pm = Chapter2Function.Pm(P1, Chapter2Input.hieu_suat_noi_truc);

  const ndc = Chapter2Function.ndc(EngineInput.van_toc_vong_quay);

  const n1 = Chapter2Function.n1(EngineInput.van_toc_vong_quay);

  const n2 = Chapter2Function.n2(n1, he_so_truyen_cap_nhanh);

  const n3 = Chapter2Function.n3(n2, he_so_truyen_cap_cham);

  const nbt = Chapter2Function.nbt(n3, he_so_truyen_dong_xich);

  const T1_ti_so_truyen = Chapter2Function.T1_ti_so_truyen(P1, EngineInput.van_toc_vong_quay);

  const Tm = Chapter2Function.Tm(T1_ti_so_truyen);

  const T2_ti_so_truyen = Chapter2Function.T2_ti_so_truyen(P2, n2);

  const T3_ti_so_truyen = Chapter2Function.T3_ti_so_truyen(P3, n3);

  const Tbt_ti_so_truyen = Chapter2Function.Tbt_ti_so_truyen(Pbt,nbt);

  return {
    ty_so_truyen_chung: ty_so_truyen_chung,
    he_so_truyen_dong_hop: he_so_truyen_dong_hop,
    he_so_truyen_cap_nhanh: he_so_truyen_cap_nhanh,
    he_so_truyen_cap_cham: he_so_truyen_cap_cham,
    he_so_truyen_dong_xich: he_so_truyen_dong_xich,
    pbt: Pbt,
    p3: P3,
    p2: P2,
    p1: P1,
    pm: Pm,
    ndc: ndc,
    n1: n1,
    n2: n2,
    n3: n3,
    nbt: nbt,
    t1_ti_so_truyen: T1_ti_so_truyen,
    tm: Tm,
    t2_ti_so_truyen: T2_ti_so_truyen,
    t3_ti_so_truyen: T3_ti_so_truyen,
    tbt_ti_so_truyen: Tbt_ti_so_truyen
  }
}

module.exports = Chapter2Routes;