import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import defaultImage from '../../assets/img/default-image.png';

const ProfileCard = ({ img, email }) => {
    const image = img ? { uri: img } : defaultImage;

    // Function to remove '@gmail.com'
    const formatEmail = (email) => {
        return email.split('@')[0];
    };

    return (
        <View style={{flex: 1, alignItems: 'center',}} >
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.imageStyle}/>
                <Text>{email ? formatEmail(email) : ''}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    imageStyle: {   
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 100 / 2,
        padding: 5,
        borderWidth: 1, 
        borderColor: 'black', 
    },
});

export default ProfileCard;