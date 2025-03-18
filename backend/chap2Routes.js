const express = require('express')
const database = require('./connect')
const chap2Function = require('./chap2Function')

let chap2Routes = express.Router();

chap2Routes.route('/Chap2').post(async (request, response) => {
  let db = database.getDatabase();

  let chap2Object = {
    luc_vong_bang_tai: request.body.f,
    van_toc_bang_tai: request.body.v,
    duong_kinh_tang_dan: request.body.D,
    thoi_gian_phuc_vu: request.body.L,
    t1: request.body.t1,
    t2: request.body.t2,
    T1: request.body.T1,
    T2: request.body.T2,
    T1_T: request.body.T1_numeric,
    T2_T: request.body.T2_numeric,
    hieu_suat_noi_truc: request.body.nk,
    hieu_suat_o_lan: request.body.nol,
    hieu_suat_banh_rang: request.body.nbr,
    hieu_suat_xich: request.body.nx,
    ty_so_truyen_hop_giam_toc: request.body.uh,
    ty_so_truyen_xich: request.body.ux,
    ty_so_truyen_so_bo: request.body.usb
  }

  const cong_suat_truc_cong_tac = 
    chap2Function.cong_suat_truc_cong_tac(chap2Object.luc_vong_bang_tai, chap2Object.van_toc_bang_tai);

  const hieu_suat_chung = 
    chap2Function.hieu_suat_chung(chap2Object.hieu_suat_noi_truc, chap2Object.hieu_suat_o_lan, chap2Object.hieu_suat_banh_rang, chap2Object.hieu_suat_xich)

  console.log(hieu_suat_chung);
})

module.exports = chap2Routes;