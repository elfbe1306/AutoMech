import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomePage"/>
      <Stack.Screen name="InputPage"/>
      <Stack.Screen name="EngineSelectPage"/>
      <Stack.Screen name="DisplayChap2Page"/>
    </Stack>
  )
}

export default AuthLayout