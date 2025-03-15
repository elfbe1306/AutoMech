import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const Login = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => {router.push('/(main)/HomePage')}} style={{marginBottom: 20}}>
        <Text>Go to Home Page</Text>
      </TouchableOpacity>

      <Text style={styles.loginTitle}>ĐĂNG NHẬP</Text>
      <View style={styles.loginContainer}>
        <Text>Email</Text>
        <TextInput placeholder='Nhập email'/>
        <Text>Mật khẩu</Text>
        <TextInput placeholder='Nhập mật khẩu'/>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    margin: 'auto',
  },
  loginContainer: {
    backgroundColor: '#DBE2EC',
    marginTop: 20,
    padding: 20,
  },
  loginTitle: {
    fontFamily: 'quicksand-bold',
    fontSize: 24,
    color: 'rgb(33,53,85)',
  }
})