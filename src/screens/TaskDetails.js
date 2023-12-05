import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, Modal, TouchableOpacity, Alert, BackHandler } from "react-native";
import Details from "../components/Details";
import Button from "../components/Button";
import defaultImage from "../../assets/img/default-image.png";
import axios from "axios";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import ipAddress from "../database/ipAddress";

const TaskDetails = ({ route }) => {
    const navigation = useNavigation();
    const [isAccepted, setIsAccepted] = useState(false);
    const [taskExpired, setTaskExpired] = useState(false);
    const [taskDetails, setTaskDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const localhost = ipAddress;
    const { user } = route.params;

    const isFocused = useIsFocused();

    const fetchDetailsAndCheckAcceptance = async () => {
        const taskId = route.params.taskId;
        const userId = user.UserId;

        try {
            const detailsResponse = await axios.get(`${localhost}/user/fetchTaskDetails/${taskId}`);
            setTaskDetails(detailsResponse.data.taskDetails || {});

            const acceptanceResponse = await axios.get(`${localhost}/user/checkTaskAccepted/${userId}/${taskId}`);
            setIsAccepted(acceptanceResponse.data.isAccepted);
            console.log("setIsAccepted " + acceptanceResponse.data.isAccepted)
            setTaskExpired(acceptanceResponse.data.taskExpired);
            console.log("setTaskExpired " + acceptanceResponse.data.taskExpired)
        } catch (error) {
            console.error("Error fetching task details or checking acceptance:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchDetailsAndCheckAcceptance();
        }
    }, [isFocused, route.params.taskId, user.UserId]);
    
    const onPressAccept = async () => {
        if (taskExpired) {
            Alert.alert("Task Expired", "This task has already expired and cannot be accepted.");
            return;
        }
        
        try {
            const response = await axios.post(`${localhost}/user/acceptTask`, {
                userId: user.UserId,
                taskId: taskDetails.TaskId,
            });
            if (response.data.message === "Mission Accepted!") {
                setIsAccepted(true);
                setErrorMessage("Mission Accepted!");
                setShowModal(true); 
            } else {
                setErrorMessage(response.data.message);
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorMessage("Error accepting task.");
            setShowErrorModal(true);
        }
    };


    const onPressCancelTask = async () => {
        if (!user?.UserId || !taskDetails?.TaskId) {
            console.log("User ID or Task ID is missing");
            return;
        }
        try {
            const response = await axios.post(`${localhost}/user/cancelTask`, {
                userId: user.UserId,
                taskId: taskDetails.TaskId,
            });
            if (response.data.success) {
                setIsAccepted(false);
                setTaskExpired(false);
                Alert.alert('Success', 'Task cancelled successfully');
            } else {
                Alert.alert("Error", "Failed to cancel the task");
            }
        } catch (error) {
            console.error("Error cancelling task:", error);
            Alert.alert("Error", "An error occurred while cancelling the task");
        }
    };

    const onPressSubmit = () => {
        navigation.navigate('TaskSubmit', { 
            taskId: taskDetails.TaskId, 
            userId: user.UserId 
        });
    };

    useEffect(() => {
        const backAction = () => {
            Alert.alert('Hold on!', 'Are you sure you want to go back?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => navigation.goBack() },
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation]);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                source={taskDetails.TaskImage ? { uri:`${localhost}/img/task/${taskDetails.TaskImage}` } : defaultImage
                }
                style={styles.imageStyle}
                />
            </View>
            <Text style={styles.textStyle}>{taskDetails.TaskName}</Text>
            <Details
                timeCompleted={taskDetails.TaskDuration || "N/A"}
                taskDescription={taskDetails.TaskDescription || "No description available."
                }
                rewardPoints={taskDetails.TaskPoints || 0}
            />
        <View style={styles.buttonContainer}>
            {console.log("Accepted"+isAccepted)}
            {console.log("Task Expired"+ taskExpired)}
            {isAccepted ? (
                taskExpired ? (
                    <View style={styles.buttonWrapper}>
                        <Button title="EXPIRED" disabled={true} />
                    </View>
                    ) : (
                        <>
                            <View style={styles.buttonWrapper}>
                                <Text>{taskDetails.Status}</Text>
                            </View>
                            <View style={styles.buttonWrapper}>
                                <Button title="Submit" onPress={onPressSubmit} />
                            </View>
                            <View style={styles.buttonWrapper}>
                                <Button title="Cancel" onPress={onPressCancelTask} />
                            </View>
                        </>
                    )
                ) : (
                    <View style={styles.buttonWrapper}>
                        <Button title={taskExpired ? "EXPIRED" : "ACCEPT"} onPress={onPressAccept} disabled={taskExpired} />
                    </View>
                )}
        </View>
        <Modal transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
            <TouchableOpacity style={styles.modalStyle} onPress={() => setShowModal(false)}>
                <View style={styles.modalInnerStyle}>
                    <Text style={styles.textStyle}>Mission Accepted!</Text>
                </View>
            </TouchableOpacity>
        </Modal>
        <Modal transparent={true} visible={showErrorModal} onRequestClose={() => setShowErrorModal(false)}>
            <TouchableOpacity style={styles.modalStyle} onPress={() => setShowErrorModal(false)}>
                <View style={styles.modalInnerStyle}>
                    <Text style={styles.textStyle}>{errorMessage}</Text>
                </View>
            </TouchableOpacity>
        </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
    },
    imageStyle: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
        borderRadius: 15,
        borderColor: "black",
        borderWidth: 1,
    },
    imageContainer: {
        margin: 20,
    },
    textStyle: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 28,
    },
    modalStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalInnerStyle: {
        backgroundColor: "#7b904b",
        padding: 50,
        borderRadius: 10,
    },
    buttonContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonWrapper: {
        marginHorizontal: 10, 
    },
    expiredText: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20,
        color: "red",
    },
});

export default TaskDetails;
