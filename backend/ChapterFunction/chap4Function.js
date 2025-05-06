
class Chapter4 {
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


}

module.exports = Chapter4;