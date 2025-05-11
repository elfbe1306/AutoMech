const express = require('express')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../config.env' });

let HistoryRoutes = express.Router();

HistoryRoutes.route('/fetchcalculation/:recordid').post(async (request, response) => {
    const supabase = request.supabase;
    const record_id = jwt.decode(request.params.recordid, process.env.SECRET_KEY);

    try {
      // Lấy data từ history record
      const { data: recordData, error: recordDataError } = await supabase.from('HistoryRecord').select('*').eq('id', record_id.id);
      if (recordDataError) {
        console.error("recordDataError", recordDataError)
        return response.status(400).json({ message: recordDataError.message });
      }

      // Lấy data động cơ
      const { data: EngineData, error: EngineDataError } = await supabase.from('Engine').select('*').eq('id', recordData[0].engine_id);
      if(EngineDataError) {
        console.error("EngineDataError", EngineDataError)
        return response.status(400).json({ message: EngineDataError.message });
      }

      // Lấy data từ bảng Chapter3
      const { data: Chapter3Data, error: Chapter3DataError } = await supabase.from('Chapter3').select('so_mat_xich, v, z1, z2, oh1, oh2').eq('id', recordData[0].chapter3_id);
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

      // Lấy data từ bảng Tính Toán Nhanh
      const { data: NhanhData, error: NhanhDataError } = await supabase.from('TinhToanNhanh').select('khoangCachNghieng, z1, z2, duong_kinh_dinh_rang_da1, duong_kinh_dinh_rang_da2').eq('id', Chapter4Data[0].tinhtoannhanh_id);
      if(NhanhDataError) {
        console.error("NhanhDataError", NhanhDataError)
        return response.status(400).json({ message: NhanhDataError.message });
      }

      // Lấy data từ bảng Tính Toán Chậm
      const { data: ChamData, error: ChamDataError } = await supabase.from('TinhToanCham').select('khoangCachThang, z1, z2, duong_kinh_dinh_rang_da1, duong_kinh_dinh_rang_da2').eq('id', Chapter4Data[0].tinhtoancham_id);
      if(ChamDataError) {
        console.error("ChamDataError", ChamDataError)
        return response.status(400).json({ message: ChamDataError.message });
      }

      // Lấy data từ bảng Chapter5
      const { data: Chapter5Data, error: Chapter5DataError } = await supabase.from('Chapter5').select('table1, table2, table3').eq('id', recordData[0].chapter5_id);
      if(Chapter5DataError) {
        console.error("Chapter5DataError", Chapter5DataError)
        return response.status(400).json({ message: Chapter5DataError.message });
      }

      const material = SelectMaterial(Chapter3Data[0].v, Chapter3Data[0].z1, Chapter3Data[0].z2, Chapter3Data[0].oh1, Chapter3Data[0].oh2)
      const returnData = {
        engine: EngineData[0],
        chapter3: Chapter3Data[0],
        tinhToanNhanh: NhanhData[0],
        tinhToanCham: ChamData[0],      
        material: material,
        table1: Chapter5Data[0].table1,
        table2: Chapter5Data[0].table2,
        table3: Chapter5Data[0].table3
      }

      return response.status(200).json({ 
        returnData: returnData,
        message: 'Đã lấy xong data pdf',
        success: true
      });
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

module.exports = HistoryRoutes;