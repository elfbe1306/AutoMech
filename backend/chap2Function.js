const PI = 3.141592653589;

const cong_suat_truc_cong_tac = (f, v) => {
  return Number(f) * Number(v) / 1000;
}

const hieu_suat_chung = (nk, nol, nbr, nx) => {
  let result = Number(nk) * Math.pow(Number(nol), 4) * Math.pow(Number(nbr), 3) * Number(nx);
  return Number(result.toFixed(12));
}

const cong_suat_tuong_duong_truc_cong_tac = (Plv, T1_T, T2_T, t1, t2) => {
  let result = 
    Number(Plv)* Math.sqrt((Math.pow(Number(T1_T), 2) * t1 + Math.pow(Number(T2_T), 2) * t2) / (Number(t1) + Number(t2)))
  return Number(result.toFixed(12));
}

const cong_suat_can_thiet_tren_truc_dong_co = (Peq, n) => {
  let result = Number(Peq) / Number(n);
  return Number(result.toFixed(12));
}

const so_vong_quay_truc_cong_tac = (v, D) => {
  let result = 60000 * v / (PI * D);
  return Number(result.toFixed(12));
}

const so_vong_quay_so_bo = (nlv, usb) => {
  result = Number(nlv) * Number(usb);
  return Number(result.toFixed(12));
}

const ty_so_truyen_chung = (ndc, nlv) => {
  result = Number(ndc) / Number(nlv);
  return Number(result.toFixed(12));
}

const he_so_truyen_cap_nhanh = (uh) => {
  const data = {
    6: 2.54, 
    8: 3.08, 
    10: 3.58,
    12: 4.05,
    14: 4.49,
    16: 4.91,
    18: 5.31,
    20: 5.69,
    22: 6.07,
    24: 6.42,
    26: 6.77,
    28: 7.12,
    30: 7.45,
  }
  return Number(data[uh]);
}

const he_so_truyen_cap_cham = (uh) => {
  const data = {
    6: 2.36, 
    8: 2.60, 
    10: 2.79,
    12: 2.97,
    14: 3.12,
    16: 3.26,
    18: 3.39,
    20: 3.51,
    22: 3.63,
    24: 3.74,
    26: 3.84,
    28: 3.94,
    30: 4.03,
  }
  return Number(data[uh]);
}

const he_so_truyen_dong_xich = (ty_so_truyen_chung, he_so_truyen_cap_nhanh, he_so_truyen_cap_cham) => {
  const result = Number(ty_so_truyen_chung) / (Number(he_so_truyen_cap_nhanh) * Number(he_so_truyen_cap_cham));
  return Number(result.toFixed(12));
}

// Code thêm hàm ở đây nha Quin - Khuê

module.exports = {
  cong_suat_truc_cong_tac,
  hieu_suat_chung,
  cong_suat_tuong_duong_truc_cong_tac,
  cong_suat_can_thiet_tren_truc_dong_co,
  so_vong_quay_truc_cong_tac,
  so_vong_quay_so_bo,
  ty_so_truyen_chung,
  he_so_truyen_cap_nhanh,
  he_so_truyen_cap_cham,
  he_so_truyen_dong_xich
}