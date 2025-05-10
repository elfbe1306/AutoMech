import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import ReturnButton from "@/components/ReturnButton";
import apiService from "@/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chapter5Page = () => {
  const router = useRouter();
  const [recordID, setRecordID] = useState(null);

  useEffect(() => {
    const FetchRecordId = async () => {
      const recordID = await AsyncStorage.getItem("RECORDID");
      setRecordID(recordID)
    }

    FetchRecordId();
  }, [])

  useEffect(() => {
    const FetchData = async () => {
      const response = await apiService.Chapter5Calculation(recordID);
      console.log(response);
    }

    FetchData();
  }, [recordID])

  return(
    <View>
      <ReturnButton onPress={() => router.back()}/>


    </View>
  )
}

export default Chapter5Page

const styles = StyleSheet.create({

})