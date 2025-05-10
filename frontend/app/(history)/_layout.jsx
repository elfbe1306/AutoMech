import React from 'react'
import { Stack } from 'expo-router'

const HistoryLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="History"/>
    </Stack>
  )
}

export default HistoryLayout