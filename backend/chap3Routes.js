const express = require('express')
const MachineCalculatorFactory = require('./MachineCalculator');
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './config.env' });

let Chapter3Routes = express.Router();
const Chapter3Function = MachineCalculatorFactory.getChapter("Chapter3");

Chapter3Routes.route('/chapter3/:recordid').get(async (request, response) => {
  const supabase = request.supabase
  const record_id = jwt.decode(request.params.recordid, process.env.SECRET_KEY);

  try {
    // Lấy data từ history record
    const { data: recordData, error: recordDataError } = await supabase.from('HistoryRecord').select('*').eq('id', record_id.id);

    if (recordDataError) {
      console.error("recordDataError", recordDataError)
      return response.status(400).json({ message: recordDataError.message });
    }

    // Lấy data từ bảng Chapter2
    const { data: chapter2Data, error: chapter2DataError } = await supabase.from('Chapter2').select('*').eq('id', recordData[0].chapter2_id);

    if(chapter2DataError) {
      console.error("chapter2DataError", chapter2DataError)
      return response.status(400).json({ message: chapter2DataError.message });
    }

    return response.status(200).json({ message: 'Predata chapter 3', chapter2Data: chapter2Data[0] });
  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}) 

Chapter3Routes.route('/chapter3/first/:recordid').post(async (request, response) => {
  const supabase = request.supabase
  const record_id = jwt.decode(request.params.recordid, process.env.SECRET_KEY);

  try {
    // Lấy data từ history record
    const { data: recordData, error: recordDataError } = await supabase.from('HistoryRecord').select('*').eq('id', record_id.id);

    if (recordDataError) {
      console.error("recordDataError", recordDataError)
      return response.status(400).json({ message: recordDataError.message });
    }

    // Lấy data từ bảng Chapter2
    const { data: chapter2Data, error: chapter2DataError } = await supabase.from('Chapter2').select('*').eq('id', recordData[0].chapter2_id);

    if(chapter2DataError) {
      console.error("chapter2DataError", chapter2DataError)
      return response.status(400).json({ message: chapter2DataError.message });
    }

    // Tính toán hệ số an toàn
    const Chapter3InputData = Chapter3FirstCalculation(chapter2Data[0], request.body);
    const safetyCheck = getSafetyFactor(Chapter3InputData.buoc_xich, Chapter3InputData.n01);
    let safetyResult = false;
    if(safetyCheck < Chapter3InputData.he_so_an_toan) {
      safetyResult = true;
    }

    if(recordData[0].chapter3_id) {
      // Cập nhật dữ liệu chương 3
      const {data: insertChapter3, error: insertChapter3Error } = await supabase.from('Chapter3').update(Chapter3InputData).eq('id',recordData[0].chapter3_id)
      if(insertChapter3Error) {
        console.error("insertChapter3Error", insertChapter3Error)
        return response.status(400).json({ message: insertChapter3Error.message });
      }
    } else {
      const Chapter3Id = uuidv4();
      const Chapter3InputDataWithId = {
        id: Chapter3Id,
        ...Chapter3InputData
      }

      // Thêm dữ liệu ban đầu chương 3
      const {data: insertChapter3, error: insertChapter3Error } = await supabase.from('Chapter3').insert([Chapter3InputDataWithId])
      if(insertChapter3Error) {
        console.error("insertChapter3Error", insertChapter3Error)
        return response.status(400).json({ message: insertChapter3Error.message });
      }

      // Cập nhật khoá chương 3 trong HistoryRecord
      const { data: insertChapter3ID, error: insertChapter3IDError } = await supabase.from('HistoryRecord').update({chapter3_id: Chapter3Id}).eq('id', record_id.id)
      if(insertChapter3IDError) {
        console.error("insertChapter3IDError", insertChapter3IDError)
        return response.status(400).json({ message: insertChapter3IDError.message });
      }
    }

    return response.status(200).json({ message: 'Đã kiểm tra an toàn xong', safetyResult: safetyResult });
  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}) 

Chapter3Routes.route('/chapter3/second/:recordid').post(async (request, response) => {
  
})

const safetyFactorTable = {
  "12.7-15.875": [7, 7.8, 8.5, 9.3, 10.2, 11, 11.7, 13.2, 14.8, 16.3, 18],
  "19.05-25.4":  [7, 8.2, 9.3, 10.3, 11.7, 12.9, 14, 16.3, null, null, null],
  "31.75-38.1":  [7, 8.5, 10.2, 13.2, 14.8, 16.3, 19.5, null, null, null, null],
  "44.45-50.8":  [7, 9.3, 11.7, 14, 16.3, null, null, null, null, null, null]
};
const speedSteps = [50, 200, 400, 600, 800, 1000, 1200, 1600, 2000, 2400, 2800];

function getSafetyFactor(p, n1) {
  let rangeKey;
  if (p <= 15.875) rangeKey = "12.7-15.875";
  else if (p <= 25.4) rangeKey = "19.05-25.4";
  else if (p <= 38.1) rangeKey = "31.75-38.1";
  else if (p <= 50.8) rangeKey = "44.45-50.8";
  else return null;
  const nIndex = speedSteps.findIndex((speed) => n1 <= speed);
  if (nIndex === -1) return null;
  const value = safetyFactorTable[rangeKey][nIndex];
  return value ?? null;
}

function Chapter3FirstCalculation(Chapter2Data, Chapter3Input) {
  const z1 = Chapter3Function.Z1(Chapter2Data.he_so_truyen_dong_xich);
  const z2 = Chapter3Function.Z2(Chapter2Data.he_so_truyen_dong_xich, z1);
  const z1_round = Math.round(z1);
  const kz = Chapter3Function.kz(Chapter3Input.z01, z1_round);
  const kn = Chapter3Function.kn(Chapter3Input.n01, Chapter2Data.n3);
  const k = Chapter3Function.k(Chapter3Input.k0, Chapter3Input.ka, Chapter3Input.kdc, Chapter3Input.kbt, Chapter3Input.kd, Chapter3Input.kc);
  const cong_suat_tinh_toan = Chapter3Function.cong_suat_tinh_toan(Chapter2Data.p3, k, kz, kn);
  const cong_suat_cho_phep = Chapter3Function.cong_suat_cho_phep(Chapter3Input.n01, cong_suat_tinh_toan);
  const buoc_xich = Chapter3Function.buoc_xich(Chapter3Input.n01, cong_suat_cho_phep);
  const khoang_cach_truc = Chapter3Function.khoang_cach_truc(buoc_xich);
  const so_mat_xich = Chapter3Function.so_mat_xich(khoang_cach_truc, buoc_xich, Chapter3Input.z01, z2);
  const tinh_lai_khoang_cach_truc = Chapter3Function.tinh_lai_khoang_cach_truc(buoc_xich, so_mat_xich, Chapter3Input.z01, z2);
  const delta_a = Chapter3Function.delta_a(Chapter3Input.Da, tinh_lai_khoang_cach_truc);
  const a = Chapter3Function.a(tinh_lai_khoang_cach_truc, delta_a);
  const so_lan_va_dap_cua_xich = Chapter3Function.so_lan_va_dap_cua_xich(z1_round, Chapter2Data.n3, so_mat_xich);
  const tai_trong_pha_hong = Chapter3Function.tai_trong_pha_hong(buoc_xich);
  const q = Chapter3Function.khoi_luong_1m_xich(buoc_xich);
  const v = Chapter3Function.v(z1_round, buoc_xich, Chapter2Data.n3);
  const ft = Chapter3Function.Ft(Chapter2Data.p3, v);
  const fv = Chapter3Function.Fv(q, v);
  const F0 = Chapter3Function.F0(Chapter3Input.kf, q, a);
  const s = Chapter3Function.he_so_an_toan(tai_trong_pha_hong, Chapter3Input.kd, ft, F0, fv);

  return {
    k0: Chapter3Input.k0,
    ka: Chapter3Input.ka,
    kdc: Chapter3Input.kdc,
    kc: Chapter3Input.kc,
    kd: Chapter3Input.kd,
    kbt: Chapter3Input.kbt,
    z01: Chapter3Input.z01,
    kf: Chapter3Input.kf,
    n01: Chapter3Input.n01,
    da: Chapter3Input.Da,
    z1: z1_round,
    z2: z2,
    kz: kz,
    kn: kn,
    k: k,
    cong_suat_tinh_toan: cong_suat_tinh_toan,
    cong_suat_cho_phep: cong_suat_cho_phep,
    buoc_xich: buoc_xich,
    khoang_cach_truc: khoang_cach_truc,
    so_mat_xich: so_mat_xich,
    tinh_lai_khoang_cach_truc: tinh_lai_khoang_cach_truc,
    delta_a: delta_a,
    a: a,
    so_lan_va_dap_cua_xich: so_lan_va_dap_cua_xich,
    tai_trong_pha_hong: tai_trong_pha_hong,
    q: q,
    v: v,
    ft: ft,
    fv: fv,
    f0: F0,
    he_so_an_toan: s
  }
}

module.exports = Chapter3Routes;