const express = require('express')
const database = require('./connect')
const machineCalculator = require('./chap2Function')
const { ObjectId } = require('mongodb');

let chap2Routes = express.Router();

// Create new calculation data
chap2Routes.route('/Chap2/:userId').post(async (request, response) => {
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
    machineCalculator.cong_suat_truc_cong_tac(chap2Object.luc_vong_bang_tai, chap2Object.van_toc_bang_tai);

  chap2Object.hieu_suat_chung = 
    machineCalculator.hieu_suat_chung(chap2Object.hieu_suat_noi_truc, chap2Object.hieu_suat_o_lan, chap2Object.hieu_suat_banh_rang, chap2Object.hieu_suat_xich);

  chap2Object.cong_suat_tuong_duong_truc_cong_tac =
    machineCalculator.cong_suat_tuong_duong_truc_cong_tac(chap2Object.cong_suat_truc_cong_tac, chap2Object.T1_T, chap2Object.T2_T, chap2Object.t1, chap2Object.t2);

  chap2Object.cong_suat_can_thiet_tren_truc_dong_co =
    machineCalculator.cong_suat_can_thiet_tren_truc_dong_co(chap2Object.cong_suat_tuong_duong_truc_cong_tac, chap2Object.hieu_suat_chung);

  chap2Object.so_vong_quay_truc_cong_tac = 
    machineCalculator.so_vong_quay_truc_cong_tac(chap2Object.van_toc_bang_tai, chap2Object.duong_kinh_tang_dan);

  chap2Object.so_vong_quay_so_bo =
    machineCalculator.so_vong_quay_so_bo(chap2Object.so_vong_quay_truc_cong_tac, chap2Object.ty_so_truyen_so_bo);
  
  try {
    let db = database.getDatabase();
    await db.collection('EngineList').createIndex({ cong_suat: 1, van_toc_vong_quay: 1 });

    let data = await db.collection('UserInput').insertOne(chap2Object);
    let insertedId = data.insertedId;

    const userId = new ObjectId(request.params.userId);
    await db.collection('Users').updateOne(
      { _id: userId }, 
      { $push: { history: insertedId } }
    );

    let engines = await db.collection('EngineList')
    .aggregate([
      {
        $match: {
          cong_suat: { $gte: chap2Object.cong_suat_can_thiet_tren_truc_dong_co },
          van_toc_vong_quay: { $gte: chap2Object.so_vong_quay_so_bo }
        }
      },
      {
        $addFields: {
          diff: { $subtract: ["$cong_suat", chap2Object.cong_suat_can_thiet_tren_truc_dong_co] },
          van_toc_diff: { $subtract: ["$van_toc_vong_quay", chap2Object.so_vong_quay_so_bo] }
        }
      },
      { $sort: { diff: 1, van_toc_diff: 1 } },
      { $limit: 3 }
    ]).toArray();
  
    response.json({ message: 'Inserted successfully Chap2', _id: data.insertedId, engines: engines });
  } catch(error) {
    response.status(500).json({ error: error.message });
  }
})

// Retrieve calculation data by ID
chap2Routes.route('/Chap2/:id').get(async (request, response) => {
  try {
    let db = database.getDatabase();
    let data = await db.collection('UserInput').findOne({_id: new ObjectId(request.params.id)});
    if (!data) return response.status(404).json({ error: 'Item not found' });

    response.json(data);
  } catch(error) {
    response.status(500).json({ error: error.message });
  }
})

// Update more calculation result
chap2Routes.route('/Chap2/:idCal/:idEngine').put(async (request, response) => {
  try {
    let db = database.getDatabase();
    let calculationData = await db.collection('UserInput').findOne({_id: new ObjectId(request.params.idCal)});
    if (!calculationData) return response.status(404).json({ error: 'Item not found' });

    let engineData = await db.collection('EngineList').findOne({_id: new ObjectId(request.params.idEngine)});
    if (!engineData) return response.status(400).json({error: 'Item not found' });

    const ty_so_truyen_chung = machineCalculator.ty_so_truyen_chung(engineData.van_toc_vong_quay, calculationData.so_vong_quay_truc_cong_tac);

    const he_so_truyen_cap_nhanh = machineCalculator.he_so_truyen_cap_nhanh(calculationData.ty_so_truyen_hop_giam_toc);

    const he_so_truyen_cap_cham = machineCalculator.he_so_truyen_cap_cham(calculationData.ty_so_truyen_hop_giam_toc);

    const he_so_truyen_dong_xich = machineCalculator.he_so_truyen_dong_xich(ty_so_truyen_chung, he_so_truyen_cap_nhanh, he_so_truyen_cap_cham);

    const Pbt = machineCalculator.Pbt(calculationData.cong_suat_truc_cong_tac, calculationData.hieu_suat_o_lan);

    const P3 = machineCalculator.P3(Pbt, calculationData.hieu_suat_xich, calculationData.hieu_suat_o_lan);

    const P2 = machineCalculator.P2(P3, calculationData.hieu_suat_banh_rang, calculationData.hieu_suat_o_lan);

    const P1 = machineCalculator.P1(P2, calculationData.hieu_suat_banh_rang, calculationData.hieu_suat_o_lan);

    const Pm = machineCalculator.Pm(P1, calculationData.hieu_suat_noi_truc);

    const ndc = machineCalculator.ndc(engineData.van_toc_vong_quay);

    const n1 = machineCalculator.n1(engineData.van_toc_vong_quay);

    const n2 = machineCalculator.n2(n1, he_so_truyen_cap_nhanh);

    const n3 = machineCalculator.n3(n2, he_so_truyen_cap_cham);

    const nbt = machineCalculator.nbt(n3, he_so_truyen_dong_xich);

    const T1_ti_so_truyen = machineCalculator.T1_ti_so_truyen(P1, engineData.van_toc_vong_quay);

    const Tm = machineCalculator.Tm(T1_ti_so_truyen);

    const T2_ti_so_truyen = machineCalculator.T2_ti_so_truyen(P2, n2);

    const T3_ti_so_truyen = machineCalculator.T3_ti_so_truyen(P3, n3);

    const Tbt_ti_so_truyen = machineCalculator.Tbt_ti_so_truyen(Pbt,nbt);

    const updateData = {
      ty_so_truyen_chung: ty_so_truyen_chung,
      he_so_truyen_cap_nhanh: he_so_truyen_cap_nhanh,
      he_so_truyen_cap_cham: he_so_truyen_cap_cham,
      he_so_truyen_dong_xich: he_so_truyen_dong_xich,
      Pbt: Pbt,
      P3: P3,
      P2: P2,
      P1: P1,
      Pm: Pm,
      ndc: ndc,
      n1: n1,
      n2: n2,
      n3: n3,
      nbt: nbt,
      T1_ti_so_truyen: T1_ti_so_truyen,
      Tm: Tm,
      T2_ti_so_truyen: T2_ti_so_truyen,
      T3_ti_so_truyen: T3_ti_so_truyen,
      Tbt_ti_so_truyen: Tbt_ti_so_truyen
    }

    const result = await db.collection('UserInput').updateOne(
      {_id: new ObjectId(request.params.idCal)},
      { $set: updateData}
    );
    if(result.matchedCount === 0)
      return response.status(404).json({error: "Item not found"});
    response.json({message: 'Item updated successfully'});
  } catch(error) {
    response.status(500).json({error: error.message});
  }
})

module.exports = chap2Routes;