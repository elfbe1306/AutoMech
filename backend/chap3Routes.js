const express = require('express')
const database = require('./connect')
const MachineCalculator = require('./MachineCalculator')
const { ObjectId } = require('mongodb');

let chap3Routes = express.Router();
const Chapter3Function = MachineCalculator("Chapter3");

chap3Routes.route('/Chap3/:id').post(async (request, response) => {
  try {
    let db = database.getDatabase();
    let CalculationHistory = await db.collection('CalculationHistory').findOne({_id: new ObjectId(request.params.id)});
    if(!CalculationHistory) return response.status(404).json({ error: "Item not found" });

    let Chap2Data = await db.collection('Chap2Calculation').findOne({_id: new ObjectId(CalculationHistory.Chap2ID)});
    if(!Chap2Data) return response.status(404).json({ error: "Item not found" });

    const n01 = 200;
    const Z01 = 25;
    const Da = request.body.Da;
    const Z1 = Chapter3Function.Z1(Chap2Data.he_so_truyen_dong_xich);

    const Z2 = Chapter3Function.Z2(Chap2Data.he_so_truyen_dong_xich, Z1);

    const kz = Chapter3Function.kz(Z01);

    const kn = Chapter3Function.kn(n01, Chap2Data.n3);

    const k = Chapter3Function.k(request.body.k0, request.body.ka, request.body.kdc, request.body.kbt, request.body.kd, request.body.kc);

    const Pt = Chapter3Function.cong_suat_tinh_toan(Chap2Data.P3, k, kz, kn);

    const P = Chapter3Function.cong_suat_cho_phep(n01, Pt);

    const p = Chapter3Function.buoc_xich(n01, P);

    const khoang_cach_truc = Chapter3Function.khoang_cach_truc(p);

    const x = Chapter3Function.so_mat_xich(khoang_cach_truc, p, Z01, Z2);

    const a_star = Chapter3Function.tinh_lai_khoang_cach_truc(p, x, Z01, Z2);

    const delta_a = Chapter3Function.delta_a(Da, a_star);

    const a = Chapter3Function.a(a_star, delta_a);

    const i = Chapter3Function.so_lan_va_dap_cua_xich(Z01, Chap2Data.n3, x);

    const Q = Chapter3Function.tai_trong_pha_hong(p);

    const q = Chapter3Function.khoi_luong_1m_xich(p);

    const v = Chapter3Function.v(Z01, p, Chap2Data.n3);

    const Ft = Chapter3Function.Ft(Chap2Data.P3, v);

    const Fv = Chapter3Function.Fv(q, v);

    const F0 = Chapter3Function.F0(q, a);

    const s = Chapter3Function.he_so_an_toan(Q, request.body.kd, Ft, F0, Fv);

    const d1 = Chapter3Function.d1(p,Z01);

    const d2 = Chapter3Function.d2(p,Z2);

    const da1 = Chapter3Function.da1 (p,Z01);

    const da2 = Chapter3Function.da1 (p,Z2);

    const d1_chon_bang = Chapter3Function.d1_chon_bang (p);

    const r = Chapter3Function.r(d1_chon_bang);

    const df1 = Chapter3Function.df1(d1, r);

    const df2 = Chapter3Function.df2(d2,r);

    const Fvd = Chapter3Function.Fvd (Chap2Data.n3, p);

    const A_dt = Chapter3Function.A_dt(p);

    const Fr =Chapter3Function.Fr (Ft);

    const oH1 = Chapter3Function.oH1 (request.body.kd,Ft, Fvd, A_dt)

    const oH2 = Chapter3Function.oH2(request.body.kd,Ft, Fvd, A_dt)

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
      request.body, // Lấy biến (hệ số chương 3) ở trong đối tượng này
      // Z1, 
      // Z2,
      // kz, kn, k, Pt, p,
      // khoang_cach_truc,
      // x, a_star, delta_a, a, i,
      // Q, q, v, Ft, Fv, F0, s,
      // d1, d2, da1, da2,
      // d1_chon_bang,
      // r, df1, df2,
      // Fvd, A_dt, Fr,
      // oH1, oH2
    );

  } catch(error) {
    response.status(500).json({ error: error.message });
  }
}) 

module.exports = chap3Routes;