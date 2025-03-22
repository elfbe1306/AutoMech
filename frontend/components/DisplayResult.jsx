import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DisplayResult = (props) => {
  const {variable, value, unit} = props;
  return (
    <Text style={styles.displayNum}>
      <Text style={styles.displayVar}>
        {variable}: {" "}
      </Text> 
        {value} {unit}
    </Text>
  )
}

export default DisplayResult

const styles = StyleSheet.create({
  displayVar: {
    fontFamily: 'quicksand-bold',
    color: 'rgb(33, 53, 85)',
    fontSize:14,
  },
  displayNum: {
    fontFamily: 'quicksand',
    color: 'rgb(33, 53, 85)',
    fontSize:14,
  },
})