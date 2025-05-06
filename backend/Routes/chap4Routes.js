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
  const SHlim1 = Chapter4Function.UngSuatTiepXucChoPhep(Chapter4Input.HB1);
  const SHlim2 = Chapter4Function.UngSuatTiepXucChoPhep(Chapter4Input.HB1);
  const Flim1 = Chapter4Function.UngSuatUonChoPhep(Chapter4Input.HB1);

  return {
    SHlim1: SHlim1,
    SHlim2: SHlim2,
    Flim1: Flim1
  }
}

module.exports = Chapter4Routes;