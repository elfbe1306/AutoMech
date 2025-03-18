const cong_suat_truc_cong_tac = (f, v) => {
  return Number(f) * Number(v) / 1000;
}

const hieu_suat_chung = (nk, nol, nbr, nx) => {
  let result = Number(nk) * Math.pow(Number(nol), 4) * Math.pow(Number(nbr), 3) * Number(nx);
  return result.toFixed(8);
}

const cong_suat_tuong_duong_truc_cong_tac = (Plv, T1_T, T2_T, t1, t2) => {
  let result = 
    Number(Plv)* Math.sqrt((Math.pow(Number(T1_T), 2) * t1 + Math.pow(Number(T2_T), 2) * t2) / (Number(t1) + Number(t2)))
  return result.toFixed(8);
}

const cong_suat_can_thiet_tren_truc_dong_co = (Peq, n) => {
  let result = Number(Peq) / Number(n);
  return result.toFixed(8);
}

const so_vong_quay_truc_cong_tac = (v, D) => {
  let result = 60000 * v / (3.14159265 * D);
  return result.toFixed(8);
}

const so_vong_quay_so_bo = (nlv, usb) => {
  result = Number(nlv) * Number(usb);
  return result.toFixed(8);
}

module.exports = {
  cong_suat_truc_cong_tac,
  hieu_suat_chung,
  cong_suat_tuong_duong_truc_cong_tac,
  cong_suat_can_thiet_tren_truc_dong_co,
  so_vong_quay_truc_cong_tac,
  so_vong_quay_so_bo
}