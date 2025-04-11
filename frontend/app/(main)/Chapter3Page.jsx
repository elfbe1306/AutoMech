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
  const [safetyCheck, setSafetyCheck] = useState(false)
  const [hasChecked, setHasChecked] = useState(false);

  const [chapter3DataResult, setChapter3DataResult] = useState({});
  const [isCollapsedResult, setIsCollapsedResult] = useState(true);
  const [calculationDone, setCalculationDone] = useState(false);

  const Chapter3PreData = {
    k0: 1, ka: 1, kdc: 1.1, kc: 1.25, kd: 1.2, kbt: 1.3, z01: 25, kf: 1, n01: n01, Da: Da
  }

  const Chapter3AfterData = {
    kr1: kr1, kr2: kr2
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
    router.push('/Chapter3Report')
  }

  async function handleCalculationI() {
    const recordID = await AsyncStorage.getItem("RECORDID");
    let response = await apiService.Chapter3FirstCalculation(recordID, Chapter3PreData);
    setSafetyCheck(response.safetyResult);
    setHasChecked(true);
  }

  async function handleCalculationII() {
    const recordID = await AsyncStorage.getItem("RECORDID");
    let response1 = await apiService.Chapter3SecondCalculation(recordID, Chapter3AfterData);

    let response2 = await apiService.Chapter3Result(recordID);
    setChapter3DataResult(response2.chapter3Data);

    setCalculationDone(true); 
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
          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculationI}>
            <Text style={styles.saveButtonText}>Kiểm tra</Text>
          </TouchableOpacity>
          {hasChecked && (
            <Text style={{marginTop: -60,marginBottom: 50, fontWeight: 600, color: safetyCheck ? 'rgb(33, 53, 85)' : 'red' }}>
              {safetyCheck ? 'Kiểm nghiệm đạt' : 'Kiểm nghiệm không đạt'}
            </Text>
          )}
          
          <View style={styles.optionButtonContainer}>
            <Text style={styles.optionButtonText}>kr1:</Text>
            <PickerModalButton onSelect={(value) => setKr1(value)} options={[0.59, 0.42, 0.36, 0.29, 0.24, 0.22]}/>
          </View>
          <View style={styles.optionButtonContainer}>
            <Text style={styles.optionButtonText}>kr2:</Text>
            <PickerModalButton onSelect={(value) => setKr2(value)} options={[0.59, 0.48, 0.36, 0.29, 0.24, 0.22]}/>
          </View>
          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculationII}>
            <Text style={styles.saveButtonText}>Tính toán</Text>
          </TouchableOpacity>
        </View>
        {calculationDone && (
          <>
            <Text style={styles.resultTitle}>Kết quả tính toán</Text>

            <View style={[styles.collapseButton, !isCollapsedResult ? styles.collapseButtonActive : null]}>
              <Text style={[styles.buttonText, !isCollapsedResult ? styles.buttonTextActive : null]}>
                Kết quả tính toán tổng quan
              </Text>
              <TouchableOpacity onPress={() => setIsCollapsedResult(!isCollapsedResult)}>
                <AntDesign 
                  name={isCollapsedResult ? "caretright" : "caretdown"} 
                  size={28} 
                  color={isCollapsedResult ? "rgb(33,53,85)" : "#DBE2EC"} 
                />
              </TouchableOpacity>
            </View>

            <Collapsible collapsed={isCollapsedResult}>
              <View style={styles.resultContainer}>
                <DisplayResult variable={"d1"} value={Number(chapter3DataResult.d1).toFixed(4)} unit={"mm"} />
                <DisplayResult variable={"d2"} value={Number(chapter3DataResult.d2).toFixed(4)} unit={"mm"} />
                <DisplayResult variable={"da1"} value={Number(chapter3DataResult.da1).toFixed(4)} unit={"mm"} />
                <DisplayResult variable={"da2"} value={Number(chapter3DataResult.da2).toFixed(4)} unit={"mm"} />
                <DisplayResult variable={"Z1"} value={Number(chapter3DataResult.z1)} unit={""} />
                <DisplayResult variable={"Z2"} value={Number(chapter3DataResult.z2)} unit={""} />
              </View>
            </Collapsible>
          </>
        )}

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
    marginTop: '20%',
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
    marginTop: 10,
    fontFamily: 'quicksand-semibold',
    fontSize: 16,
    color: 'rgb(33, 53, 85)'
  },
  calculateButton: {
    display: 'flex',
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    padding: 10,
    backgroundColor: 'rgb(33,53,85)',
    borderRadius: 10,
    marginBottom: 5, 
    alignSelf: 'flex-end'
  },
  optionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  optionButtonText: {
    fontFamily: 'quicksand-bold',
    color: 'rgb(33, 53, 85)',
    fontSize:14,
  },
  optionButtonChoosing: {
    backgroundColor: 'rgb(219,226,236)'
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

  resultContainer: {
    paddingVertical: '4%',
    paddingHorizontal:'8%',
    backgroundColor:'#F5EFE7',
    
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
})