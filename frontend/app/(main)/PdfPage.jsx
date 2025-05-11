import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';
import generateHtml from '../../components/printTemplate';
import apiService from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PdfPage = () => {
  const [selectMaterial, setSelectMaterial] = useState({});
  const [renderData, setRenderData] = useState({});

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
    }

    FetchData();
  }, []);

  const html = generateHtml(selectMaterial, renderData); // Create the HTML

  const handlePrint = async () => {
    await Print.printAsync({ html });
  };

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
    marginBottom:'15%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'quicksand-bold',
  }
});

