import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Chap2_PPTST from '../../components/Chap2_PPTST';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomePage = () => {
  const [userId, setUserId] = useState(null);

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

    fetchUserId();
  }, []);


  return(
    <View style={styles.container}>
      <Text>HomePage {userId}</Text>

      <Chap2_PPTST />

    </View>
  );
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    margin: 'auto'
  }
})