import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReturnButton from '@/components/ReturnButton';
import apiService from '@/api';
import { useRouter } from 'expo-router';

const Chapter3Page = () => {
  const router = useRouter();

  const [calculateID, setCalculateID] = useState("");
  const [n01, setN01] = useState(200);

  const Chap3PreData = {
    k0: 1, ka: 1, kdc: 1.1, kc: 1.25, kd: 1.2, kbt: 1.3, z01: 25, n01: n01
  }

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
          const response = await apiService.chap3PreDataForChoosingGear(calculateID, Chap3PreData);
          console.log('Chapter3 Data:', response);
        } catch (error) {
          console.error('Error fetching calculation data:', error);
        }
      };
      fetchCalculation();
    }
  }, [calculateID]);

  return (
    <View style={{margin: 'auto'}}>
      <ReturnButton onPress={() => router.back()}/>
    </View>
  )
}

export default Chapter3Page

const styles = StyleSheet.create({})