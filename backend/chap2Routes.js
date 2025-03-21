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
  chap2Function.hieu_suat_chung(chap2Object.hieu_suat_noi_truc, chap2Object.hieu_suat_o_lan, chap2Object.hieu_suat_banh_rang, chap2Object.hieu_suat_xich);

const cong_suat_tuong_duong_truc_cong_tac =
  chap2Function.cong_suat_tuong_duong_truc_cong_tac(cong_suat_truc_cong_tac, chap2Object.T1_T, chap2Object.T2_T, chap2Object.t1, chap2Object.t2);

const cong_suat_can_thiet_tren_truc_dong_co =
  chap2Function.cong_suat_can_thiet_tren_truc_dong_co(cong_suat_tuong_duong_truc_cong_tac, hieu_suat_chung);

const so_vong_quay_truc_cong_tac = 
  chap2Function.so_vong_quay_truc_cong_tac(chap2Object.van_toc_bang_tai, chap2Object.duong_kinh_tang_dan);

const so_vong_quay_so_bo =
  chap2Function.so_vong_quay_so_bo(so_vong_quay_truc_cong_tac, chap2Object.ty_so_truyen_so_bo);

const ty_so_truyen_chung = chap2Function.ty_so_truyen_chung(730, so_vong_quay_truc_cong_tac);

const he_so_truyen_dong_xich = chap2Function.he_so_truyen_dong_xich(ty_so_truyen_chung, 3.08, 2.6);

const Pbt = chap2Function.Pbt(cong_suat_truc_cong_tac, chap2Object.hieu_suat_o_lan);

const P3 = chap2Function.P3(Pbt, chap2Object.hieu_suat_xich, chap2Object.hieu_suat_o_lan);

const P2 = chap2Function.P2(P3, chap2Object.hieu_suat_banh_rang, chap2Object.hieu_suat_o_lan);

const P1 = chap2Function.P1(P2, chap2Object.hieu_suat_banh_rang, chap2Object.hieu_suat_o_lan);

const Pm = chap2Function.Pm(P1, chap2Object.hieu_suat_noi_truc);

const n2 =chap2Function.n2(730, 3.08);

const n3 = chap2Function.n3(n2, 2.6);

const nbt = chap2Function.nbt(n3, he_so_truyen_dong_xich);

const T1_ti_so_truyen = chap2Function.T1_ti_so_truyen(P1, 730);

const T2_ti_so_truyen = chap2Function.T2_ti_so_truyen(P2, n2);

const T3_ti_so_truyen = chap2Function.T3_ti_so_truyen(P3,n3);

const Tbt_ti_so_truyen = chap2Function.Tbt_ti_so_truyen(Pbt,nbt);

console.log(
  cong_suat_truc_cong_tac,
  hieu_suat_chung,
  cong_suat_tuong_duong_truc_cong_tac,
  cong_suat_can_thiet_tren_truc_dong_co,
  so_vong_quay_truc_cong_tac,
  so_vong_quay_so_bo,
  ty_so_truyen_chung,
  he_so_truyen_dong_xich,
  Pbt, P3, P2, P1, Pm,
  n2, n3, nbt,
  T1_ti_so_truyen, T2_ti_so_truyen, T3_ti_so_truyen, Tbt_ti_so_truyen, 
);
})

module.exports = chap2Routes;