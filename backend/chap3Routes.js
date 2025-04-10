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

Chapter3Routes.route('/chapter3/:recordid').post(async (request, response) => {
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

  } catch(error) {
    return response.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}) 

module.exports = Chapter3Routes;