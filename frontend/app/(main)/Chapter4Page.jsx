import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReturnButton from '@/components/ReturnButton';
import apiService from '@/api';
import { useRouter } from 'expo-router';

const Chapter4Page = () => {
  const router = useRouter();

  const [material, setMaterial] = useState("");
  const [heatTreatment, setHeatTreatment] = useState("");

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

      const userData = {
        Sb1: 850,
        Sch1: 580,
        HB1: 250,
        Sb2: 750,
        Sch2: 450,
        HB2: 235,
        c: 1, //cai nay ng dung chon
        y_ba: 0.3, //Cai nay ng dung chon tu 0.3...0.5
        m_cap_nhanh: 3, //Cai nay nguoi dung chon tu khoang module_1 va module_2
      }
      const recordID = await AsyncStorage.getItem("RECORDID");
      const response = await apiService.Chapter4Calculation(recordID, userData);
      console.log(response.message);

    } catch(error) {
      console.error("Error Calculation Chapter 4:" , error);
    } finally {
      setLoading(false);
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

      <View style={styles.inputContainer}>
        <View style>
          <Text style={styles.inputField}>Chọn độ cứng của bánh răng nhỏ</Text>
          <Text>(192 - 285)</Text>
        </View>
        <TextInput style={styles.input} />
      </View>

      <View style={styles.inputContainer}>
        <View style>
          <Text style={styles.inputField}>Chọn độ cứng của bánh răng lớn</Text>
          <Text>(192 - 285)</Text>
        </View>
        <TextInput style={styles.input} />
      </View>

      <TouchableOpacity style={styles.doMathButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.doMathButtonText}>Tính chương 4</Text>
      </TouchableOpacity>
      
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
    flexDirection: 'column'
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