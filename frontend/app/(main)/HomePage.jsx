import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Chap2_PPTST from '../../components/Chap2_PPTST'

const HomePage = () => {
  return(
    <View style={styles.container}>
      <Text>HomePage</Text>

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