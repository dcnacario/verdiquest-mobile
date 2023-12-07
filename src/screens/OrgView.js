import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, Image, Alert, Modal, TextInput, Button } from 'react-native';
import { theme } from "../../assets/style";
import defaultImage from '../../assets/img/default-image.png';
import ipAddress from "../database/ipAddress";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';


const OrgView = ({ route }) => {
    const { user, eventId } = route.params;
    const userId = user.UserId;
    const localhost = ipAddress;
    const [eventDetails, setEventDetails] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [feedbackGiven, setFeedbackGiven] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchDetailsAndCheckApplication = async () => {
                try {
                    // Fetch event details
                    const detailsResponse = await axios.get(`${localhost}/user/event/details/${eventId}`);
                    if (isActive && detailsResponse.data.success) {
                        setEventDetails(detailsResponse.data.event);
                    } else if (isActive) {
                        console.log("Event not found");
                    }

                    // Check application status
                    const applicationResponse = await axios.get(`${localhost}/user/eventApplyStatus, { params: { userId, eventId } }`);
                    if (isActive) {1
                        setIsApplied(applicationResponse.data.status);
                        setFeedbackGiven(applicationResponse.data.feedbackGiven);
                    }

                    const verificationResponse = await axios.get(`${localhost}/user/checkApplicationVerified, { params: { userId, eventId } }`);
                    if (isActive && verificationResponse.data.isVerified) {
                        setIsVerified(true);
                        setShowModal(!applicationResponse.data.feedbackGiven);
                    }
                } catch (error) {
                    console.error("Error:", error);
                } finally {
                    if (isActive) {
                        setLoading(false);
                    }
                }
            };

            fetchDetailsAndCheckApplication();

            return () => {
                isActive = false;
            };
        }, [eventId, userId])
    );
    
    const onPressApply = async () => {
        // Check if the user ID or event ID is missing
        if (!userId || !eventDetails?.EventId) {
            console.log("User ID or Event ID is missing");
            return;
        }
    
        // Set loading to true while processing the request
        setLoading(true);
    
        try {
            // Make the request to apply for the event
            const response = await axios.post(`${localhost}/user/applyEvent`, {
                userId: userId,
                eventId: eventDetails.EventId,
            });
    
            // Handle the response
            if (response.data.success) {
                setIsApplied(true);
                Alert.alert("Application Successful", "Your application is now being verified.");
            } else {
                // Handle the case where the user has already applied for the event
                Alert.alert("Application Failed", "You have already applied for this event.");
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error applying for event:', error);
            Alert.alert("Application Failed", "There was an error applying for the event.");
        } finally {
            // Set loading to false after processing the request
            setLoading(false);
        }
    };
    
    const submitFeedback = async () => {
        try {
            await axios.post(`${localhost}/user/submitFeedback, { userId, eventId, feedback }`);
            setShowModal(false);
            setFeedback('');
            setFeedbackGiven(true);
            Alert.alert("Feedback Submitted", "Thank you for your feedback!");
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert("Feedback Submission Failed", "Unable to submit feedback at this time.");
        }
    };
    const renderFeedbackModal = () => {
        if (!feedbackGiven) {
            return (
                <Modal transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Provide your feedback</Text>
                        <TextInput 
                            style={styles.input}
                            onChangeText={setFeedback}
                            value={feedback}
                            placeholder="Enter your feedback"
                        />
                        <Button title="Submit Feedback" onPress={submitFeedback} />
                    </View>
                </Modal>
            );
        }
        return null;
    };

    const truncateDescription = (description, maxLength = 30) => {
        if (description.length > maxLength) {
            return `${description.substring(0, maxLength)}...`; 
        }
        return description;
    };

    if (!eventDetails) {
        return <Text>Loading...</Text>; 
    }

    Ter
    return (
            <View style={styles.container}>
                <Image 
                    source={eventDetails.EventImage ? { uri: `${localhost}/img/event/${eventDetails.EventImage}` } : defaultImage} 
                    style={styles.imageStyle} 
                />
                <Text style={styles.titleStyle}>{eventDetails.EventName}</Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.textStyle}>Event Details</Text>
                    <Text>Description: {truncateDescription(eventDetails.EventDescription)}</Text>
                    <Text>Location: {eventDetails.EventVenue}</Text>
                    <Text>Event Date: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(eventDetails.EventDate))}</Text>
                    <Text>Points Reward: {eventDetails.EventPoints}</Text>
                </View>
                <View style={{ alignItems: 'center', gap: 10 }}>
                    <Text>Time Completion: 5 hrs</Text>
                    <Text>19/30</Text>
                    {isApplied ? (
                        isVerified && !feedbackGiven ? (
                            renderFeedbackModal()
                        ) : (
                            <>
                                <View style={styles.buttonWrapper}>
                                    <Button title="APPLIED" disabled={true} />
                                </View>
                                <Text>Waiting for approval</Text>
                            </>
                        )
                    ) : (
                        <View style={styles.buttonWrapper}>
                            <Button title="APPLY" onPress={onPressApply} disabled={isLoading} />
                        </View>
                    )}
                </View>
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
        alignItems: 'center',
        gap: 20,
    },
    imageStyle: {
        borderRadius: 15,
        width: "90%",
        height: 150,
        resizeMode: "cover",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    detailsContainer: {
        backgroundColor: '#D9D9D9',
        width: '90%',
        padding: 20,
        borderRadius: 15,
    },
    buttonWrapper: {
        marginVertical: 10, 
        width: '80%', 
        alignSelf: 'center',
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    titleStyle: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        width: '80%',
    },
});

export default OrgView;
