import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import PointCard from '../components/PointCard';
import { theme } from "../../assets/style";
import OngoingTask from "../components/OngoingTask";


const MyPoints = () => {
    return(
        <View style={styles.container}>
            <View style={styles.pointsContainer}>
                <PointCard />
            </View>
            <OngoingTask />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundColor,
        flexDirection: 'column',
    },
    pointsContainer: {
        flexDirection: 'row',
        margin: 30,
        borderRadius: 15,
    },

});

export default MyPoints;