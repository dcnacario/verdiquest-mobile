import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from "../../../assets/style";
import * as ImagePicker from 'expo-image-picker';

const CoordinatorEditProduct = (props) => {
    // Assume props contain the product details to edit, passed when navigating to this component
    const [productName, setProductName] = useState(props.productName || '');
    const [productDescription, setProductDescription] = useState(props.productDescription || '');
    const [productSize, setProductSize] = useState(props.productSize || '');
    const [productQuantity, setProductQuantity] = useState(props.productQuantity?.toString() || '');
    const [verdiPoints, setVerdiPoints] = useState(props.verdiPoints?.toString() || '');
    const [imageUri, setImageUri] = useState('../../../assets/img/verdiquestlogo-ver2.png');

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need media library permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageUri(result.uri);
        }
    };
    return (
        <ScrollView style={styles.container}>
           <View style={styles.imagePicker}>
           <Image 
                    source={imageUri ? { uri: imageUri } : require('../../../assets/img/verdiquestlogo-ver2.png')}
                    style={styles.image}
                />
                <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                    <Icon name="camera" size={24} color="black" />
                </TouchableOpacity>
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

            <View style={styles.buttonContainer}>
                <Button
                    title="Update"
                    onPress={() => console.log('Update button pressed')}
                    color={theme.colors.primary}
                />
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
    buttonContainer: {
        marginHorizontal: 120,
        marginTop: 20,
    },
    updateButton: {
        backgroundColor: '#34A853'
    },
});

export default CoordinatorEditProduct;
