import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = ({ label, sublabel, value, onChange, keyboardType = 'numeric' }) => {
  return (
    <View style={styles.inputContainer}>
      <View>
        <Text style={styles.inputField}>{label}</Text>
        {sublabel ? <Text>{sublabel}</Text> : null}
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 5
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
    marginRight: 15
  },
});
