import React from 'react'
import { Stack } from 'expo-router'

import { EngineProvider } from '@/Context/EngineContext'

const AuthLayout = () => {
  return (
    <EngineProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen options = {{gestureEnabled: false}} name="HomePage"/>
        <Stack.Screen name="InputPage"/>
        <Stack.Screen name="EngineSelectPage"/>
        <Stack.Screen name="Chapter3Page"/>
        <Stack.Screen name="Chapter4Page"/>
      </Stack>
    </EngineProvider>
  )
}

export default AuthLayout