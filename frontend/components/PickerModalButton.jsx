import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const PickerModalButton = ({ onSelect, options = [] }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setModalVisible(false);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedOption !== null ? selectedOption : 'Choose a value'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a value</Text>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={styles.optionItem}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PickerModalButton;

const styles = StyleSheet.create({
  container: {
  },
  button: {
  },
  buttonText: {
    fontFamily: 'quicksand',
    color: 'rgb(33, 53, 85)',
    fontSize:14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
  optionItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
