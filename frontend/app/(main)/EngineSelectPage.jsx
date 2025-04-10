import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import apiService from '../../api'
import ReturnButton from '@/components/ReturnButton'
import { useRouter } from 'expo-router'
import Collapsible from 'react-native-collapsible';
import DisplayResult from '@/components/DisplayResult'
import EngineCard from '@/components/EngineCard'
import AntDesign from '@expo/vector-icons/AntDesign';

const EngineSelectPage = () => {
  const router = useRouter();

  const [isCollapsedResult, setIsCollapsedResult] = useState(true);
  const [isCollapsedEngine, setIsCollapsedEngine] = useState(true);
  const [engines, setEngines] = useState(null);
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
  
  useEffect(()=>{
    const fetchData = async () => {
      let recordID = await AsyncStorage.getItem("RECORDID");
      let engine = await AsyncStorage.getItem("ENGINELIST");
      setEngines(JSON.parse(engine));
      let response = await apiService.Chapter2FetchData(recordID);
      setCalculateData(response.chapter2data[0])
    }

    fetchData()
  }, [])


  async function handleSubmit() {
    try {
      let recordID = await AsyncStorage.getItem("RECORDID");
      let response = await apiService.Chapter2AfterChoosingEngine(recordID, selectedEngineId)
      console.log(response.message);
      router.push('/Chapter3Page');
    } catch(error) {
      alert(error.response.message);
    }
  }

  return (
    <View>
      <ReturnButton onPress={() => router.back()}/>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TÍNH TOÁN</Text>
      </View>

      <ScrollView style={styles.inputContainer}>
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
            <DisplayResult variable={"T1"} value={calculatedData.t1_t} unit={"momem xoắn"} />
            <DisplayResult variable={"T2"} value={calculatedData.t2_t} unit={"momem xoắn"} />
          </View>
        </View>
        <Text style={styles.resultTitle}>Kết quả tính toán và chọn động cơ</Text>

        <View style={[styles.collapseButton, !isCollapsedResult ? styles.collapseButtonActive : null]}>
          <Text style={[styles.buttonText, !isCollapsedResult ? styles.buttonTextActive : null]}>Kết quả tính toán tổng quan</Text>
          <TouchableOpacity onPress={() => setIsCollapsedResult(!isCollapsedResult)}>
            <AntDesign name={isCollapsedResult ? "caretright": "caretdown"} size={28} color={isCollapsedResult ? "rgb(33,53,85)" : "#DBE2EC"} />
          </TouchableOpacity>
        </View>

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
        <View style={[styles.collapseButton, !isCollapsedEngine ? styles.collapseButtonActive : null]}>
          <Text style={[styles.buttonText, !isCollapsedEngine ? styles.buttonTextActive : null]}>Chọn động cơ</Text>
          <TouchableOpacity onPress={() => setIsCollapsedEngine(!isCollapsedEngine)}>
            <AntDesign name={isCollapsedEngine ? "caretright" : "caretdown"}  size={28} color={isCollapsedEngine ? "rgb(33,53,85)" : "#DBE2EC"} />
        </TouchableOpacity>
        </View>

        <Collapsible collapsed={isCollapsedEngine}>
          <View style={styles.engineContainer} contentContainerStyle={{ paddingBottom: 20 }}>
            {engines?.map((engine) => (
              <EngineCard
                key={engine.id}
                kieu_dong_co={engine.kieu_dong_co}
                cong_suat={engine.cong_suat}
                van_toc_vong_quay={engine.van_toc_vong_quay}
                isSelected={selectedEngineId === engine.id}
                onSelect={() => {setSelectedEngineId(engine.id)}}
              />
            ))}
          </View>
        </Collapsible>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default EngineSelectPage

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
    marginTop: '5%',
    marginHorizontal: '10%',
    marginBottom: '30%'
  },
  inputTitle: {
    fontFamily: 'quicksand-semibold',
    fontSize: 16,
    color: 'rgb(33, 53, 85)'
  },
  displayRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    marginTop: 10
  },
  displayColumn: {
    gap: 14
  },
  resultTitle: {
    marginTop: '10%',
    fontFamily: 'quicksand-semibold',
    fontSize: 16,
    color: 'rgb(33, 53, 85)'
  },
  collapseButton: {
    marginTop: '5%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgb(33, 53, 85)',
    borderRadius: 24,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  collapseButtonActive: {
    backgroundColor:'rgb(33,53,85)',
    borderBottomRightRadius:0,
    borderBottomLeftRadius:0
  },
  buttonText: {
    fontFamily: 'quicksand-medium',
    fontSize: 14,
    color: 'rgb(33, 53, 85)'
  },
  buttonTextActive: {
    fontFamily: 'quicksand-medium',
    fontSize: 14,
    color: '#DBE2EC'
  },
  resultContainer: {
    paddingVertical: '4%',
    paddingHorizontal:'8%',
    backgroundColor:'#F5EFE7',
    
  },
  engineContainer: {
    backgroundColor:'#F5EFE7',
    paddingVertical: '2%',
  },

  saveButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgb(33,53,85)',
    borderRadius: 10,
    marginBottom:'10%', 
  },

  saveButtonText: {
    color: 'white',
    fontFamily: 'quicksand-semibold',
    fontSize: 16
  }
})