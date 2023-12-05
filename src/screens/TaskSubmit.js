import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, Alert, ScrollView, Dimensions } from "react-native";
import axios from "axios";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
import ipAddress from "../database/ipAddress";
import defaultImage from "../../assets/img/default-image.png";
import Details from "../components/Details";
import SubmitTaskProof from "../components/SubmitTaskProof";

const TaskSubmit = ({ route }) => {
    const { taskId, userId } = route.params; // Fetching taskId and userId from parameters
    //const navigation = useNavigation();
    const [taskDetails, setTaskDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const localhost = ipAddress;
    const screenHeight = Dimensions.get('window').height;
    const paddingBottom = screenHeight * 0.15;

    const fetchTaskDetails = async () => {
        try {
            const response = await axios.get(`${localhost}/user/fetchTaskDetails/${taskId}`);
            setTaskDetails(response.data.taskDetails || {});
        } catch (error) {
            console.error("Error fetching task details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
    }, [taskId]);

    const handleSubmit = (selectedImages) => {
        // Implement the submission logic here
        Alert.alert("Submit Task", "Task submitted successfully!");
        // Consider sending 'selectedImages' to your backend
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={taskDetails.TaskImage ? { uri: `${localhost}/img/task/${taskDetails.TaskImage}` } : defaultImage}
                    style={styles.imageStyle}
                />
            </View>
            <Text style={styles.title}>{taskDetails.TaskName}</Text>
            <View style={styles.detailsContainer}>
                <Details
                    timeCompleted={taskDetails.TaskDuration || "N/A"}
                    taskDescription={taskDetails.TaskDescription || "No description available."}
                    rewardPoints={taskDetails.TaskPoints || 0}
                />
            </View>
            <SubmitTaskProof onSubmit={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    contentContainer: {
        padding: 10,
        paddingBottom: Dimensions.get('window').height * 0.1,
    },
    imageContainer: {
        alignItems: 'center', 
        marginVertical: 5,    
    },
    imageStyle: {
        width: '80%',         
        height: 200,          
        resizeMode: 'cover',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',       
    },
    detailsContainer: {
        padding: 10,                
        borderRadius: 10,   
        marginVertical: -20,                  
    },

});

export default TaskSubmit;

