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
  const us_xoan = 20;
  const duong_kinh_so_bo_truc_d1 = Chapter5Function.duong_kinh_so_bo_truc(us_xoan);

  return {
    us_xoan: us_xoan,
    duong_kinh_so_bo_truc_d1: duong_kinh_so_bo_truc_d1
  }
}

module.exports = Chapter5Routes;