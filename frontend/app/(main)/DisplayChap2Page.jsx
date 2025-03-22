import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DisplayResult from '@/components/DisplayResult';
import apiService from '@/api';

const DisplayChap2 = () => {
  const [calculatedData, setCalculateData] = useState("");
  const [calculateID, setCalculateID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataCalculate = await AsyncStorage.getItem("CalculateID");
        if (dataCalculate) {
          setCalculateID(JSON.parse(dataCalculate));
        } else {
          console.log("No data found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (calculateID) {
      const fetchCalculation = async () => {
        try {
          const response = await apiService.chap2GetCalculation(calculateID);
          setCalculateData(response);
          console.log('Calculation Data:', response);
        } catch (error) {
          console.error('Error fetching calculation data:', error);
        }
      };
      fetchCalculation();
    }
  }, [calculateID]);

  return (
    <View style={{margin: 'auto'}}>
      <DisplayResult variable={"F"} value={calculatedData.luc_vong_bang_tai} unit={"N"} />
      <DisplayResult variable={"v"} value={calculatedData.van_toc_bang_tai} unit={"m/s"} />
      <DisplayResult variable={"D"} value={calculatedData.duong_kinh_tang_dan} unit={"mm"} />
      <DisplayResult variable={"L"} value={calculatedData.thoi_gian_phuc_vu} unit={"năm"} />
      <DisplayResult variable={"t1"} value={calculatedData.t1} unit={"giây"} />
      <DisplayResult variable={"t2"} value={calculatedData.t2} unit={"giây"} />
      <DisplayResult variable={"T1"} value={calculatedData.T1} unit={"momem xoắn"} />
      <DisplayResult variable={"T2"} value={calculatedData.T2} unit={"momem xoắn"} />
      <DisplayResult variable={"Công suất trục công tác"} value={calculatedData.cong_suat_truc_cong_tac} unit={""} />
      <DisplayResult variable={"Hiệu suất chung"} value={Number(calculatedData.hieu_suat_chung).toFixed(4)} unit={""} />
      <DisplayResult variable={"Công suất tương đương trục công tác"} value={Number(calculatedData.cong_suat_tuong_duong_truc_cong_tac).toFixed(4)} unit={""} />
      <DisplayResult variable={"Công suất cần thiết trên trục động cơ"} value={Number(calculatedData.cong_suat_can_thiet_tren_truc_dong_co).toFixed(4)} unit={""} />
      <DisplayResult variable={"Số vòng quay trục công tác"} value={Number(calculatedData.so_vong_quay_truc_cong_tac).toFixed(4)} unit={""} />
      <DisplayResult variable={"Số vòng quay sơ bộ"} value={Number(calculatedData.so_vong_quay_so_bo).toFixed(4)} unit={""} />
      <DisplayResult variable={"Tỷ số truyền chung"} value={Number(calculatedData.ty_so_truyen_chung).toFixed(4)} unit={""}/>
      <DisplayResult variable={"Hệ số truyền cấp nhanh"} value={Number(calculatedData.he_so_truyen_cap_nhanh).toFixed(4)} unit={""} />
      <DisplayResult variable={"Hệ số truyền cấp chậm"} value={Number(calculatedData.he_so_truyen_cap_cham).toFixed(4)} unit={""} />
      <DisplayResult variable={"Hệ số truyền động xích"} value={Number(calculatedData.he_so_truyen_dong_xich).toFixed(4)} unit={""} />
      <DisplayResult variable={"Pbt"} value={Number(calculatedData.Pbt).toFixed(4)} unit={"kW"} />
      <DisplayResult variable={"P3"} value={Number(calculatedData.P3).toFixed(4)} unit={"kW"} />
      <DisplayResult variable={"P2"} value={Number(calculatedData.P2).toFixed(4)} unit={"kW"} />
      <DisplayResult variable={"P1"} value={Number(calculatedData.P1).toFixed(4)} unit={"kW"} />
      <DisplayResult variable={"Pm"} value={Number(calculatedData.Pm).toFixed(4)} unit={"kW"} />
      <DisplayResult variable={"nđc"} value={Number(calculatedData.ndc)} unit={"vòng/phút"} />
      <DisplayResult variable={"n1"} value={Number(calculatedData.n1)} unit={"vòng/phút"} />
      <DisplayResult variable={"n2"} value={Number(calculatedData.n2).toFixed(4)} unit={"vòng/phút"} />
      <DisplayResult variable={"n3"} value={Number(calculatedData.n3).toFixed(4)} unit={"vòng/phút"} />
      <DisplayResult variable={"nbt"} value={Number(calculatedData.nbt).toFixed(4)} unit={"vòng/phút"} />
      <DisplayResult variable={"Tm"} value={Number(calculatedData.Tm).toFixed(4)} unit={"N.mm"} />
      <DisplayResult variable={"T1"} value={Number(calculatedData.T1_ti_so_truyen).toFixed(4)} unit={"N.mm"} />
      <DisplayResult variable={"T2"} value={Number(calculatedData.T2_ti_so_truyen).toFixed(4)} unit={"N.mm"} />
      <DisplayResult variable={"T3"} value={Number(calculatedData.T3_ti_so_truyen).toFixed(4)} unit={"N.mm"} />
      <DisplayResult variable={"Tbt"} value={Number(calculatedData.Tbt_ti_so_truyen).toFixed(4)} unit={"N.mm"} />
    </View>
  )
}

export default DisplayChap2

const styles = StyleSheet.create({})