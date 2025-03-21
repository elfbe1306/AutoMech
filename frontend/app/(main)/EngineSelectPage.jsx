import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { chap2GetCalculation } from '../../api'
import ReturnButton from '@/components/ReturnButton'
import { useRouter } from 'expo-router'
import Collapsible from 'react-native-collapsible';
import DisplayResult from '@/components/DisplayResult'
import EngineCard from '@/components/EngineCard'

const EngineSelectPage = () => {
  const router = useRouter();

  const [engines, setEngines] = useState(null);
  const [calculateID, setCalculateID] = useState("");
  const [isCollapsedResult, setIsCollapsedResult] = useState(true);
  const [isCollapsedEngine, setIsCollapsedEngine] = useState(true);
  const [selectedEngineId, setSelectedEngineId] = useState(null);
  

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
    so_vong_quay_so_bo: ""
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
            <DisplayResult variable={"F"} value={calculatedData.luc_vong_bang_tai} unit={"N"} />
            <DisplayResult variable={"v"} value={calculatedData.van_toc_bang_tai} unit={"m/s"} />
            <DisplayResult variable={"D"} value={calculatedData.duong_kinh_tang_dan} unit={"mm"} />
            <DisplayResult variable={"L"} value={calculatedData.thoi_gian_phuc_vu} unit={"năm"} />
          </View>
          <View style={styles.displayColumn}>
            <DisplayResult variable={"t1"} value={calculatedData.t1} unit={"giây"} />
            <DisplayResult variable={"t2"} value={calculatedData.t2} unit={"giây"} />
            <DisplayResult variable={"T1"} value={calculatedData.T1} unit={"momem xoắn"} />
            <DisplayResult variable={"T2"} value={calculatedData.T2} unit={"momem xoắn"} />
          </View>
        </View>
        <Text style={styles.resultTitle}>Kết quả tính toán và chọn động cơ</Text>
        <TouchableOpacity onPress={() => setIsCollapsedResult(!isCollapsedResult)} style={styles.collapseButton}>
          <Text style={styles.buttonText}>Kết quả tính toán tổng quan</Text>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapsedResult}>
          <View style={styles.resultContainer}>
            <DisplayResult variable={"Công suất trục công tác"} value={calculatedData.cong_suat_truc_cong_tac} unit={""} />
            <DisplayResult variable={"Hiệu suất chung"} value={Number(calculatedData.hieu_suat_chung).toFixed(4)} unit={""} />
            <DisplayResult variable={"Công suất tương đương trục công tác"} value={Number(calculatedData.cong_suat_tuong_duong_truc_cong_tac).toFixed(4)} unit={""} />
            <DisplayResult variable={"Công suất cần thiết trên trục động cơ"} value={Number(calculatedData.cong_suat_can_thiet_tren_truc_dong_co).toFixed(4)} unit={""} />
            <DisplayResult variable={"Số vòng quay trục công tác"} value={Number(calculatedData.so_vong_quay_truc_cong_tac).toFixed(4)} unit={""} />
            <DisplayResult variable={"Số vòng quay sơ bộ"} value={Number(calculatedData.so_vong_quay_so_bo).toFixed(4)} unit={""} />
          </View>
        </Collapsible>

        <TouchableOpacity onPress={() => setIsCollapsedEngine(!isCollapsedEngine)} style={styles.collapseButton}>
          <Text style={styles.buttonText}>Chọn động cơ</Text>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapsedEngine}>
          <View style={styles.engineContainer}>
            {engines?.map((engine) => {
              return(
                <EngineCard 
                  key={engine._id} 
                  kieu_dong_co={engine.kieu_dong_co} 
                  cong_suat={engine.cong_suat}
                  van_toc_vong_quay={engine.van_toc_vong_quay}
                  isSelected={selectedEngineId === engine._id}
                  onSelect={() => {setSelectedEngineId(engine._id); console.log(selectedEngineId)}}       
                />
              )
            })}
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
  },
  resultContainer: {

  },
  engineContainer: {

  }
})