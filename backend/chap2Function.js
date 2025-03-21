const PI = 3.141592653589;

const cong_suat_truc_cong_tac = (f, v) => {
  return Number(f) * Number(v) / 1000;
}

const hieu_suat_chung = (nk, nol, nbr, nx) => {
  let result = Number(nk) * Math.pow(Number(nol), 4) * Math.pow(Number(nbr), 3) * Number(nx);
  return result.toFixed(12);
}

const cong_suat_tuong_duong_truc_cong_tac = (Plv, T1_T, T2_T, t1, t2) => {
  let result = 
    Number(Plv)* Math.sqrt((Math.pow(Number(T1_T), 2) * t1 + Math.pow(Number(T2_T), 2) * t2) / (Number(t1) + Number(t2)))
  return result.toFixed(12);
}

const cong_suat_can_thiet_tren_truc_dong_co = (Peq, n) => {
  let result = Number(Peq) / Number(n);
  return result.toFixed(12);
}

const so_vong_quay_truc_cong_tac = (v, D) => {
  let result = 60000 * v / (PI * D);
  return result.toFixed(12);
}

const so_vong_quay_so_bo = (nlv, usb) => {
  result = Number(nlv) * Number(usb);
  return result.toFixed(12);
}

const ty_so_truyen_chung = (ndc, nlv) => {
  result = Number(ndc) / Number(nlv);
  return result.toFixed(12);
}

const he_so_truyen_dong_xich = (u, u1, u2) => {
  result = Number(u) / (Number(u1) * Number(u2));
  return result.toFixed(12);
}

const Pbt = (Plv, eta_ol) => {
  result = Number(Plv) / Number(eta_ol);
  return result.toFixed(12);
}

const P3 = (Pbt, eta_x, eta_ol) => {
  result = Number(Pbt) / (Number(eta_x) * Number(eta_ol));
  return result.toFixed(12);
}

const P2 = (P3, eta_brt, eta_ol) => {
  result = Number(P3) / (Number(eta_brt) * Number(eta_ol));
  return result.toFixed(12);
}

const P1 = (P2, eta_brt, eta_ol) => {
  result = Number(P2) / (Number(eta_brt) * Number(eta_ol));
  return result.toFixed(12);
}

const Pm = (P1, eta_k) => {
  result = Number(P1) / Number(eta_k);
  return result.toFixed(12);
}

const n2 = (n1, u1) => {
  result = Number(n1) / Number (u1);
  return result.toFixed(12);
}

const n3 = (n2, u2) => {
  result = Number(n2) / Number(u2);
  return result.toFixed(12);
}

const nbt = (n3, ux) => {
  result = Number (n3) / Number(ux);
  return result.toFixed(12);
}

const T1_ti_so_truyen = (P1, n1) => {
  result = (9.55 * Math.pow(10, 6) * Number(P1)) / Number(n1);
  return result.toFixed(12);
}

const T2_ti_so_truyen = (P2, n2) => {
  result = (9.55 * Math.pow(10, 6) * Number(P2)) / Number(n2);
  return result.toFixed(12);
}

const T3_ti_so_truyen = (P3, n3) => {
  result = (9.55 * Math.pow(10, 6) * Number(P3)) / Number(n3);
  return result.toFixed(12);
}

const Tbt_ti_so_truyen = (Pbt, nbt) => {
  result = (9.55 * Math.pow(10, 6) * Number(Pbt)) / Number(nbt);
  return result.toFixed(12);
}

module.exports = {
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
  T1_ti_so_truyen, T2_ti_so_truyen, T3_ti_so_truyen, Tbt_ti_so_truyen
}