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

    const Chapter4InputData = UngSuatChoPhep(request.body, Chapter2Data[0], Chapter3Data[0]);

    console.log(Chapter4InputData);

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

function UngSuatChoPhep(Chapter4Input, Chapter2Data, Chapter3Data) {
  const Lg = Chapter4Function.ThoiGianPhucVu(Chapter2Data.thoi_gian_phuc_vu);
  
  const SHlim1 = Chapter4Function.UngSuatTiepXucChoPhep(Chapter4Input.HB1);
  const SHlim2 = Chapter4Function.UngSuatTiepXucChoPhep(Chapter4Input.HB2);
  const Flim1 = Chapter4Function.UngSuatUonChoPhep(Chapter4Input.HB1);

  const KFC = 1;
  const KHL1 = 1
  const KHL2 = 1;
  const KFL1 = 1;
  const KFL2 = 1;

  const o_H1 = Chapter4Function.UngSuatTiepXuc_O_H(570,KHL1, 1.1);
  const o_H2 = Chapter4Function.UngSuatTiepXuc_O_H(540,KHL2, 1.1);
  const o_F1 = Chapter4Function.UngSuatUon_O_F(450,KFC,KFL1, 1.75);
  const o_F2 = Chapter4Function.UngSuatUon_O_F(423,KFC,KFL2, 1.75);
  const o_H = Chapter4Function.UngSuatTiepXucChoPhepCapNhanh(o_H1,o_H2);
  const o_H_phay = o_H2;
  const o_H_max = Chapter4Function.UngSuatTiepXucQuaTaiChoPhep(Chapter4Input.Sch2);
  const o_F1_max = Chapter4Function.UngSuatUonQuaTaiChoPhep(Chapter4Input.Sch1);
  const o_F2_max = Chapter4Function.UngSuatUonQuaTaiChoPhep(Chapter4Input.Sch2);
  const Flim2 = Chapter4Function.UngSuatUonChoPhep(Chapter4Input.HB2);
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
 

  return {
    thoi_gian_phuc_vu_Lg: Lg,

    SHlim1: SHlim1,
    SHlim2: SHlim2,
    Flim1: Flim1,

    o_H1: o_H1, 
    o_H2: o_H2,
    o_F1: o_F1,
    o_F2: o_F2,
    o_H: o_H,
    o_H_phay: o_H_phay,
    o_H_max: o_H_max,
    o_F1_max: o_F1_max,
    o_F2_max: o_F2_max,

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
    NFE2: NFE2
  }
}

module.exports = Chapter4Routes;