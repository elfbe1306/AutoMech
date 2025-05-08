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
    const TinhToanNhanh = TinhToanCapNhanhCoBan(Chapter4InputData, Chapter2Data[0]);
    const TinhToanCham = TinhToanCapChamCoBan(Chapter4InputData, Chapter2Data[0]);

    if(recordData[0].chapter4_id) {
      // Lấy data từ bảng Chapter4
      const { data: Chapter4Data, error: Chapter4DataError } = await supabase.from('Chapter4').select('tinhtoannhanh_id, tinhtoancham_id').eq('id', recordData[0].chapter4_id);
      if(Chapter4DataError) {
        console.error("Chapter4DataError", Chapter4DataError)
        return response.status(400).json({ message: Chapter4DataError.message });
      }

      // Cập nhật dữ liệu chương 4
      const {data: insertChapter4, error: InsertChapter4Error } = await supabase.from('Chapter4').update(Chapter4InputData).eq('id',recordData[0].chapter4_id)
      if(InsertChapter4Error) {
        console.error("InsertChapter4Error", InsertChapter4Error)
        return response.status(400).json({ message: InsertChapter4Error.message });
      }

      // Cập nhật dữ liệu bảng tính toán nhanh
      const {data: insertTinhToanNhanh, error: InsertTinhToanNhanhError } = await supabase.from('Chapter4').update(Chapter4InputData).eq('id',Chapter4Data[0].tinhtoannhanh_id)
      if(InsertTinhToanNhanhError) {
        console.error("InsertTinhToanNhanhError", InsertTinhToanNhanhError)
        return response.status(400).json({ message: InsertTinhToanNhanhError.message });
      }

      // Cập nhật dữ liệu bảng tính toán chậm
      const {data: insertTinhToanCham, error: InsertTinhToanChamError } = await supabase.from('Chapter4').update(Chapter4InputData).eq('id',Chapter4Data[0].tinhtoancham_id)
      if(InsertTinhToanChamError) {
        console.error("InsertTinhToanChamError", InsertTinhToanChamError)
        return response.status(400).json({ message: InsertTinhToanChamError.message });
      }
    } else {
      // Tạo dữ liệu cho bảng tính toán cấp nhanh
      const CapNhanhId = uuidv4();
      const TinhToanCapNhanhWithId = {
        id: CapNhanhId,
        ...TinhToanNhanh
      }

      // Thêm dữ liệu ban đầu cho bảng Tính toán nhanh
      const {data: insertTinhToanNhanh, error: InsertTinhToanNhanhError } = await supabase.from('TinhToanNhanh').insert([TinhToanCapNhanhWithId])
      if(InsertTinhToanNhanhError) {
        console.error("InsertTinhToanNhanhError", InsertTinhToanNhanhError)
        return response.status(400).json({ message: InsertTinhToanNhanhError.message });
      }

      // Tạo dữ liệu cho bảng tính toán cấp chậm
      const CapChamId = uuidv4();
      const TinhToanCapChamWithId = {
        id: CapChamId,
        ...TinhToanCham
      }

      // Thêm dữ liệu ban đầu cho bảng Tính toán chậm
      const {data: insertTinhToanCham, error: InsertTinhToanChamError } = await supabase.from('TinhToanCham').insert([TinhToanCapChamWithId])
      if(InsertTinhToanChamError) {
        console.error("InsertTinhToanChamError", InsertTinhToanChamError)
        return response.status(400).json({ message: InsertTinhToanChamError.message });
      }

      // Tạo dữ liệu chương 4
      const Chapter4Id = uuidv4();
      const Chapter4InputDataWithId = {
        id: Chapter4Id,
        tinhtoannhanh_id: CapNhanhId,
        tinhtoancham_id: CapChamId,
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
    
    return response.status(200).json({ 
      ASoBoCham: TinhToanCham.aw1_so_bo, 
      ASoBoNhanh: TinhToanNhanh.aw1_so_bo,
      message: 'Đã tính toán xong chương 4',
      success: true
    });
  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
})

Chapter4Routes.route('/chapter4/secondcalculation/:recordid').post(async (request, response) => {
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

    // Lấy data từ bảng Chapter4
    const { data: Chapter4Data, error: Chapter4DataError } = await supabase.from('Chapter4').select('tinhtoannhanh_id, tinhtoancham_id').eq('id', recordData[0].chapter4_id);
    if(Chapter4DataError) {
      console.error("Chapter4DataError", Chapter4DataError)
      return response.status(400).json({ message: Chapter4DataError.message });
    }

    const TinhToanNhanh = TinhToanCapNhanhLanHai(request.body, Chapter2Data[0], Chapter4Data[0]);
    const TinhToanCham = TinhToanCapChamLanHai(request.body, Chapter2Data[0], Chapter4Data[0]);

    const KichThuocNhanh = KichThuocBoTruyenNhanh(request.body, TinhToanNhanh, Chapter2Data[0], Chapter3Data[0], Chapter4Data[0])
    const KichThuocCham = KichThuocBoTruyenCham(request.body, TinhToanCham, Chapter2Data[0], Chapter3Data[0], Chapter4Data[0])

    console.log(KichThuocNhanh, KichThuocCham);

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

function TinhToanCapNhanhCoBan(Chapter4Data, Chapter2Data) {
  const Ka_cap_nhanh = 43;
  const y_ba = 0.3
  const y_bd = Chapter4Function.Y_bd(y_ba, Chapter2Data.he_so_truyen_cap_nhanh);
  const KHB_cap_nhanh = Chapter4Function.KHB_cap_nhanh(y_bd);
  const aw1_so_bo = Chapter4Function.aw1_so_bo(Ka_cap_nhanh, Chapter2Data.he_so_truyen_cap_nhanh, Chapter2Data.t1_ti_so_truyen, KHB_cap_nhanh, Chapter4Data.o_H, y_ba);

  return {
    Ka_cap_nhanh: Ka_cap_nhanh,
    y_ba: y_ba,
    y_bd: y_bd,
    KHB_cap_nhanh: KHB_cap_nhanh,
    aw1_so_bo: aw1_so_bo,
  }
}

function TinhToanCapChamCoBan(Chapter4Data, Chapter2Data) {
  const Ka_cap_cham = 49.5;
  const y_ba = 0.3;
  const y_ba_cap_cham = Chapter4Function.Y_ba_cap_cham(y_ba);
  const y_bd = Chapter4Function.Y_bd(y_ba_cap_cham, Chapter2Data.he_so_truyen_cap_cham);
  const KHB_cap_cham = Chapter4Function.KHB_cap_cham(y_bd);
  const aw1_so_bo = Chapter4Function.aw1_so_bo(Ka_cap_cham, Chapter2Data.he_so_truyen_cap_cham, Chapter2Data.t2_ti_so_truyen, KHB_cap_cham, Chapter4Data.o_H_phay, y_ba_cap_cham);
  return {
    Ka_cap_cham: Ka_cap_cham,
    y_ba_cap_cham: y_ba_cap_cham,
    y_bd: y_bd,
    KHB_cap_cham: KHB_cap_cham,
    aw1_so_bo: aw1_so_bo
  }
}

function TinhToanCapNhanhLanHai(Chapter4Input, Chapter2Data, Chapter4Data) {
  const module_1 = Chapter4Function.module_1(Chapter4Input.khoangCachNghieng);
  const module_2 = Chapter4Function.module_2(Chapter4Input.khoangCachNghieng);
  const z1 = Chapter4Function.z1(40, Chapter4Input.khoangCachNghieng, Chapter4Input.mNghieng, Chapter2Data.he_so_truyen_cap_nhanh);
  const z2 = Chapter4Function.z2(Chapter2Data.he_so_truyen_cap_nhanh, z1);
  const cos_goc_B = Chapter4Function.cos_goc_B(z1, z2,Chapter4Input.khoangCachNghieng, Chapter4Input.mNghieng);
  const goc_B = Chapter4Function.tinh_goc_B(z1, z2,Chapter4Input.khoangCachNghieng, Chapter4Input.mNghieng);
  const u_m = Chapter4Function. ti_so_thuc (z1, z2);
  return {
    module_1: module_1,
    module_2: module_2,
    z1: z1,
    z2: z2,
    cos_goc_B: cos_goc_B,
    goc_B: goc_B,
    u_m: u_m
  }
}

function TinhToanCapChamLanHai(Chapter4Input, Chapter2Data, Chapter4Data) {
  const module_1 = Chapter4Function.module_1(Chapter4Input.khoangCachThang);
  const module_2 = Chapter4Function.module_2(Chapter4Input.khoangCachThang);
  const z1 = Chapter4Function.z1(0, Chapter4Input.khoangCachThang, Chapter4Input.mThang, Chapter2Data.he_so_truyen_cap_cham);
  const z2 = Chapter4Function.z2(Chapter2Data.he_so_truyen_cap_cham, z1);
  const cos_goc_B = 1;
  const goc_B = 0;
  const u_m = Chapter4Function.ti_so_thuc (z1, z2);
  return {
    module_1: module_1,
    module_2: module_2,
    z1: z1,
    z2: z2,
    cos_goc_B: cos_goc_B,
    goc_B: goc_B,
    u_m: u_m
  }
}

function KichThuocBoTruyenNhanh(Chapter4Input, TinhToanNhanh, Chapter2Data, Chapter3Data, Chapter4Data) {
  const dich_chinh_y = 0; 
  const khoang_cach_truc_chia_a = Chapter4Function.KhoangCachTrucChia(Chapter4Input.mNghieng,TinhToanNhanh.z1, TinhToanNhanh.z2, TinhToanNhanh.cos_goc_B);
  const a_w1 = Chapter4Input.khoangCachNghieng;
  const m = Chapter4Input.mNghieng;
  const chieu_rong_vanh_rang_bw = Chapter4Function.ChieuRongVanhRang(Chapter4Input.khoangCachNghieng);
  const u_m = TinhToanNhanh.u_m;
  console.log(Chapter4Input);
  console.log(TinhToanNhanh);
  return {
    dich_chinh_y: dich_chinh_y,
    khoang_cach_truc_chia_a: khoang_cach_truc_chia_a,
    a_w1: a_w1,
    m: m,
    u_m: u_m,
  }
}

function KichThuocBoTruyenCham(Chapter4Input, TinhToanCham, Chapter2Data, Chapter3Data, Chapter4Data) {
  const dich_chinh_y = 0; 
  const khoang_cach_truc_chia_a = Chapter4Function.KhoangCachTrucChia(Chapter4Input.mThang, TinhToanCham.z1, TinhToanCham.z2, TinhToanCham.cos_goc_B);
  a_w1 = Chapter4Input.khoangCachThang;
  const chieu_rong_vanh_rang_bw = Chapter4Function.ChieuRongVanhRang(Chapter4Input.khoangCachThang);
  const u_m = TinhToanCham.u_m;
  const m = Chapter4Input.mThang;
  return {
    dich_chinh_y: dich_chinh_y,
    khoang_cach_truc_chia_a: khoang_cach_truc_chia_a,
    a_w1:a_w1,
    m: m,
    u_m: u_m
  }
}

module.exports = Chapter4Routes;