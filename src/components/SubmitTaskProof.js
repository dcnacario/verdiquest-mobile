import React, { useState} from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../assets/style';

const SubmitTaskProof = ({ onSubmit }) => {
    const [selectedImages, setSelectedImages] = useState([]);

    const openImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission to access gallery is required!');
            return;
        }
    
        try {
            const pickerOptions = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            };
    
            if (Platform.OS === 'android') {
                const pickerResult = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    
                if (!pickerResult.canceled) {
                    const newImage = pickerResult.assets[0]; // Accessing the first selected image
                    setSelectedImages(oldImages => [...oldImages, newImage]);
                }
            }
    
            if (Platform.OS === 'ios') {
                pickerOptions.allowsMultipleSelection = true;
                const pickerResult = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    
                if (!pickerResult.canceled) {
                    const newImages = pickerResult.assets; 
                    setSelectedImages(oldImages => [...oldImages, ...newImages]);
                }
            }
        } catch (e) {
            console.log('Error during image selection', e);
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.proofSection}>
                <Text style={styles.proofLabel}>Proof Submitted:</Text>
                <TouchableOpacity onPress={openImagePicker} style={styles.addImageButton}>
                    <Text style={styles.actionText}>Add Images</Text>
                </TouchableOpacity>
                <View style={styles.proofContainer}>
                    {selectedImages.map((image, index) => (
                        <Image key={index} source={{ uri: image.uri }} style={styles.proofImage} />
                    ))}
                </View>
            </View>
            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => onSubmit(selectedImages)} style={styles.submitButton}>
                    <Text style={styles.actionText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
    },
    proofSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    proofLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addImageButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    proofContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    proofImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        margin: 5,
    },
    actionContainer: {
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: theme.colors.primary, 
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    actionText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
});

export default SubmitTaskProof;
