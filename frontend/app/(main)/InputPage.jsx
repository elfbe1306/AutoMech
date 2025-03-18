import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
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
  const [nk, setNk] = useState(0);
  const [nol, setNol] = useState(0);
  const [nbr, setNbr] = useState(0);
  const [nx, setNx] = useState(0);
  const [uh, setUh] = useState(0);
  const [ux, setUx] = useState(0);
  const [usb, setUsb] = useState(0);

  const handleSubmit = async () => {

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tính toán chọn chi tiết máy</Text>
      <ScrollView style={styles.inputContainer}>
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
        <View style={styles.inputFieldContainer}>
          <View>
            <Text>Hiệu suất</Text>
            <Text>nối trục (1)</Text>
          </View>
          <TextInput style={styles.input} value={nk} onChangeText={setNk} />
        </View>
        <View style={styles.inputFieldContainer}>
          <View>
            <Text>Hiệu suất</Text>
            <Text>ổ lăn (0,99 - 0,995)</Text>
          </View>
          <TextInput style={styles.input} value={nol} onChangeText={setNol} />
        </View>
        <View style={styles.inputFieldContainer}>
          <View>
            <Text>Hiệu suất</Text>
            <Text>bánh răng (0,95 - 0,97)</Text>
          </View>
          <TextInput style={styles.input} value={nbr} onChangeText={setNbr} />
        </View>
        <View style={styles.inputFieldContainer}>
          <View>
            <Text>Hiệu suất</Text>
            <Text>xích (0,95 - 0,97)</Text>
          </View>
          <TextInput style={styles.input} value={nx} onChangeText={setNx} />
        </View>
        <View style={styles.inputFieldContainer}>
          <View>
            <Text>Tỷ số truyền</Text>
            <Text>hộp giảm tốc (8 - 40)</Text>
          </View>
          <TextInput style={styles.input} value={uh} onChangeText={setUh} />
        </View>
        <View style={styles.inputFieldContainer}>
          <View>
            <Text>Tỷ số truyền</Text>
            <Text>xích (2 - 5)</Text>
          </View>
          <TextInput style={styles.input} value={ux} onChangeText={setUx} />
        </View>
        <TouchableOpacity style={styles.doMathButton} onPress={handleSubmit}>
          <Text style={styles.doMathButtonText}>Tính</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 100
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
    flexGrow: 1,
    marginLeft: 20
  },
  doMathButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgb(33,53,85)',
  },
  doMathButtonText: {
    color: 'white',
    fontFamily: 'quicksand-semibold',
    fontSize: 16
  }
})