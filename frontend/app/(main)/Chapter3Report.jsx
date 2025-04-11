import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReturnButton from '@/components/ReturnButton';
import apiService from '@/api';
import { useRouter } from 'expo-router';

const Chapter3Report = () => {
  const router = useRouter();
  const [chapter2, setChapter2] = useState()
  const [chapter3, setChapter3] = useState()
  const [engine, setEngine] = useState()

  useEffect(() => {
    const fetchBeginData = async () => {
        const recordID = await AsyncStorage.getItem("RECORDID");
        let response = await apiService.Chapter3ReportGenerate(recordID);
        setChapter2(response.chapter2Data);
        setChapter3(response.chapter3Data);
        setEngine(response.engineData);
    }

    fetchBeginData()
  }, [])

  return (
    <View>
      <ReturnButton onPress={() => router.back()}/>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TÍNH TOÁN BỘ TRUYỀN HỞ</Text>
      </View>
      
    </View>
  )
}

export default Chapter3Report

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
})