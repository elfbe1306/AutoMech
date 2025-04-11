import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReturnButton from '@/components/ReturnButton';
import apiService from '@/api';
import { useRouter } from 'expo-router';
import Collapsible from 'react-native-collapsible';
import DisplayResult from '@/components/DisplayResult'
import EngineCard from '@/components/EngineCard'
import AntDesign from '@expo/vector-icons/AntDesign';
import PickerModalButton from '../../components/PickerModalButton'

const Chapter3Page = () => {
  const router = useRouter();

  const [n01, setN01] = useState(0);
  const [Da, setDa] = useState(0);
  const [kr1, setKr1] = useState(0.42);
  const [kr2, setKr2] = useState(0.24);
  const [chapter2Data, setChapter2Data] = useState({})

  const Chapter3PreData = {
    k0: 1, ka: 1, kdc: 1.1, kc: 1.25, kd: 1.2, kbt: 1.3, z01: 25, kf: 1, n01: n01, Da: Da
  }

  useEffect(() => {
    const fetchBeginData = async () => {
      const recordID = await AsyncStorage.getItem("RECORDID");
      let response = await apiService.Chapter3BeforeChoosingChain(recordID);
      setChapter2Data(response.chapter2Data);
    }

    fetchBeginData()
  }, [])

  async function handleSubmit() {

  }

  async function handleCalculationI() {
    const recordID = await AsyncStorage.getItem("RECORDID");
    let response = await apiService.Chapter3FirstCalculation(recordID, Chapter3PreData);
  }

  return (
    <View>
      <ReturnButton onPress={() => router.back()}/>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TÍNH TOÁN BỘ TRUYỀN HỞ</Text>
      </View>

      <ScrollView style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Các thông số đầu vào</Text>
        <View style={styles.displayInput}>
          <DisplayResult variable={"P3"} value={Number(chapter2Data.p3).toFixed(4)} unit={"kW"} />
          <DisplayResult variable={"n3"} value={Number(chapter2Data.n3).toFixed(4)} unit={"vòng/phút"} />
          <DisplayResult variable={"ux"} value={Number(chapter2Data.he_so_truyen_dong_xich).toFixed(4)} unit={""} />
          <View style={styles.optionButtonContainer}>
            <Text style={styles.optionButtonText}>n01:</Text>
            <PickerModalButton onSelect={(value) => setN01(value)} options={[50, 200, 400, 600, 800, 1000, 1200, 1600]}/>
          </View>
          <View style={styles.optionButtonContainer}>
            <Text style={styles.optionButtonText}>Da:</Text>
            <PickerModalButton onSelect={(value) => setDa(value)} options={[0.002, 0.003, 0.004]}/>
          </View>
          <TouchableOpacity onPress={handleCalculationI}>
            <Text>Tính toán</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.resultTitle}>Kết quả tính toán và chọn động cơ</Text>

        {/* <View style={[styles.collapseButton, !isCollapsedResult ? styles.collapseButtonActive : null]}>
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
        </Collapsible> */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Chapter3Page

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

  displayInput: {
    marginTop: 10,
    fontWeight: 200,
    gap: 10
  },
  resultTitle: {
    marginTop: '10%',
    fontFamily: 'quicksand-semibold',
    fontSize: 16,
    color: 'rgb(33, 53, 85)'
  },
  optionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  optionButtonText: {
    fontFamily: 'quicksand-bold',
    color: 'rgb(33, 53, 85)',
    fontSize:14,
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