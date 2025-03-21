import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
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

  const inputName = ["F(N)", "v(m/s)", "D(mm)", "L(năm)", "t1(giây)", "t2(giây)", "T1\n(momem xoắn)", 
    "T2\n(momem xoắn)", "Hiệu suất nối trục", "Hiệu suất ổ lăn\n(0.99 - 0.995)", 
    "Hiệu suất bánh răng\n(0.96 - 0.98)", "Hiệu suất xích\n(0.90 - 0.93)", 
    "Tỷ số truyền\nhộp giảm tốc (8 - 40)", "Tỷ số truyền\nxích (2 - 5)"]

  const inputFunc = [setF, setV, setD, setL, setT1, setT2, setT1M, setT2M, setNk, setNol, setNbr, setNx, setUh, setUx]

  const inputValues = [f, v, D, L, t1, t2, T1, T2, nk, nol, nbr, nx, uh, ux];

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
      await AsyncStorage.setItem("EngineSelect", JSON.stringify(response.data.engines));
      await AsyncStorage.setItem("CalculateID", JSON.stringify(response.data._id));

      console.log("Inserted:", response.data);
      router.push('/EngineSelectPage');
    } catch(error) {
      alert(error.response.data.message);
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TÍNH TOÁN{'\n'}CHỌN CHI TIẾT MÁY</Text>
      <ScrollView style={styles.inputContainer}>
        <Text style={styles.inputContainerTitle}>Hãy nhập các thông số đầu vào</Text>
        <View style={styles.displayinputComponent}>
          {inputName.map((name, index) => (
            <View style={styles.inputComponent} key={index}>
              <Text style={styles.inputField}>{name}</Text>
              <TextInput 
                style={styles.input} 
                value={inputValues[index].toString()} 
                onChangeText={(text) => inputFunc[index](text)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.doMathButton} onPress={handleSubmit}>
          <Text style={styles.doMathButtonText}>Tính toán</Text>
      </TouchableOpacity>
    </View>
  )
}

export default InputPage

const styles = StyleSheet.create({
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '14%',
  },

  title: {
    fontFamily: 'quicksand-bold',
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
    color:'rgb(33,53,85)',
  },

  inputContainer: {
    width: 350,
    backgroundColor: '#DBE2EC',
    paddingVertical: 10,
    paddingHorizontal:20,
    borderRadius: 15,
    height: '80%',
  },
  inputContainerTitle: {
    fontFamily: 'quicksand-semibold',
    fontSize: 16,
    marginBottom: 15,
    color: 'rgb(58, 65, 99)',
    fontFamily: 'quicksand-bold',
  },
  displayinputComponent: {
    display: 'flex',
    flexDirection:'column',
  },
  inputComponent: {
    display:'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10
  },
  inputField: {
    color: 'rgb(58, 65, 99)',
    fontFamily: 'quicksand-bold',
    fontSize: 14,
  },
  input: {
    borderColor: '#213555',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    shadowOffset: {width:0, height:4,},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width:140,
    backgroundColor: '#F8FAFC',
  },
  doMathButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgb(33,53,85)',
    borderRadius: 10,
    marginBottom:5
  },
  doMathButtonText: {
    color: 'white',
    fontFamily: 'quicksand-semibold',
    fontSize: 16
  }
})