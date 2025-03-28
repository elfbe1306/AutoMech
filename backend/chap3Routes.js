const express = require('express')
const database = require('./connect')
const machineCalculator = require('./chap3Function')
const { ObjectId } = require('mongodb');

let chap3Routes = express.Router();

chap3Routes.route('/Chap3/:id').post(async (request, response) => {
  try {
    let db = database.getDatabase();
    let CalculationHistory = await db.collection('CalculationHistory').findOne({_id: new ObjectId(request.params.id)});
    if(!CalculationHistory) return response.status(404).json({ error: "Item not found" });

    let Chap2Data = await db.collection('Chap2Calculation').findOne({_id: new ObjectId(CalculationHistory.Chap2ID)});
    if(!Chap2Data) return response.status(404).json({ error: "Item not found" });

    const Z1 = machineCalculator.Z1(Chap2Data.he_so_truyen_dong_xich);

    const Z2 = machineCalculator.Z2(Chap2Data.he_so_truyen_dong_xich, Z1);

    //Buoc 3 - Tao bien de luu gia tri tinh toan


    // Buoc 5 - Luu du lieu database
    const Chap3Object = {
      k0: request.body.k0,
      k1: request.body.k1,
      kdc: request.body.kdc,
      kc: request.body.kc,
      kd: request.body.kd,
      kbt: request.body.kbt,
      Z1: Z1,
      Z2: Z2
    }

    // Buoc 4 - In ra man hinh kiem tra tinh toan
    console.log(
      Chap2Data, // Lấy biến (kết quả chương 2) ở trong đối tượng này
      request.body, // Lấy biến (hệ số chương 3) ở trong đối tượng này
      Z1, 
      Z2,

    );

  } catch(error) {
    response.status(500).json({ error: error.message });
  }
}) 

module.exports = chap3Routes;