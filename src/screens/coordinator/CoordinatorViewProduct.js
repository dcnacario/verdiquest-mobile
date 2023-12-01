import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as ImagePicker from 'expo-image-picker';


const CoordinatorViewProduct = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productSize, setProductSize] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [verdiPoints, setVerdiPoints] = useState('');
    const [imageUri, setImageUri] = useState(null);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };
    return (
        <ScrollView style={styles.container}>
            <View style={styles.imagePicker}>
                <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
        <Icon name="camera" size={24} color="black" />
      </TouchableOpacity>
      {/* If there's an imageUri, show the image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setProductName}
                    value={productName}
                    placeholder="Enter product name"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    onChangeText={setProductDescription}
                    value={productDescription}
                    placeholder="Enter product description"
                    multiline
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Size (L x W x H)</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setProductSize}
                    value={productSize}
                    placeholder="Enter product size"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Product Quantity</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setProductQuantity}
                    value={productQuantity}
                    placeholder="Enter product quantity"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>VerdiPoints</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setVerdiPoints}
                    value={verdiPoints}
                    placeholder="Enter VerdiPoints"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => console.log('Delete button pressed')}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => console.log('Edit button pressed')}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imagePicker: {
        alignItems: 'center',
        justifyContent: 'center', // Center the children vertically and horizontally
        marginVertical: 20,
        position: 'relative', // Position relative to allow absolute positioning of the camera button
        width: 150, // Set the width of the imagePicker
        height: 150, // Set the height of the imagePicker
    },
    image: {
        marginLeft: 200,
        width: '100%', // Take up all available space
        height: '100%', // Take up all available space
        borderRadius: 100, // Make it round
    },
    cameraButton: {
        position: 'absolute',
        left: 210, 
        bottom: 5, 
        backgroundColor: 'lightgrey',
        borderRadius: 15,
        padding: 8,
        zIndex: 1, // Ensure the camera button is always on top
    },
    inputContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    label: {
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
        // Additional styles if needed
      },
      button: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        // Adjust width as needed, or remove for auto width
      },
      deleteButton: {
        backgroundColor: '#d9534f', // Red color for the delete button
        // Additional styles for the delete button
      },
      editButton: {
        backgroundColor: '#5cb85c', // Green color for the edit button
        // Additional styles for the edit button
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
        // Additional text styles if needed
      },
});

export default CoordinatorViewProduct;
