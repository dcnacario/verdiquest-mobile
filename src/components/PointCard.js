import React, { useState, useEffect} from "react";
import {View, StyleSheet, Text} from 'react-native';
import { theme } from "../../assets/style";



const PointCard = ({points = 0}) => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const dateString = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }); 
        setCurrentDate(dateString);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.verdiPointsLabel}> {points} VP</Text>
            <Text style={styles.availablePointsLabel}>Available Points</Text>
            <Text style={styles.dateLabel}>{currentDate}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        height: 120,
        width: 200,
        backgroundColor: theme.colors.pointCardBackground,
        borderRadius: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    verdiPointsLabel: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    availablePointsLabel: {
        fontSize: 18,
    },
    dateLabel: {
        fontWeight: 'bold',
        fontSize: 14,
    }
});


export default PointCard;