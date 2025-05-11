import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Text, ScrollView } from "react-native";
import ReturnButton from "@/components/ReturnButton";
import apiService from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField from "@/components/InputField";
import DisplayResult from "@/components/DisplayResult";

const Chapter5Page = () => {
  const router = useRouter();
  const [recordID, setRecordID] = useState(null);

  const [tau, setTau] = useState(20);
  const [k1, setK1] = useState(12);
  const [k2, setK2] = useState(10);
  const [k3, setK3] = useState(15);
  const [hn, setHn] = useState(17);
  const [lmd_min, setLmd_min] = useState(0);
  const [lmd_max, setLmd_max] = useState(0);
  const [lmd, setLmd] = useState(95);
  const [table1, setTable1] = useState([]);
  const [table2, setTable2] = useState([]);
  const [table3, setTable3] = useState([]);

  const [displayResult1, setDisplayResult1] = useState(false);
  const [displayResult2, setDisplayResult2] = useState(false);

  useEffect(() => {
    const FetchRecordId = async () => {
      const recordID = await AsyncStorage.getItem("RECORDID");
      setRecordID(recordID)
    }

    FetchRecordId();
  }, [])

  const [loading1, setLoading1] = useState(false);
  const handleFirstCalculation = async () => {
    setLoading1(true);

    if(tau < 15 || tau > 30) {
      alert("tau phải nằm trong khoảng từ 15 - 30")
      setLoading1(false);
      return;
    }

    if(k1 < 8 || k1 > 15) {
      alert("k1 phải nằm trong khoảng từ 8 - 15")
      setLoading1(false);
      return;
    }

    if(k2 < 5 || k2 > 15) {
      alert("k2 phải nằm trong khoảng từ 5 - 15")
      setLoading1(false);
      return;
    }

    if(k3 < 10 || k3 > 20) {
      alert("k3 phải nằm trong khoảng từ 10 - 20")
      setLoading1(false);
      return;
    }

    if(hn < 15 || hn > 20) {
      alert("hn phải nằm trong khoảng từ 15 - 20")
      setLoading1(false);
      return;
    }

    const userInput = {
      tau: tau,
      k1: k1,
      k2: k2,
      k3: k3,
      h_n: hn
    }

    try {
      const response = await apiService.Chapter5Calculation(recordID, userInput);
    
      if (response.success) {
        setLmd_min(response.lmd_min);
        setLmd_max(response.lmd_max);
        setDisplayResult1(true);
      } 
    } catch (error) {
      console.error("Error while fetching Chapter 5 calculation:", error);
    } finally {
      setLoading1(false);
    }
  }

  const [loading2, setLoading2] = useState(false);
  const handleSecondCalculation = async () => {
    try {
      setLoading2(true);

      const userInput = {
        lmd: lmd
      }

      const response = await apiService.Chapter5SecondCalculation(recordID, userInput);
      
      if(response.success) {
        setTable1(JSON.parse(response.Table1));
        setTable2(JSON.parse(response.Table2));
        setTable3(JSON.parse(response.Table3));
        setDisplayResult2(true);
      }

    } catch(error) {
      console.error("Error while fetching Chapter 5 calculation:", error);
    } finally {
      setLoading2(false);
    }
  }

  const handleSave = async () => {

  }

  return(
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100} // adjust if needed
    >
      <ScrollView>
        <ReturnButton onPress={() => router.back()}/>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>TÍNH TOÁN TRỤC</Text>
        </View>

        <View style={styles.firstContainer}>
          <InputField
            label="Chọn tau cho phép"
            sublabel="(15 - 30)"
            value={tau.toString()}
            onChange={(text) => setTau(text)}
          />

          <InputField
            label="Khoảng cách giữa các chi tiết quay k1"
            sublabel="(8 - 15)"
            value={k1.toString()}
            onChange={(text) => setK1(text)}
          />

          <InputField
            label="Khoảng cách từ mặt mút ổ đến thành trong của hộp k2"
            sublabel="(5 - 15)"
            value={k2.toString()}
            onChange={(text) => setK2(text)}
          />

          <InputField
            label="Khoảng cách từ mặt mút của chi tiết quay đến nắp ổ k3"
            sublabel="(10 - 20)"
            value={k3.toString()}
            onChange={(text) => setK3(text)}
          />

          <InputField
            label="Chiều cao nắp ổ và đầu bulông"
            sublabel="(15 - 20)"
            value={hn.toString()}
            onChange={(text) => setHn(text)}
          />

          <TouchableOpacity style={styles.doMathButton} onPress={handleFirstCalculation} disabled={loading1}>
            <Text style={styles.doMathButtonText}>Tính chương 5</Text>
          </TouchableOpacity>
        </View>

        {displayResult1 && (
          <View style={styles.SecondContainer}>
            <InputField
              label="Chọn chiều dài mayo xích"
              sublabel={`(${lmd_min} - ${lmd_max})`}
              value={lmd.toString()}
              onChange={(text) => setLmd(text)}
            />

            <TouchableOpacity style={styles.doMathButton} onPress={handleSecondCalculation} disabled={loading2}>
              <Text style={styles.doMathButtonText}>Tính chương 5 lần thứ 2</Text>
            </TouchableOpacity>
          </View>
        )}

        {displayResult2 && (
          <View style={styles.ThirdContainer}>
            <View>
              <Text>Truc 1</Text>
              <DisplayResult variable={"Đường Kính Trục - A"} value={table1[4][1]}/>
              <DisplayResult variable={"Đường Kính Trục - B"} value={table1[4][2]}/>
              <DisplayResult variable={"Đường Kính Trục - C"} value={table1[4][3]}/>
              <DisplayResult variable={"Đường Kính Trục - D"} value={table1[4][4]}/>
              <DisplayResult variable={"Đường Kính Trục - E"} value={table1[4][5]}/>
            </View>
            <View>
              <Text>Truc 2</Text>
              <DisplayResult variable={"Đường Kính Trục - A"} value={table2[4][1]}/>
              <DisplayResult variable={"Đường Kính Trục - B"} value={table2[4][2]}/>
              <DisplayResult variable={"Đường Kính Trục - C"} value={table2[4][3]}/>
              <DisplayResult variable={"Đường Kính Trục - D"} value={table2[4][4]}/>
              <DisplayResult variable={"Đường Kính Trục - E"} value={table2[4][5]}/>
            </View>
            <View>
              <Text>Truc 3</Text>
              <DisplayResult variable={"Đường Kính Trục - A"} value={table3[4][1]}/>
              <DisplayResult variable={"Đường Kính Trục - B"} value={table3[4][2]}/>
              <DisplayResult variable={"Đường Kính Trục - C"} value={table3[4][3]}/>
              <DisplayResult variable={"Đường Kính Trục - D"} value={table3[4][4]}/>
            </View>

            <TouchableOpacity style={styles.doMathButton} onPress={handleSave}>
              <Text style={styles.doMathButtonText}>Save Chương 5</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Chapter5Page

const styles = StyleSheet.create({
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30%',
    marginBottom: '5%'
  },
  title: {
    fontFamily: 'quicksand-bold',
    fontSize: 20,
    color: 'rgb(33, 53, 85)'
  },
  firstContainer: {
    marginHorizontal: 15
  },
  SecondContainer : {
    marginHorizontal: 15
  },
  ThirdContainer: {
    marginHorizontal: 15
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