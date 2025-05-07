
class Chapter4 {
  ThoiGianPhucVu = (tg) => {
    return tg * 300 * 2 * 8;
  }

  UngSuatTiepXucChoPhep = (HB) => {
    return 2 * HB + 70;
  }

  UngSuatUonChoPhep = (HB) => {
    return 1.8 * HB;
  }

  UngSuatTiepXuc_O_H = (o_Hlim1,KHL, SH) => {
    return (o_Hlim1*KHL)/SH;
  }

  UngSuatUon_O_F = (o_Flim,KFC,KFL, SF) => {
    return (o_Flim*KFC*KFL)/SF;
  }

  UngSuatTiepXucChoPhepCapNhanh = (o_H1,o_H2) => {
    return (o_H1 + o_H2)/2;
  }

  UngSuatTiepXucQuaTaiChoPhep = (sch2) => {
    return 2.8*sch2;
  }

  UngSuatUonQuaTaiChoPhep = (sch) => {
    return 0.8*sch;
  }


  SoCKThayDoiUsKhiThuTiepXuc = (HB) => {
    return 30 * Math.pow(HB, 2.4);
  }

  NHE1 = (c, Lg, n1, t1_t, t2_t, t1, t2) => {
    return 60 * c * Lg * n1 * (Math.pow(t1_t, 3) * t1 + Math.pow(t2_t, 3) * t2)/(t1 + t2);
  }

  NHE2 = (NHE1, u1) => {
    return NHE1/u1;
  }

  NFE1 = (c, Lg, n1, t1_t, t2_t, t1, t2, mF) => {
    return 60 * c * Lg * n1 * (Math.pow(t1_t, mF) * t1 + Math.pow(t2_t, mF) * t2)/(t1 + t2);
  }

  NFE2 = (NFE1, u1) => {
    return NFE1/u1;
  }
}

module.exports = Chapter4;