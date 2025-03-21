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

  const [F, setF] = useState(0);
  const [v, setV] = useState(0);
  const [D, setD] = useState(0);
  const [L, setL] = useState(0);
  const [t1, setT1] = useState(0);
  const [t2, setT2] = useState(0);
  const [T1, setT1M] = useState(0);
  const [T2, setT2M] = useState(0);
  
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
          console.log('Calculation Data:', response.data);
          setF(response.data.luc_vong_bang_tai);
          setV(response.data.van_toc_bang_tai);
          setD(response.data.duong_kinh_tang_dan);
          setL(response.data.thoi_gian_phuc_vu);
          setT1(response.data.t1);
          setT2(response.data.t2);
          setT1M(response.data.T1);
          setT2M(response.data.T2);
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
            <Text style={styles.displayNum}><Text style={styles.displayVar}>F:</Text> {F} N</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>v:</Text> {v} m/s</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>D:</Text> {D} mm</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>L:</Text> {L} năm</Text>
          </View>
          <View style={styles.displayColumn}>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>t1:</Text> {t1} giây</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>t2:</Text> {t2} giây</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>T1:</Text> {T1} momem xoắn</Text>
            <Text style={styles.displayNum}><Text style={styles.displayVar}>T2:</Text> {T2} momem xoắn</Text>
          </View>
        </View>
        <Text style={styles.resultTitle}>Kết quả tính toán và chọn động cơ</Text>
        <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)} style={styles.collapseButton}>
          <Text style={styles.buttonText}>Kết quả tính toán tổng quan</Text>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapsed}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Động cơ phù hợp: Động cơ XYZ</Text>
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