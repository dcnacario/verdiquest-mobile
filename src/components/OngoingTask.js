import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import { theme } from "../../assets/style";
import ProgressCard from "./ProgressCard";
import ipAddress from "../database/ipAddress";


const OngoingTask = ({ tasks }) => {
    const localhost = ipAddress;
    const getDifficultyLevel = (difficultyId) => {
        const difficultyString = String(difficultyId);
        switch (difficultyString) {
            case "0":
                return "All";
            case "1":
                return "Easy";
            case "2":
                return "Moderate";
            case "3":
                return "Hard";
            case "4":
                return "Challenging";
            case "5":
                return "Expert";
            default:
                return "Unknown";
            }
    };

    const calculateTotalPoints = () => {
        const totalPoints = tasks && tasks.length > 0
            ? tasks.reduce((acc, task) => acc + (task.TaskPoints || 0), 0)
            : 0;
        return totalPoints.toLocaleString(); 
    };

    const truncateText = (text, maxLength = 20) => {
        if (text.length > maxLength) {
            return `${text.substring(0, maxLength)}...`; 
        }
        return text;
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                <View>
                    <Text style={styles.textStyle}>Ongoing</Text>
                    <Text style={styles.textStyle}>Task</Text>
                </View>
                <View>
                    <Text style={styles.subTextStyle}>Possible Points to </Text>
                    <Text style={styles.subTextStyle}>be earned: {calculateTotalPoints()} </Text>
                </View>
            </View>
            <View>
                {tasks && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <ProgressCard
                            key={task.key}
                            img={`${localhost}/img/task/${task.TaskImage}`}
                            title={truncateText(task.TaskName || "No Title", 15)} 
                            description={truncateText(task.TaskDescription || "No Description")}
                            difficulty={getDifficultyLevel(task.DifficultyId) || "No Difficulty"}
                            progress={task.progress}
                        />
                    ))
                ) : (
                    <Text style={styles.noTasksText}>No ongoing tasks</Text>
                )}
            </View>
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
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
        
    },
    subTextStyle: {
        color: 'white',
        fontSize: 14,
        textAlign: 'right',
    },
    noTasksText: {
        textAlign: 'center',
        color: '#36454F',
        marginTop: 20,
    },
});

export default OngoingTask;