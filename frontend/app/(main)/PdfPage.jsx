import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';
import generateHtml from '../../components/printTemplate';
import apiService from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const PdfPage = () => {
  const router = useRouter();

  const [selectMaterial, setSelectMaterial] = useState({});
  const [renderData, setRenderData] = useState({});
  const [table1, setTable1] = useState([]);
  const [table2, setTable2] = useState([]);
  const [table3, setTable3] = useState([]);

  useEffect(() => {
    const FetchData = async () => {
      const recordID = await AsyncStorage.getItem("RECORDID");
      const response = await apiService.FetchReportData(recordID);

      const materialMap = {
        1: { material: "Gang xám", heatTreatment: "Tôi, ram" },
        2: { material: "Thép 45", heatTreatment: "Tôi cải thiện" },
        3: { material: "Thép 45", heatTreatment: "Tôi, ram" },
        default: { material: "Thép 15", heatTreatment: "Thấm cacbon, tôi, ram" }
      };

      setSelectMaterial(materialMap[response.returnData.material]);
      setRenderData(response.returnData);
      setTable1(JSON.parse(response.returnData.table1));
      setTable2(JSON.parse(response.returnData.table2));
      setTable3(JSON.parse(response.returnData.table3));
    }

    FetchData();
  }, []);

  const html = useMemo(() => {
    if (
      Object.keys(selectMaterial).length &&
      Object.keys(renderData).length &&
      table1.length && table2.length && table3.length
    ) {
      return generateHtml(selectMaterial, renderData, table1, table2, table3);
    }
    return "";
  }, [selectMaterial, renderData, table1, table2, table3]);

  const handlePrint = async () => {
    await Print.printAsync({ html });
  };

  const handleHome = () => {
    router.replace('/(main)/HomePage');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THÔNG TIN HỘP GIẢM TỐC</Text>
      <View style={styles.webviewContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
        />
      </View>
      <TouchableOpacity onPress={handlePrint} style={styles.button}>
        <Text style={styles.buttonText}>In ấn và chia sẻ</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleHome} style={styles.button}>
        <Text style={styles.buttonText}>Trở về trang chính</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PdfPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: '10%',
    color:'rgb(33,53,85)',
    fontFamily: 'quicksand-bold',
  },
  webviewContainer: {
    height: 500,
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  button: {
    display: 'flex',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgb(33,53,85)',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'quicksand-bold',
  }
});

