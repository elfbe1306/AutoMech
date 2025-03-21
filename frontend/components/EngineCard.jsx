import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import DisplayResult from './DisplayResult'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const EngineCard = (props) => {
  const {kieu_dong_co, cong_suat, van_toc_vong_quay, onSelect, isSelected} = props;
  return (
    <View>
      <DisplayResult variable={"Kiểu động cơ"} value={kieu_dong_co} unit={""}/>
      <DisplayResult variable={"Công suất"} value={cong_suat} unit={"kW"}/>
      <DisplayResult variable={"Vận tốc quay"} value={van_toc_vong_quay} unit={"vg/ph"}/>
      <TouchableOpacity onPress={onSelect}>
        {isSelected ? <FontAwesome6 name="check" size={24} color="green"/> : <Text>Chọn</Text>}
      </TouchableOpacity>
    </View>
  )
}

export default EngineCard

const styles = StyleSheet.create({})