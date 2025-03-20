const express = require('express')
const database = require('./connect')
const chap2Function = require('./chap2Function')
const { ObjectId } = require('mongodb');

let chap2Routes = express.Router();



async function setupIndexes() {
  
}

setupIndexes();

chap2Routes.route('/Chap2').post(async (request, response) => {
  let chap2Object = {
    luc_vong_bang_tai: Number(request.body.f),
    van_toc_bang_tai: Number(request.body.v),
    duong_kinh_tang_dan: Number(request.body.D),
    thoi_gian_phuc_vu: Number(request.body.L),
    t1: Number(request.body.t1),
    t2: Number(request.body.t2),
    T1: request.body.T1,
    T2: request.body.T2,
    T1_T: Number(request.body.T1_numeric),
    T2_T: Number(request.body.T2_numeric),
    hieu_suat_noi_truc: Number(request.body.nk),
    hieu_suat_o_lan: Number(request.body.nol),
    hieu_suat_banh_rang: Number(request.body.nbr),
    hieu_suat_xich: Number(request.body.nx),
    ty_so_truyen_hop_giam_toc: Number(request.body.uh),
    ty_so_truyen_xich: Number(request.body.ux),
    ty_so_truyen_so_bo: Number(request.body.usb)
  }

  chap2Object.cong_suat_truc_cong_tac = 
    chap2Function.cong_suat_truc_cong_tac(chap2Object.luc_vong_bang_tai, chap2Object.van_toc_bang_tai);

  chap2Object.hieu_suat_chung = 
    chap2Function.hieu_suat_chung(chap2Object.hieu_suat_noi_truc, chap2Object.hieu_suat_o_lan, chap2Object.hieu_suat_banh_rang, chap2Object.hieu_suat_xich);

  chap2Object.cong_suat_tuong_duong_truc_cong_tac =
    chap2Function.cong_suat_tuong_duong_truc_cong_tac(chap2Object.cong_suat_truc_cong_tac, chap2Object.T1_T, chap2Object.T2_T, chap2Object.t1, chap2Object.t2);

  chap2Object.cong_suat_can_thiet_tren_truc_dong_co =
    chap2Function.cong_suat_can_thiet_tren_truc_dong_co(chap2Object.cong_suat_tuong_duong_truc_cong_tac, chap2Object.hieu_suat_chung);

  chap2Object.so_vong_quay_truc_cong_tac = 
    chap2Function.so_vong_quay_truc_cong_tac(chap2Object.van_toc_bang_tai, chap2Object.duong_kinh_tang_dan);

  chap2Object.so_vong_quay_so_bo =
    chap2Function.so_vong_quay_so_bo(chap2Object.so_vong_quay_truc_cong_tac, chap2Object.ty_so_truyen_so_bo);
  
  try {
    let db = database.getDatabase();
    await db.collection('EngineList').createIndex({ cong_suat: 1, van_toc_vong_quay: 1 });

    let data = await db.collection('UserInput').insertOne(chap2Object);
    let insertedId = data.insertedId;

    const userId = new ObjectId(request.body.userID);
    await db.collection('Users').updateOne(
      { _id: userId }, 
      { $push: { history: insertedId } }
    );

    let engines = await db.collection('EngineList')
    .find({ cong_suat: { $gte: chap2Object.cong_suat_tuong_duong_truc_cong_tac } })
    .sort({ van_toc_vong_quay: 1 })
    .limit(3).toArray();


    response.json({ message: 'Inserted successfully Chap2', _id: data.insertedId, engines: engines });
  } catch(error) {
    response.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
})

module.exports = chap2Routes;