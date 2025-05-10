const express = require('express')
const MachineCalculatorFactory = require('../MachineCalculator');
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../config.env' });

let Chapter5Routes = express.Router();
const Chapter5Function = MachineCalculatorFactory.getChapter("Chapter5");

Chapter5Routes.route('/chapter5/:recordid').post(async (request, response) => {
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
    const { data: Chapter4Data, error: Chapter4DataError } = await supabase.from('Chapter4').select('*').eq('id', recordData[0].chapter4_id);
    if(Chapter4DataError) {
      console.error("Chapter4DataError", Chapter4DataError)
      return response.status(400).json({ message: Chapter4DataError.message });
    }

    const TinhToan1 = TinhToanTruc(Chapter2Data[0], Chapter3Data[0], Chapter4Data[0]);

    console.log(TinhToan1)

  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
})

function TinhToanTruc(Chapter2Data, Chapter3Data, Chapter4Data) {
  const us_xoan = 20; // người dùng chọn
  const duong_kinh_so_bo_truc_d1 = Chapter5Function.duong_kinh_so_bo_truc_d1(Chapter2Data.t1_ti_so_truyen, us_xoan);
  const duong_kinh_so_bo_truc_d2 = Chapter5Function.duong_kinh_so_bo_truc(Chapter2Data.t2_ti_so_truyen, us_xoan);
  const duong_kinh_so_bo_truc_d3 = Chapter5Function.duong_kinh_so_bo_truc(Chapter2Data.t3_ti_so_truyen, us_xoan);
  const bo1 = Chapter5Function.chieu_rong_o_lan(duong_kinh_so_bo_truc_d1);
  const bo2 = Chapter5Function.chieu_rong_o_lan(duong_kinh_so_bo_truc_d2);
  const bo3 = Chapter5Function.chieu_rong_o_lan(duong_kinh_so_bo_truc_d3);
  const k1 = 12; // người dùng chọn từ khoảng quy định theo sách 8..15
  const k2 = 10; // người dùng chọn từ khoảng quy định theo sách 5..15
  const k3 = 15; // người dùng chọn từ khoảng quy định theo sách 10..20
  const h_n = 17; // người dùng chọn từ khoảng quy định theo sách 15..20
  

  return {
    us_xoan: us_xoan,
    duong_kinh_so_bo_truc_d1: duong_kinh_so_bo_truc_d1,
    duong_kinh_so_bo_truc_d2: duong_kinh_so_bo_truc_d2,
    duong_kinh_so_bo_truc_d3: duong_kinh_so_bo_truc_d3,
    bo1: bo1,
    bo2: bo2,
    bo3: bo3
  }
}

module.exports = Chapter5Routes;