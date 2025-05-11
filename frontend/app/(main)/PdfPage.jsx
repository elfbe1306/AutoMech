import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';
import generateHtml from '../../components/printTemplate';

const PdfPage = () => {
  const name = "Ngọc Nhơn";
  const message = "This is a personalized message rendered into HTML.";

  const html = generateHtml(name, message); // Create the HTML

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

