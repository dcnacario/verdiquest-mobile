import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { theme } from "../../assets/style";
import { MaterialIcons } from "@expo/vector-icons";

const Details = ({timeCompleted, taskDescription = 'Lorem ipsum', rewardPoints = 0}) => {
    return (
        <View style={styles.container}>
            <View style={{alignSelf: 'center', flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons name='access-time' size={20} color={theme.colors.primary}/>
                <Text style={styles.textStyle}>Time Completion: {timeCompleted}</Text>
            </View>
            <View>
                <Text style={styles.titleStyle}>Details</Text>
                <Text>{taskDescription}</Text>
            </View>
            <View style={{alignSelf: 'flex-end'}}>
                <Text style={styles.textStyle}>Reward: {rewardPoints} <Text style={{color: theme.colors.primary}}>VP</Text></Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
        backgroundColor: '#D9D9D9',
        padding: 20,
        margin: 20,
        borderRadius: 20,
    },
    textStyle: {
        fontWeight: 'bold',
    },
    titleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default Details;