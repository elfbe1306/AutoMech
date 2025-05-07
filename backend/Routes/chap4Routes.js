const express = require('express')
const MachineCalculatorFactory = require('../MachineCalculator');
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../config.env' });

let Chapter4Routes = express.Router();
const Chapter4Function = MachineCalculatorFactory.getChapter("Chapter4");

Chapter4Routes.route('/chapter4/:recordid').get(async (request, response) => {
  const supabase = request.supabase;
  const record_id = jwt.decode(request.params.recordid, process.env.SECRET_KEY);

  try { 
    // Lấy data từ history record
    const { data: recordData, error: recordDataError } = await supabase.from('HistoryRecord').select('*').eq('id', record_id.id);

    if (recordDataError) {
      console.error("recordDataError", recordDataError)
      return response.status(400).json({ message: recordDataError.message });
    }

    // Lấy data từ bảng Chapter3
    const { data: chapter3Data, error: chapter3DataError } = await supabase.from('Chapter3').select('v, z1, z2, oh1, oh2').eq('id', recordData[0].chapter3_id);

    if(chapter3DataError) {
      console.error("chapter3DataError", chapter3DataError)
      return response.status(400).json({ message: chapter3DataError.message });
    }

    const material = SelectMaterial(chapter3Data[0].v, chapter3Data[0].z1, chapter3Data[0].z2, chapter3Data[0].oh1, chapter3Data[0].oh2);

    return response.status(200).json({ message: 'Predata Chapter 4', material: material})
  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
})

Chapter4Routes.route('/chapter4/calculation/:recordid').post(async (request, response) => {
  const supabase = request.supabase;
  const record_id = jwt.decode(request.params.recordid, process.env.SECRET_KEY);

  try {
    // Lấy data từ history record
    const { data: recordData, error: recordDataError } = await supabase.from('HistoryRecord').select('*').eq('id', record_id.id);
    if (recordDataError) {
      console.error("recordDataError", recordDataError)
      return response.status(400).json({ message: recordDataError.message });
    }

    // Lấy data từ bảng Chapter2
    const { data: Chapter2Data, error: Chapter2DataError } = await supabase.from('Chapter2').select('*').eq('id', recordData[0].chapter2_id);
    if(Chapter2DataError) {
      console.error("Chapter2DataError", Chapter2DataError)
      return response.status(400).json({ message: Chapter2DataError.message });
    }

    // Lấy data từ bảng Chapter3
    const { data: Chapter3Data, error: Chapter3DataError } = await supabase.from('Chapter3').select('*').eq('id', recordData[0].chapter3_id);
    if(Chapter3DataError) {
      console.error("Chapter3DataError", Chapter3DataError)
      return response.status(400).json({ message: Chapter3DataError.message });
    }

    const Chapter4InputData = UngSuatChoPhep(request.body, Chapter2Data[0]);

    if(recordData[0].chapter4_id) {
      // Cập nhật dữ liệu chương 4
      const {data: insertChapter4, error: InsertChapter4Error } = await supabase.from('Chapter4').update(Chapter4InputData).eq('id',recordData[0].chapter4_id)
      if(InsertChapter4Error) {
        console.error("InsertChapter4Error", InsertChapter4Error)
        return response.status(400).json({ message: InsertChapter4Error.message });
      }
    } else {
      const Chapter4Id = uuidv4();
      const Chapter4InputDataWithId = {
        id: Chapter4Id,
        ...Chapter4InputData
      }

      // Thêm dữ liệu ban đầu chương 4
      const {data: insertChapter4, error: InsertChapter4Error } = await supabase.from('Chapter4').insert([Chapter4InputDataWithId])
      if(InsertChapter4Error) {
        console.error("InsertChapter4Error", InsertChapter4Error)
        return response.status(400).json({ message: InsertChapter4Error.message });
      }

      // Cập nhật khoá chương 4 trong HistoryRecord
      const { data: insertChapter4ID, error: InsertChapter4IDError } = await supabase.from('HistoryRecord').update({chapter4_id: Chapter4Id}).eq('id', record_id.id)
      if(InsertChapter4IDError) {
        console.error("InsertChapter4IDError", InsertChapter4IDError)
        return response.status(400).json({ message: InsertChapter4IDError.message });
      }
    }
    
    const TinhToanNhanh = TinhToanCapNhanh(request.body, Chapter4InputData, Chapter2Data[0]);
    // const TinhToanCham = TinhToanCapCham(request.body, Chapter4InputData, Chapter2Data[0]);

    console.log(TinhToanNhanh);

    return response.status(200).json({ message: 'Đã tính toán xong chương 4' });
  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
})

const SelectMaterial = (v, z1, z2, oh1, oh2) => {
  if(z1 <= 19 && z2 <= 19) {
    return 4; // Thep 15 Tham cacbon, toi, ram
  } else if(z1 < 40 && z2 < 40) {
    return 3; // Thep 45 Toi, ram
  } else {
    const diff1 = 500 - oh1; 
    const diff2 = 550 - oh2; 
    if(diff1 < diff2) {
      return 2; // Thep 45 toi cai thien
    } 
  }
  return 1; // Gang xam
}

function UngSuatChoPhep(Chapter4Input, Chapter2Data) {
  const Lg = Chapter4Function.ThoiGianPhucVu(Chapter2Data.thoi_gian_phuc_vu);
  const SHlim1 = Chapter4Function.UngSuatTiepXucChoPhep(Chapter4Input.HB1);
  const SHlim2 = Chapter4Function.UngSuatTiepXucChoPhep(Chapter4Input.HB2);
  const Flim1 = Chapter4Function.UngSuatUonChoPhep(Chapter4Input.HB1);
  const Flim2 = Chapter4Function.UngSuatUonChoPhep(Chapter4Input.HB2);
  const KFC = 1;
  const KHL1 = 1
  const KHL2 = 1;
  const KFL1 = 1;
  const KFL2 = 1;
  const SH1 = 1.1;
  const SF1 = 1.75;
  const SH2 = 1.1;
  const SF2 = 1.75;
  const NHO1 = Chapter4Function.SoCKThayDoiUsKhiThuTiepXuc(Chapter4Input.HB1);
  const NHO2 = Chapter4Function.SoCKThayDoiUsKhiThuTiepXuc(Chapter4Input.HB2);
  const NFO1 = 4000000;
  const NFO2 = 4000000;
  const NHE1 = Chapter4Function.NHE1(Chapter4Input.c, Lg, Chapter2Data.n1, Chapter2Data.t1_t, Chapter2Data.t2_t, Chapter2Data.t1, Chapter2Data.t2);
  const NHE2 = Chapter4Function.NHE2(NHE1, Chapter2Data.he_so_truyen_cap_nhanh);
  const mF = 6;
  const NFE1 = Chapter4Function.NFE1(Chapter4Input.c, Lg, Chapter2Data.n1, Chapter2Data.t1_t, Chapter2Data.t2_t, Chapter2Data.t1, Chapter2Data.t2, mF);
  const NFE2 = Chapter4Function.NFE2(NFE1, Chapter2Data.he_so_truyen_cap_nhanh);
  const o_H1 = Chapter4Function.UngSuatTiepXuc_O_H(SHlim1,KHL1, SH1);
  const o_H2 = Chapter4Function.UngSuatTiepXuc_O_H(SHlim2,KHL2, SH2);
  const o_F1 = Chapter4Function.UngSuatUon_O_F(Flim1,KFC,KFL1, SF1);
  const o_F2 = Chapter4Function.UngSuatUon_O_F(Flim2,KFC,KFL2, SF2);
  const o_H = Chapter4Function.UngSuatTiepXucChoPhepCapNhanh(o_H1,o_H2);
  const o_H_phay = o_H2;
  const o_H_max = Chapter4Function.UngSuatTiepXucQuaTaiChoPhep(Chapter4Input.Sch2);
  const o_F1_max = Chapter4Function.UngSuatUonQuaTaiChoPhep(Chapter4Input.Sch1);
  const o_F2_max = Chapter4Function.UngSuatUonQuaTaiChoPhep(Chapter4Input.Sch2);


  return {
    Sb1: Chapter4Input.Sb1,
    Sch1: Chapter4Input.Sch1,
    HB1: Chapter4Input.HB1,
    Sb2: Chapter4Input.Sb2,
    Sch2: Chapter4Input.Sch2,
    HB2: Chapter4Input.HB2,
    c: Chapter4Input.c,
    thoi_gian_phuc_vu_Lg: Lg,
    SHlim1: SHlim1,
    SHlim2: SHlim2,
    SH1: SH1,
    SH2: SH2,
    Flim1: Flim1,
    Flim2: Flim2,
    SF1: SF1,
    SF2: SF2,
    NHO1: NHO1,
    NHO2: NHO2,
    NFO1: NFO1,
    NFO2: NFO2,
    NHE1: NHE1,
    NHE2: NHE2,
    NFE1: NFE1,
    NFE2: NFE2,
    KFC:KFC,
    KHL1: KHL1,
    KHL2: KHL2,
    KFL1: KFL1,
    KFL2:KFL2,
    mf:mF,
    o_H1: o_H1, 
    o_H2: o_H2,
    o_F1: o_F1,
    o_F2: o_F2,
    o_H: o_H,
    o_H_phay: o_H_phay,
    o_H_max: o_H_max,
    o_F1_max: o_F1_max,
    o_F2_max: o_F2_max,
  }
}

function TinhToanCapNhanh(Chapter4Input, Chapter4Data, Chapter2Data) {
  const Ka_cap_nhanh = 43;
  const y_bd = Chapter4Function.Y_bd(Chapter4Input.y_ba, Chapter2Data.he_so_truyen_cap_nhanh);
  const KHB_cap_nhanh = Chapter4Function.KHB_cap_nhanh(y_bd);
  const aw1_so_bo = Chapter4Function.aw1_so_bo(Ka_cap_nhanh, Chapter2Data.he_so_truyen_cap_nhanh, Chapter2Data.t1_ti_so_truyen, KHB_cap_nhanh, Chapter4Data.o_H, Chapter4Input.y_ba);
  const module_1 = Chapter4Function.module_1(160);
  const module_2 = Chapter4Function.module_2(160);
  const z1 = Chapter4Function.z1(40, 160, Chapter4Input.m_cap_nhanh, Chapter2Data.he_so_truyen_cap_nhanh);
  const z2 = Chapter4Function.z2(Chapter2Data.he_so_truyen_cap_nhanh, z1);
  const goc_B = Chapter4Function.tinh_goc_B(z1, z2,160, Chapter4Input.m_cap_nhanh);


  return {
    y_ba: Chapter4Input.y_ba,
    y_bd: y_bd,
    KHB_cap_nhanh: KHB_cap_nhanh,
    aw1_so_bo: aw1_so_bo,
    module_1: module_1,
    module_2: module_2,
    goc_B: goc_B,

  }
}

// function TinhToanCapCham(Chapter4Input, Chapter4Data, Chapter2Data) {
//   const Ka_cap_cham = 49.5;
//   const y_ba_cap_cham = Chapter4Function.Y_ba_cap_cham(Chapter4Input.y_ba);
//   const y_bd = Chapter4Function.Y_bd(y_ba_cap_cham, Chapter2Data.he_so_truyen_cap_cham);
//   const KHB_cap_cham = Chapter4Function.KHB_cap_cham(y_bd);
//   const aw1_so_bo = Chapter4Function.aw1_so_bo(Ka_cap_cham, Chapter2Data.he_so_truyen_cap_cham, Chapter2Data.t2_ti_so_truyen, KHB_cap_cham, Chapter4Data.o_H_phay, y_ba_cap_cham);
//   return {
//     y_ba_cap_cham: y_ba_cap_cham,
//     y_bd: y_bd,
//     KHB_cap_cham: KHB_cap_cham,
//     aw1_so_bo: aw1_so_bo
//   }
// }

module.exports = Chapter4Routes;