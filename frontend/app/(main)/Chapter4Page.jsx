import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReturnButton from '@/components/ReturnButton';
import apiService from '@/api';
import { useRouter } from 'expo-router';
import InputField from '@/components/InputField';

const Chapter4Page = () => {
  const router = useRouter();

  const [material, setMaterial] = useState("");
  const [heatTreatment, setHeatTreatment] = useState("");
  const [HB1, setHB1] = useState(250);
  const [HB2, setHB2] = useState(235);
  const [Sb1, setSb1] = useState(0);
  const [Sb2, setSb2] = useState(0);
  const [Sch1, setSch1] = useState(0);
  const [Sch2, setSch2] = useState(0);
  const [c, setC] = useState(1);
  const [ASoboNhanh, setAsoboNhanh] = useState(0);
  const [ASoboCham, setAsoboCham] = useState(0);
  const [khoangCachNghieng, setKhoangCachNghieng] = useState(160);
  const [khoangCachThang, setKhoangCachThang] = useState(215);
  const [mNghieng, setMNghieng] = useState(3);
  const [mThang, setMThang] = useState(2.5);

  const [displayResult, setDisplayResult] = useState(false);

  useEffect(() => {
    const FetchData = async () => {
      const recordID = await AsyncStorage.getItem("RECORDID");
      const response = await apiService.Chapter4PreData(recordID);
  
      const materialMap = {
        1: { material: "Gang xám", heatTreatment: "Tôi, ram" },
        2: { material: "Thép 45", heatTreatment: "Tôi cải thiện" },
        3: { material: "Thép 45", heatTreatment: "Tôi, ram" },
        default: { material: "Thép 15", heatTreatment: "Thấm cacbon, tôi, ram" }
      };
  
      const selected = materialMap[response.material] || materialMap.default;
      setMaterial(selected.material);
      setHeatTreatment(selected.heatTreatment);
    };
  
    FetchData();
  }, []);

  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (HB1 < 192 || HB1 > 285) {
        setLoading(false);
        alert("HB1 phải nằm trong khoảng 192 - 285");
        return;
      }
      if (HB2 < 192 || HB2 > 285) {
        setLoading(false);
        alert("HB2 phải nằm trong khoảng 192 - 285");
        return;
      }
      const hb1min = HB1 - 15;
      const hb1max = HB1 - 10;
      if (HB2 < hb1min || HB2 > hb1max) {
        setLoading(false);
        alert(`HB2 phải nhỏ hơn 10 đến 15 đơn vị so với HB1`);
        return;
      }
      if(c <= 0) {
        setLoading(false);
        alert("c phải lớn hơn 0");
        return;
      }

      if(HB1 >= 192 && HB1 <= 240) {
        setSb1(750);
        setSch1(450);
      } else {
        setSb1(850);
        setSch1(580);
      }

      if(HB2 >= 241 && HB2 <= 285) {
        setSb2(750);
        setSch2(450);
      } else {
        setSb2(850);
        setSch2(580);
      }

      const userData = {
        Sb1: Sb1,
        Sch1: Sch1,
        HB1: HB1,
        Sb2: Sb2,
        Sch2: Sch2,
        HB2: HB2,
        c: c,
      }
      
      const recordID = await AsyncStorage.getItem("RECORDID");
      const response = await apiService.Chapter4Calculation(recordID, userData);
      if(response.success) {
        setAsoboNhanh(response.ASoBoNhanh);
        setAsoboCham(response.ASoBoCham);
        setDisplayResult(true);
      }
    } catch(error) {
      console.error("Error Calculation Chapter 4:" , error);
    } finally {
      setLoading(false);
    }
  }

  const module1 = (aw) => {
    return 0.01*aw;
  }

  const module2 = (aw) => {
    return 0.02*aw;
  }

  const [loadingSecondTime, setLoadingSecondTime] = useState(false);
  const handleSubmitSecondTime = async () => {
    try {
      setLoadingSecondTime(true);
      const userData = {
        mNghieng: mNghieng,
        mThang: mThang,
        khoangCachNghieng: khoangCachNghieng,
        khoangCachThang: khoangCachThang
      }
      
      const recordID = await AsyncStorage.getItem("RECORDID");
      const response = await apiService.Chapter4SecondCalculation(recordID, userData);
      console.log(response.message);

    } catch(error) {
      console.error("Error Second Calculation Chapter 4:" , error);
    } finally {
      setLoadingSecondTime(false);
    }
  }

  return (
    <View>
      <ReturnButton onPress={() => router.back()}/>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TÍNH TOÁN BỘ TRUYỀN HỞ</Text>
      </View>

      <View>
        <Text>{material} - {heatTreatment}</Text>
      </View>

      <InputField
        label="Chọn độ cứng của bánh răng nhỏ"
        sublabel="(192 - 285)"
        value={HB1.toString()}
        onChange={(text) => setHB1(Number(text))}
      />

      <InputField
        label="Chọn độ cứng của bánh răng lớn"
        sublabel="(192 - 285)"
        value={HB2.toString()}
        onChange={(text) => setHB2(Number(text))}
      />

      <InputField
        label="Chọn số lần ăn khớp 1 vòng quay c"
        sublabel="()"
        value={c.toString()}
        onChange={(text) => setC(Number(text))}
      />

      <TouchableOpacity style={styles.doMathButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.doMathButtonText}>Tính chương 4</Text>
      </TouchableOpacity>

      {displayResult && (
        <View>
          <Text>
            Aw1 Tính Toán Nhanh {Number(ASoboNhanh).toFixed(4)}
          </Text>
          <Text>
            Aw1 Tính Toán Chậm {Number(ASoboCham).toFixed(4)}
          </Text>

          <InputField
            label="Chọn khoảng cách trục cơ bộ cho cấp nghiêng"
            sublabel="()"
            value={khoangCachNghieng.toString()}
            onChange={(text) => setKhoangCachNghieng(Number(text))}
          />

          <InputField
            label="Chọn khoảng cách trục cơ bộ cho cấp thẳng"
            sublabel="()"
            value={khoangCachThang.toString()}
            onChange={(text) => setKhoangCachThang(Number(text))}
          />

          <InputField
            label="Chọn module m của tính toán trụ nghiêng"
            sublabel="()"
            value={mNghieng.toString()}
            onChange={(text) => setMNghieng(Number(text))}
          />

          <InputField
            label="Chọn module m của tính toán trụ thẳng"
            sublabel="()"
            value={mThang.toString()}
            onChange={(text) => setMThang(Number(text))}
          />

          <TouchableOpacity style={styles.doMathButton} onPress={handleSubmitSecondTime} disabled={loadingSecondTime}>
            <Text style={styles.doMathButtonText}>Tính chương 4 Second Time</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default Chapter4Page

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20%'
  },
  title: {
    fontFamily: 'quicksand-bold',
    fontSize: 20,
    color: 'rgb(33, 53, 85)'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  inputFieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5
  },
  inputField: {
    color: 'rgb(58, 65, 99)',
    fontFamily: 'quicksand-bold',
    fontSize: 14,
  },
  input: {
    borderColor: '#213555',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    shadowOffset: {width:0, height:4,},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
    marginRight: 15
  },
  doMathButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgb(33,53,85)',
    borderRadius: 10,
    marginBottom:5
  },
  doMathButtonText: {
    color: 'white',
    fontFamily: 'quicksand-semibold',
    fontSize: 16
  }
})