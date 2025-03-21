const express = require('express')
const database = require('./connect')
const machineCalculator = require('./chap2Function')
const { ObjectId } = require('mongodb');

let chap2Routes = express.Router();

// Create new calculation data
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

    const userId = new ObjectId(request.body.userID);
    await db.collection('Users').updateOne(
      { _id: userId }, 
      { $push: { history: insertedId } }
    );

    let engines = await db.collection('EngineList')
    .aggregate([
      {
        $match: {
          cong_suat: { $gte: chap2Object.cong_suat_can_thiet_tren_truc_dong_co },
          van_toc_vong_quay: {
            $gte: chap2Object.so_vong_quay_so_bo * 0.7,
            $lte: chap2Object.so_vong_quay_so_bo * 1.3
          }
        }
      },
      {
        $addFields: {
          cong_suat_diff: { $subtract: ["$cong_suat", chap2Object.cong_suat_can_thiet_tren_truc_dong_co] },
          van_toc_diff: { $abs: { $subtract: ["$van_toc_vong_quay", chap2Object.so_vong_quay_so_bo] } }
        }
      },
      { 
        $sort: { 
          cong_suat_diff: 1, 
          van_toc_diff: 1 
        } 
      },
      { $limit: 3 }
    ]).toArray();

    // let engines = await db.collection('EngineList')
    // .aggregate([
    //   {
    //     $match: {
    //       cong_suat: { $gte: chap2Object.cong_suat_can_thiet_tren_truc_dong_co }
    //     }
    //   },
    //   {
    //     $addFields: {
    //       diff: { $subtract: ["$cong_suat", chap2Object.cong_suat_can_thiet_tren_truc_dong_co] }
    //     }
    //   },
    //   { $sort: { diff: 1, van_toc_vong_quay: 1 } },
    //   { $limit: 3 }
    // ]).toArray();
  
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

    // code thêm ở đây nha quin - khuê

    const updateData = {
      ty_so_truyen_chung: ty_so_truyen_chung,
      he_so_truyen_cap_nhanh: he_so_truyen_cap_nhanh,
      he_so_truyen_cap_cham: he_so_truyen_cap_cham,
      he_so_truyen_dong_xich: he_so_truyen_dong_xich
      // tính xong nhớ truyền biến vô đây
    }

    // console dùng để debug - 
    // console.log calculationData và engineData để thấy các biến trong object và lấy ra sử dụng
    console.log(calculationData, 
      engineData, 
      ty_so_truyen_chung,
      he_so_truyen_cap_nhanh,
      he_so_truyen_cap_cham,
      he_so_truyen_dong_xich,
    );

    // const result = await db.collection('UserInput').updateOne(
    //   {_id: new ObjectId(request.params.idCal)},
    //   { $set: updateData}
    // );
    // if(result.matchedCount === 0)
    //   return response.status(404).json({error: "Item not found"});
    // response.json({message: 'Item updated successfully'});
  } catch(error) {
    response.status(500).json({error: error.message});
  }
})

module.exports = chap2Routes;