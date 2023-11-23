import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, Modal, TouchableOpacity } from 'react-native';
import Details from "../components/Details";
import Button from "../components/Button";
import defaultImage from '../../assets/img/default-image.png';
import axios from 'axios'; // Make sure to import axios
import { useNavigation } from "@react-navigation/native";

const TaskDetails = ({ route }) => {
    const navigation = useNavigation();
    const [isAccepted, setIsAccepted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [taskDetails, setTaskDetails] = useState({}); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://192.168.68.110:3000/user/fetchTaskDetails/${route.params.taskId}`);
                if (response.data.success) {
                    setTaskDetails(response.data.taskDetails);
                } else {
                    console.log('Task not found');
                }
            } catch (error) {
                console.error('Error fetching task details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [route.params.taskId]);

    const onPressAccept = () => {
        setIsAccepted(true);
        setShowModal(true);
    };

    const onPressOngoingTask = () => {
        navigation.navigate('MyPoints', { user: user })
    };

    const onPressCancelTask = () => {
        setIsAccepted(false);
    };

    if (isLoading) {
        return <Text>Loading...</Text>; 
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    source={taskDetails.ImageUrl ? { uri: taskDetails.ImageUrl } : defaultImage} 
                    style={styles.imageStyle}
                />
            </View>
            <Text style={styles.textStyle}>{taskDetails.TaskName}</Text>
            <Details 
                timeCompleted={taskDetails.TaskDuration || 'N/A'} 
                taskDescription={taskDetails.TaskDescription || 'No description available.'}
                rewardPoints={taskDetails.TaskPoints || 0}
            />
            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
            {isAccepted ? (
                <>
                    <Button title='Ongoing' onPress={onPressOngoingTask} />
                    <View style={{ width: 50 }} />
                    <Button title='Cancel' onPress={onPressCancelTask} />
                </>
            ) : (
                <Button title='ACCEPT' onPress={onPressAccept} />
            )}
            <Modal transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={() => setShowModal(false)}>
                    <View style={{ backgroundColor: '#7b904b', padding: 50, borderRadius: 10 }}>
                        <Text style={styles.textStyle}>Mission Accepted!</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    imageStyle: {
        width: '100%',
        height: 250,
        resizeMode: 'center',
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
    },
    imageContainer: {
        margin: 20,
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 28,
    },
});

export default TaskDetails;