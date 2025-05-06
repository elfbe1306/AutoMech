import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePage = () => {
  const router = useRouter();

  function handleCalculatePage() {
    router.push('/InputPage');
  }

  useEffect(() => {
    AsyncStorage.removeItem("RECORDID");
  }, [])

  return(
    <View>
      <View style={styles.ButtonContainer}>
        <TouchableOpacity style={styles.CalculateButtonContainer} onPress={handleCalculatePage}>
          <Image source={require('../../assets/images/calendar-edit.png')}/>
          <Text style={styles.TextButton}>Tính toán</Text>
          <Text style={styles.TextButton}>Chọn chi tiết máy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.CalculateButtonContainer}>
          <Image source={require('../../assets/images/list-right.png')}/>
          <Text style={styles.TextButton}>Lịch sử</Text>
          <Text style={styles.TextButton}>tính toán</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

export default HomePage

const styles = StyleSheet.create({
  ButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 'auto',
    marginTop: '40%',
    gap: 10
  },
  CalculateButtonContainer: {
    backgroundColor: '#DBE2EC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 30,
    width: 170,
    borderRadius: 15
  },
  TextButton: {
    fontFamily: 'quicksand-bold',
    color:'rgb(33,53,85)',
    fontSize: 14
  }
})