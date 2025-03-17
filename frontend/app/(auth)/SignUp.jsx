import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { userCreateAccount } from '../../api'

const SignUp = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
    reEnterpassword: ""
  })

  function handleLogin() {
    router.replace('/(auth)/Login')
  }

  function handleChange(name, value) {
    setUser({...user, [name]: value})
  }

  async function handleSubmit() {
    if (!user.email || !user.password || !user.reEnterpassword) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (user.password !== user.reEnterpassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    setUser({
      name: "",
      password: "",
      reEnterpassword: ""
    })

    const userData = {
      email: user.email,
      password: user.password,
    };

    try {
      let response = await userCreateAccount(userData);
      console.log("User created:", response);
      alert("Đã thành công tạo tài khoản")
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.signupTitle}>ĐĂNG KÝ TÀI KHOẢN</Text>
      <View style={styles.signupContainer}>
        <Text style={styles.signupContainerLabel}>Email</Text>
        <TextInput 
          style={styles.signupContainerInput} 
          onChangeText={(text) => handleChange('email', text)} 
          value={user.email} 
          placeholder='Nhập email'
        />
        <Text style={styles.signupContainerLabel}>Mật khẩu</Text>
        <TextInput 
          style={styles.signupContainerInput} 
          onChangeText={(text) => handleChange('password', text)} 
          value={user.password} 
          placeholder='Nhập mật khẩu'
        />

        <Text style={styles.signupContainerLabel}>Nhập lại mật khẩu</Text>
        <TextInput 
          style={styles.signupContainerInput} 
          onChangeText={(text) => handleChange('reEnterpassword', text)} 
          value={user.reEnterpassword} 
          placeholder='Nhập mật khẩu'
        />

        <TouchableOpacity style={styles.signupSubmitButton} onPress={handleSubmit}>
          <Text style={styles.signupSubmitButtonText}>Đăng ký</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText1}>Đã có tài khoản?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.signUpText2}>Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  signupContainer: {
    backgroundColor: '#DBE2EC',
    marginTop: 20,
    padding: 20,
    marginHorizontal: '10%',
    borderRadius: 15,
    display:'flex'
  },
  signupTitle: {
    fontFamily: 'quicksand-bold',
    fontSize: 24,
    color: 'rgb(33,53,85)',
    marginHorizontal: 'auto'
  },
  signupContainerInput: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 10
  },
  signupContainerLabel: {
    marginBottom: 10,
    fontFamily: 'quicksand-semibold',
    color: 'rgb(33,53,85)'
  },
  signupSubmitButton: {
    flexGrow: 1,
    backgroundColor: 'rgb(33,53,85)',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5
  },
  signupSubmitButtonText: {
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