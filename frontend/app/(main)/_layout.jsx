import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomePage"/>
      <Stack.Screen name="InputPage"/>
      <Stack.Screen name="EngineSelectPage"/>
      <Stack.Screen name="Chapter3Page"/>
      <Stack.Screen name="Chapter2Display"/>
    </Stack>
  )
}

export default AuthLayout