import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { chap2GetCalculation } from '../../api'
import ReturnButton from '@/components/ReturnButton'
import { useRouter } from 'expo-router'
import Collapsible from 'react-native-collapsible';

const EngineSelectPage = () => {
  const router = useRouter();

  const [engines, setEngines] = useState(null);
  const [calculateID, setCalculateID] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [calculatedData, setCalculateData] = useState({
    luc_vong_bang_tai: "",
    van_toc_bang_tai: "",
    duong_kinh_tang_dan: "",
    thoi_gian_phuc_vu: "",
    T1: "",
    T2: "",
    t1: "",
    t2: "",
    cong_suat_truc_cong_tac: "",
    hieu_suat_chung: "",
    cong_suat_tuong_duong_truc_cong_tac: "",
    cong_suat_can_thiet_tren_truc_dong_co: "",
    so_vong_quay_truc_cong_tac: "",
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataEngine = await AsyncStorage.getItem("EngineSelect");
        const dataCalculate = await AsyncStorage.getItem("CalculateID");
        if (dataEngine && dataCalculate) {
          setEngines(JSON.parse(dataEngine));
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
          const response = await chap2GetCalculation(calculateID);
          setCalculateData(response.data);
          console.log('Calculation Data:', response.data);
        } catch (error) {
          console.error('Error fetching calculation data:', error);
        }
      };
      fetchCalculation();
    }
  }, [calculateID]);

  return (
    <View>
      <ReturnButton onPress={() => router.back()}/>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TÍNH TOÁN</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Các thông số đầu vào</Text>
        <View style={styles.displayRow}>
          <View style={styles.displayColumn}>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>F:</Text> {calculatedData.luc_vong_bang_tai} N</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>v:</Text> {calculatedData.van_toc_bang_tai} m/s</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>D:</Text> {calculatedData.duong_kinh_tang_dan} mm</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>L:</Text> {calculatedData.thoi_gian_phuc_vu} năm</Text>
          </View>
          <View style={styles.displayColumn}>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>t1:</Text> {calculatedData.t1} giây</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>t2:</Text> {calculatedData.t2} giây</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>T1:</Text> {calculatedData.T1} momem xoắn</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>T2:</Text> {calculatedData.T2} momem xoắn</Text>
          </View>
        </View>
        <Text style={styles.resultTitle}>Kết quả tính toán và chọn động cơ</Text>
        <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.collapseButton}>
          <Text style={styles.buttonText}>Kết quả tính toán tổng quan</Text>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapsed}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}></Text>
            <Text style={styles.resultText}>Công suất: 150 kW</Text>
            <Text style={styles.resultText}>Hiệu suất: 90%</Text>
          </View>
        </Collapsible>
      </View>
    </View>
  )
}

export default EngineSelectPage

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30%'
  },
  title: {
    fontFamily: 'quicksand-bold',
    fontSize: 24,
    color: 'rgb(33, 53, 85)'
  },
  inputContainer: {
    marginTop: '5%',
    marginHorizontal: '10%'
  },
  inputTitle: {
    fontFamily: 'quicksand-semibold',
    fontSize: 16,
    color: 'rgb(33, 53, 85)'
  },
  displayRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  displayColumn: {
    flex: 1
  },
  displayVar: {
    fontFamily: 'quicksand-bold',
    color: 'rgb(33, 53, 85)'
  },
  displayNum: {
    fontFamily: 'quicksand',
    color: 'rgb(33, 53, 85)'
  },
  resultTitle: {
    marginTop: 10,
    fontFamily: 'quicksand-semibold',
    fontSize: 16,
    color: 'rgb(33, 53, 85)'
  },
  collapseButton: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgb(33, 53, 85)',
    borderRadius: 25
  },
  buttonText: {
    fontFamily: 'quicksand-medium',
    fontSize: 12,
    color: 'rgb(33, 53, 85)'
  }
})