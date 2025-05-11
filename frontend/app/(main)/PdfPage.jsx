import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';
import generateHtml from '../../components/printTemplate'

const PdfPage = () => {
  const name = "Ngọc Nhơn";
  const message = "This is a personalized message rendered into HTML.";

  const html = generateHtml(name, message); // Create the HTML

  const handlePrint = async () => {
    await Print.printAsync({ html });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PDF Preview</Text>
      <View style={styles.webviewContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
        />
      </View>
      <TouchableOpacity onPress={handlePrint} style={styles.button}>
        <Text style={styles.buttonText}>Print</Text>
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
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  webviewContainer: {
    height: 500,
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});

