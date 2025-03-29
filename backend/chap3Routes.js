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

    const n01 = 200;
    const Z01 = 25;
    const Da = 0.003;
    const Z1 = machineCalculator.Z1(Chap2Data.he_so_truyen_dong_xich);

    const Z2 = machineCalculator.Z2(Chap2Data.he_so_truyen_dong_xich, Z1);

    //Buoc 3 - Tao bien de luu gia tri tinh toan
    const kz = machineCalculator.kz(Z01);

    const kn = machineCalculator.kn(n01, Chap2Data.n3);

    const k = machineCalculator.k(request.body.k0, request.body.ka, request.body.kdc, request.body.kbt, request.body.kd, request.body.kc);

    const Pt = machineCalculator.cong_suat_tinh_toan(Chap2Data.P3, k, kz, kn);

    const P = machineCalculator.cong_suat_cho_phep(n01, Pt);

    const p = machineCalculator.buoc_xich(n01, P);

    const khoang_cach_truc = machineCalculator.khoang_cach_truc(p);

    const x = machineCalculator.so_mat_xich(khoang_cach_truc, p, Z01, Z2);

    const a_star = machineCalculator.tinh_lai_khoang_cach_truc(p, x, Z01, Z2);

    const delta_a = machineCalculator.delta_a(Da, a_star);

    const a = machineCalculator.a(a_star, delta_a);

    const i = machineCalculator.so_lan_va_dap_cua_xich(Z01, Chap2Data.n3, x);

    const Q = machineCalculator.tai_trong_pha_hong(p);

    const q = machineCalculator.khoi_luong_1m_xich(p);

    const v = machineCalculator.v(Z01, p, Chap2Data.n3);

    const Ft = machineCalculator.Ft(Chap2Data.P3, v);

    const Fv = machineCalculator.Fv(q, v);

    const F0 = machineCalculator.F0(q, a);

    const s = machineCalculator.he_so_an_toan(Q, request.body.kd, Ft, F0, Fv);

    const d1 = machineCalculator.d1(p,Z01);

    const d2 = machineCalculator.d2(p,Z2);

    const da1 = machineCalculator.da1 (p,Z01);

    const da2 = machineCalculator.da1 (p,Z2);

    const d1_chon_bang = machineCalculator.d1_chon_bang (p);

    const r = machineCalculator.r(d1_chon_bang);

    const df1 = machineCalculator.df1(d1, r);

    const df2 = machineCalculator.df2(d2,r);

    const Fvd = machineCalculator.Fvd (Chap2Data.n3, p);

    const A_dt = machineCalculator.A_dt(p);

    const Fr =machineCalculator.Fr (Ft);

    const oH1 = machineCalculator.oH1 (request.body.kd,Ft, Fvd, A_dt)

    const oH2 = machineCalculator.oH2(request.body.kd,Ft, Fvd, A_dt)
    // Buoc 5 - Luu du lieu database
    const Chap3Object = {
      k0: request.body.k0,
      ka: request.body.ka,
      kdc: request.body.kdc,
      kc: request.body.kc,
      kd: request.body.kd,
      kbt: request.body.kbt,
      Z1: Z1,
      Z2: Z2,
      n01: Number(request.body.n01),
      kz: kz,
      kn: kn,
      k: k,
      Pt: Pt,
      p: p,
      khoang_cach_truc: khoang_cach_truc,
      x: x,
      a_star: a_star,
      Da: request.body.Da,
      delta_a: delta_a,
      a: a,
      i: i,
      Q: Q,
      q: q,
      v: v,
      Ft: Ft,
      Fv: Fv,
      F0: F0,
      s: s,
      d1: d1,
      d2: d2,
      da1: da1,
      da2: da2,
      d1_chon_bang: d1_chon_bang,
      r: r,
      df1: df1,
      df2: df2,
      Fvd:Fvd,
      A_dt:A_dt,
      Fr:Fr,
      oH1: oH1,
      oH2: oH2
    }

    // Buoc 4 - In ra man hinh kiem tra tinh toan
    console.log(
      // Chap2Data, // Lấy biến (kết quả chương 2) ở trong đối tượng này
      // request.body, // Lấy biến (hệ số chương 3) ở trong đối tượng này
      // Z1, 
      // Z2,
      // kz, kn, k, Pt, p,
      // khoang_cach_truc,
      // x, a_star, delta_a, a, i,
      Q, q, v, Ft, Fv, F0, s,
      d1, d2, da1, da2,
      d1_chon_bang,
      r, df1, df2,
      Fvd, A_dt, Fr,
      oH1, oH2
    );

  } catch(error) {
    response.status(500).json({ error: error.message });
  }
}) 

module.exports = chap3Routes;