import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import { theme } from "../../assets/style";



const PointCard = ({points}) => {
    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.verdiPointsLabel}> {points} VP</Text>
                <Text style={styles.availablePointsLabel}>Available Points</Text>
                <Text style={styles.dateLabel}>October 29, 2023</Text>
            </View>
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
    },
    verdiPointsLabel: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    availablePointsLabel: {
        fontSize: 16,
    },
    dateLabel: {
        fontWeight: 'bold',
    }
});


export default PointCard;