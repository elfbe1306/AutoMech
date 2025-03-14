import React from 'react';
import { Text, View, Image, StyleSheet } from "react-native";

export default function LoadingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AUTOMECH</Text>
      <Image source={require('../assets/images/logo.png')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: "auto", 
    marginBottom: "auto"
  },
  text: {
    fontSize: 32,
    fontFamily: "quicksand-bold",
    fontWeight: "bold",
  }
})