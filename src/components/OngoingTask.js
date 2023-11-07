import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import { theme } from "../../assets/style";
import ProgressCard from "./ProgressCard";


const OngoingTask = ({points = 0,}) => {
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 20,}}>
                <View>
                    <Text style={styles.textStyle}>Ongoing</Text>
                    <Text style={styles.textStyle}>Task</Text>
                </View>
                <View>
                    <Text style={styles.textStyle}>Possible Points to </Text>
                    <Text style={styles.textStyle}>be earned: {points} </Text>
                </View>
            </View>
            <ProgressCard title='Market Cleanup' category='Environmental Protection' progress={0.90}/>
            <ProgressCard title='Planting Tree' category='Environmental Protection' progress={0.75}/>
            <ProgressCard title='Walk 10,000 steps' category='Transportation' progress={0.50}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.primary,
        borderRadius: 15,
        marginHorizontal: 30,
        marginBottom: 30,

    },
    textStyle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default OngoingTask;