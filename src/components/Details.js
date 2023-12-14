import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { theme } from "../../assets/style";
import { MaterialIcons } from "@expo/vector-icons";

const Details = ({ timeCompleted, taskDescription = 'No description available.', rewardPoints = 0 }) => {
    return (
        <View style={styles.container}>
            <View style={styles.timeContainer}>
                <MaterialIcons name='access-time' size={20} color={theme.colors.primary}/>
                <Text style={styles.textStyle}>Time Completion: {timeCompleted}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.titleStyle}>Task Instruction</Text>
                <Text style={styles.descriptionStyle}>{taskDescription}</Text>
            </View>
            <Text style={styles.rewardTextStyle}>Reward: {rewardPoints} <Text style={styles.rewardValueStyle}>VP</Text></Text>
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
        backgroundColor: '#FFFFFF', 
        padding: 20,
        margin: 20,
        borderRadius: 20,
    },
    headerStyle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 10, 
        textAlign: 'center', 
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, 
    },
    textStyle: {
        marginLeft: 5, 
        fontWeight: 'bold',
        color: '#3D691B', 
    },
    detailsContainer: {
        marginBottom: 10, 
    },
    titleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5, 
    },
    descriptionStyle: {
        fontSize: 16, 
    },
    rewardTextStyle: {
        fontWeight: 'bold',
        alignSelf: 'flex-end', 
        fontSize: 18, 
    },
    rewardValueStyle: {
        color: theme.colors.primary, 
    },
});

export default Details;
