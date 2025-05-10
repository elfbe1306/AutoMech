import { useRouter } from "expo-router";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import ReturnButton from "@/components/ReturnButton";

const Chapter5Page = () => {
  const router = useRouter();

  return(
    <View>
      <ReturnButton onPress={() => router.back()}/>

        
    </View>
  )
}

export default Chapter5Page

const styles = StyleSheet.create({

})