import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { chap2Calculation } from '../../api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const InputPage = () => {
  const [f, setF] = useState(6000);
  const [v, setV] = useState(1.5);
  const [D, setD] = useState(650);
  const [L, setL] = useState(10);
  const [t1, setT1] = useState(45);
  const [t2, setT2] = useState(30);
  const [T1, setT1M] = useState('T');
  const [T2, setT2M] = useState('0.8T');
  const [nk, setNk] = useState(1);
  const [nol, setNol] = useState(0.993);
  const [nbr, setNbr] = useState(0.97);
  const [nx, setNx] = useState(0.91);
  const [uh, setUh] = useState(8);
  const [ux, setUx] = useState(2);
  const [userID, setUserID] = useState("")

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem("userID");
        if(storedUserID) {
          setUserID(storedUserID);
        } else {
          console.log("UserId no found in AsyncStorage");
        }
      } catch(error) {
        console.error("Error fetching userID:", error);
      }
    }

    fetchUserID();
  }, [])

  const handleSubmit = async () => {
    if(f < 0) {
      alert("Lực vòng băng tải phải lớn hơn 0");
      return;
    } else if(v < 0) {
      alert("Vận tốc băng tải phải lớn hơn 0");
      return;
    } else if(D < 0) {
      alert("Đường kính tang dẫn phải lớn hơn 0")
      return;
    } else if(L < 0) {
      alert("Thời gian phục vụ phải lớn hơn 0")
      return;
    } else if(t1 < 0) {
      alert("t1 phải lớn hơn 0")
      return;
    } else if(t2 < 0) {
      alert("t2 phải lớn hơn 0")
      return;
    } else if(T1 < 0) {
      alert("T1 phải lớn hơn 0")
      return;
    } else if(T2 < 0) {
      alert("T2 phải lớn hơn 0")
      return;
    } else if(nk != 1) {
      alert('Hiệu suất nối trục phải bằng 1');
      return;
    } else if((nol < 0.99) || (nol > 0.995)) {
      alert("Hiệu suất ổ lăn phải nằm trong (0.99 - 0.995)");
      return;
    } else if((nbr < 0.96) || (nbr > 0.98)) {
      alert("Hiệu suất bánh răng phải nằm trong (0.96 - 0.98)");
      return;
    } else if((nx < 0.90) || (nx > 0.93)) {
      alert("Hiệu suất xích phải nằm trong (0.95 - 0.97)");
      return;
    } else if((uh < 8) || (uh > 40)) {
      alert("Tỷ số truyền hộp giảm tốc (8 - 40)");
      return;
    } else if((ux < 2) || (ux > 5)) {
      alert("Tỷ số truyền xích (2 - 5)");
      return;
    }

    let T1_numeric = T1.toString().trim() === "T" ? 1 : parseFloat(T1.toString().replace("T", ""));
    let T2_numeric = T2.toString().trim() === "T" ? 1 : parseFloat(T2.toString().replace("T", ""));
    const usb = ux * uh;

    let inputObject = {
      userID: userID,
      f: f, 
      v: v,
      D: D,
      L: L,
      t1: t1,
      t2: t2,
      T1: T1,
      T2: T2,
      nk: nk,
      nol: nol,
      nbr: nbr,
      nx: nx,
      ux: ux,
      uh: uh,
      T1_numeric: T1_numeric,
      T2_numeric: T2_numeric,
      usb: usb
    }

    try {
      let response = await chap2Calculation(inputObject);
      console.log("Data sent successfully Chap2:", response);
      router.push('/EngineSelectPage');
    } catch(error) {
      alert(error.response.data.message);
    }

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
            <Text>ổ lăn (0.99 - 0.995)</Text>
          </View>
          <TextInput style={styles.input} value={nol} onChangeText={setNol} />
        </View>
        <View style={styles.inputFieldContainer}>
          <View>
            <Text>Hiệu suất</Text>
            <Text>bánh răng (0.96 - 0.98)</Text>
          </View>
          <TextInput style={styles.input} value={nbr} onChangeText={setNbr} />
        </View>
        <View style={styles.inputFieldContainer}>
          <View>
            <Text>Hiệu suất</Text>
            <Text>xích (0.90 - 0.93)</Text>
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