import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import PointCard from '../components/PointCard';
import { theme } from "../../assets/style";


const MyPoints = () => {
    return(
        <View style={styles.container}>
            <View style={styles.pointsContainer}>
                <PointCard />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundColor,
    },
    pointsContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        margin: 30,
        borderRadius: 15,
    },

});

export default MyPoints;