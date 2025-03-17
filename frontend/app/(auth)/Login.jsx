import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { userLogin } from '../../api'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const router = useRouter()

  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  function handleSignUp() {
    router.replace('/(auth)/SignUp')
  }

  function handleChange(name, value) {
    setUser({...user, [name]: value})
  }

  async function handleSubmit() {
    if (!user.email || !user.password) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      let response = await userLogin(user);
      console.log("User Login:", response);
      await AsyncStorage.setItem("userID", response.userId);
      router.replace('/(main)/HomePage');
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.loginTitle}>ĐĂNG NHẬP</Text>
      <View style={styles.loginContainer}>
        <Text style={styles.loginContainerLabel}>Email</Text>
        <TextInput 
          style={styles.loginContainerInput} 
          onChangeText={(text) => handleChange('email', text)} 
          value={user.email} 
          placeholder='Nhập email'
        />
        <Text style={styles.loginContainerLabel}>Mật khẩu</Text>
        <TextInput 
          style={styles.loginContainerInput} 
          onChangeText={(text) => handleChange('password', text)} 
          value={user.password} 
          placeholder='Nhập mật khẩu'
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginSubmitButton} onPress={handleSubmit}>
          <Text style={styles.loginSubmitButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText1}>Chưa có tài khoản?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpText2}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  loginContainer: {
    backgroundColor: '#DBE2EC',
    marginTop: 20,
    padding: 20,
    marginHorizontal: '10%',
    borderRadius: 15,
    display:'flex'
  },
  loginTitle: {
    fontFamily: 'quicksand-bold',
    fontSize: 24,
    color: 'rgb(33,53,85)',
    marginHorizontal: 'auto'
  },
  loginContainerInput: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 10
  },
  loginContainerLabel: {
    marginBottom: 10,
    fontFamily: 'quicksand-semibold',
    color: 'rgb(33,53,85)'
  },
  loginSubmitButton: {
    flexGrow: 1,
    backgroundColor: 'rgb(33,53,85)',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5
  },
  loginSubmitButtonText: {
    color: 'white',
    fontFamily: 'quicksand-bold',
    textAlign: 'center',
  },
  signUpContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 15,
  },
  signUpText1: {
    fontFamily: 'quicksand'
  },
  signUpText2: {
    fontFamily: 'quicksand-semibold',
    color: 'rgb(33,53,85)'
  }
})
