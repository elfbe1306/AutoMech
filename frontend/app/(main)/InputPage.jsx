import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { useState } from 'react'

const InputPage = () => {
  const [f, setF] = useState(0);
  const [v, setV] = useState(0);
  const [D, setD] = useState(0);
  const [L, setL] = useState(0);
  const [t1, setT1] = useState(0);
  const [t2, setT2] = useState(0);
  const [T1, setT1M] = useState(0);
  const [T2, setT2M] = useState(0);

  const handleSubmit = async () => {
    setF(0);
    setV(0);
    setD(0);
    setL(0);
    setT1(0);
    setT2(0);
    setT1M(0);
    setT2M(0);
    try {
      const response = await axios.post('http://192.168.0.107:3000/posts', {
        f, v, D, L, t1, t2, T1, T2
      });
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tính toán chọn chi tiết máy</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputContainerTitle}>Hãy nhập các thông số đầu vào</Text>
        <View style={styles.inputFieldContainer}>
          <Text>F(N)</Text>
          <TextInput style={styles.input} value={f} onChangeText={setF} />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text>v(m/s)</Text>
          <TextInput style={styles.input} value={v} onChangeText={setV} />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text>D(mm)</Text>
          <TextInput style={styles.input} value={D} onChangeText={setD} />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text>L(năm)</Text>
          <TextInput style={styles.input} value={L} onChangeText={setL} />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text>t1(giây)</Text>
          <TextInput style={styles.input} value={t1} onChangeText={setT1} />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text>t2(giây)</Text>
          <TextInput style={styles.input} value={t2} onChangeText={setT2} />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text>T1(momem xoắn)</Text>
          <TextInput style={styles.input} value={T1} onChangeText={setT1M} />
        </View>
        <View style={styles.inputFieldContainer}>
          <Text>T2(momem xoắn)</Text>
          <TextInput style={styles.input} value={T2} onChangeText={setT2M} />
        </View>
        <TouchableOpacity style={styles.doMathButton} onPress={handleSubmit}>
          <Text style={styles.doMathButtonText}>Tính</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default InputPage

const styles = StyleSheet.create({
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '30%',
  },
  title: {
    fontFamily: 'quicksand-bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  inputContainer: {
    width: 350,
    backgroundColor: '#DBE2EC',
    padding: 20,
    borderRadius: 15,
  },
  inputFieldContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25
  },
  inputContainerTitle: {
    fontFamily: 'quicksand-semibold',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'rgb(58, 65, 99)'
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    width: 150,
    marginLeft: 20
  },
  doMathButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgb(33,53,85)',
  },
  doMathButtonText: {
    color: 'white',
    fontFamily: 'quicksand-semibold',
    fontSize: 16
  }
})