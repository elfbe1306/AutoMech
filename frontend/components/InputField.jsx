import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = ({ label, sublabel, value, onChange, keyboardType = 'numeric' }) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputField}>{label}</Text>
        {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
      </View>
      <TextInput
        style={styles.input}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  labelContainer: {
    flex: 1,
    marginRight: 10,
  },
  inputField: {
    color: 'rgb(58, 65, 99)',
    fontFamily: 'quicksand-bold',
    fontSize: 14,
    marginBottom: 2,
    width: 250
  },
  sublabel: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    width: 80,
    height: 36,
    borderColor: '#213555',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
  },
});


