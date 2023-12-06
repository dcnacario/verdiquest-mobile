import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, Modal, TouchableOpacity, Alert, BackHandler } from "react-native";
import Details from "../components/Details";
import Button from "../components/Button";
import defaultImage from "../../assets/img/default-image.png";
import axios from "axios";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import ipAddress from "../database/ipAddress";
import { Path, Svg } from "react-native-svg";


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
                <Svg
        height={200}
        width={1440}
        viewBox="0 0 1440 320"
        style={styles.svgCurve}
      >
        <Path
          fill="#7B904B"
          d="M612.476 144.841L550.386 111.881C529.789 100.947 504.722 102.937 486.109 116.985L415.77 170.07C398.787 182.887 376.287 185.752 356.635 177.599L310.915 158.633C298.156 153.339 283.961 152.611 270.727 156.57L214.143 173.499C211.096 174.41 208.241 175.872 205.72 177.813C194.011 186.826 177.156 184.305 168.597 172.26L150.51 146.806C133.89 123.417 102.3 116.337 77.2875 130.397L0.635547 173.483L1.12709 99.8668C1.49588 44.6395 46.5654 0.167902 101.793 0.536689L681.203 4.40584C727.636 4.71591 765.026 42.6089 764.716 89.0422C764.538 115.693 743.66 137.608 717.049 139.075L612.476 144.841Z"
        />
      </Svg>
      <View style={styles.row}>
        <Svg
          height={200}
          width="1440"
          viewBox="0 0 1440 320"
          style={styles.bottomWavy}
        >
          <Path
            fill="#7B904B"
            d="M161.5 41.4474L219.626 76.2389C241.673 89.435 269.675 87.1283 289.265 70.5023L323.5 41.4474L357.823 16.6873C375.519 3.92172 398.75 1.76916 418.49 11.0659L462.12 31.6136C475.56 37.9434 490.87 39.0619 505.088 34.7525L556.393 19.2018C562.151 17.4565 567.521 14.6238 572.213 10.857C583.853 1.51223 599.233 -1.76023 613.669 2.03681L718.763 29.68C745.125 36.6142 763.5 60.4475 763.5 87.7063V135.5H544H69.9837C31.3327 135.5 0 104.167 0 65.5163C0 39.7769 22.9464 20.0957 48.3856 24.016L161.5 41.4474Z"
          />
        </Svg>
      </View>
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
    svgCurve: {
        position: "absolute",
        top: -2,
        left: -316,
        zIndex: 0,
      },
      row: {
        flexDirection: "row",
        height: 0,
        justifyContent: "center",
        alignItems: "center",
        left: -30,
        position: "absolute",
        bottom: -30,
        zIndex: 0,
      },
      bottomWavy: {
        position: 'absolute',
        bottom: -310,
        left: -300,
        zIndex: 0,
      },
});

export default TaskDetails;
