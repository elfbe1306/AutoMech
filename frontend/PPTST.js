function TSTC(van_toc_quay, so_vong_quay_truc_cong_tac) {
    return van_toc_quay / so_vong_quay_truc_cong_tac;
}
function HSTDX(ty_so_truyen_chung, he_so_truyen_cap_nhanh, he_so_truyen_cap_cham){
    return ty_so_truyen_chung / (he_so_truyen_cap_nhanh * he_so_truyen_cap_cham)
}

const van_toc_quay = 730;
let so_vong_quay_truc_cong_tac = 44.0737;

let ty_so_truyen_chung = TSTC(van_toc_quay, so_vong_quay_truc_cong_tac);
const he_so_truyen_dong_hop = 8;
const he_so_truyen_cap_nhanh = 3.08;
const he_so_truyen_cap_cham = 2.6;
let he_so_truyen_dong_xich = HSTDX(ty_so_truyen_chung, he_so_truyen_cap_nhanh, he_so_truyen_cap_cham);

console.log("Hệ số truyền động xích (ux):", he_so_truyen_dong_xich.toFixed(4));
console.log("Tỷ số truyền chung (u):", ty_so_truyen_chung.toFixed(4));

function calculatePower(P_lv, eta_ol, eta_x, eta_brt, eta_k) {
    let P_bt = P_lv / eta_ol;

    let P3 = P_bt / (eta_x * eta_ol);

    let P2 = P3 / (eta_brt * eta_ol);

    let P1 = P2 / (eta_brt * eta_ol);

    let Pm = P1 / eta_k;

    return { P_bt, P3, P2, P1, Pm };
}


// let cong_suat_truc_cong_tac = 9; 
// let hieu_suat_o_lan = 0.993;
// let hieu_suat_xich = 0.91;
// let hieu_suat_banh_rang = 0.97;
// let hieu_suat_noi_truc = 1;

let results = calculatePower(cong_suat_truc_cong_tac, hieu_suat_o_lan, hieu_suat_xich, hieu_suat_banh_rang, hieu_suat_noi_truc);
console.log({
    P_bt: results.P_bt.toFixed(4),
    P3: results.P3.toFixed(4),
    P2: results.P2.toFixed(4),
    P1: results.P1.toFixed(4),
    Pm: results.Pm.toFixed(4)
});
