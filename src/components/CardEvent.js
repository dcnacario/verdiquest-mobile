import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import defaultImage from "../../assets/img/default-image.png";

const CardEvent = ({ img, title, description, venue, onPress }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageAlignment}>    
                {img != null ? (
                    <Image source={{ uri: img }} style={styles.imageStyle} />
                ) : (
                    <Image source={defaultImage} style={styles.imageStyle} />
                )}
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardVenue}>{venue}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{description}</Text>
                <TouchableOpacity style={styles.viewButton} onPress={onPress}>
                    <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#F7F2FA',
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 16, 
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
        overflow: 'hidden',
        width: '90%',
    },
    imageAlignment: {
        alignItems: 'center',
    },
    imageStyle: {
        width: 260, 
        height: 150,
        resizeMode: "cover",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 15,
        color: 'black', 
        marginBottom: 16,
    },
    cardVenue: {
        fontSize: 14,
        color: '#646464',
        marginBottom: 4,
    },
    viewButton: {
        backgroundColor: '#3D691B', 
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default CardEvent;
