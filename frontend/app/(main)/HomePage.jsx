import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const HomePage = () => {
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userID');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.log("UserId not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    const clearStorage = async () => {
      await AsyncStorage.removeItem('EngineSelect');
      await AsyncStorage.removeItem('CalculateID');
    }

    fetchUserId();
    clearStorage();
  }, []);

  function handleCalculatePage() {
    router.push('/InputPage');
  }

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