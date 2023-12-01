import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import { theme } from "../../assets/style";
import defaultImage from '../../assets/img/default-image.png';
import Button from "../components/Button";
import ipAddress from "../database/ipAddress";
import axios from "axios";

const OrgView = ({ route, img }) => {
    const { eventId } = route.params;
    const localhost = ipAddress;
    const [eventDetails, setEventDetails] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${localhost}/user/event/details/${eventId}`);
                if (response.data && response.data.success) {
                    setEventDetails(response.data.event);
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const truncateDescription = (description, maxLength = 30) => {
        if (description.length > maxLength) {
            return `${description.substring(0, maxLength)}...`; 
        }
        return description;
    };

    if (!eventDetails) {
        return <Text>Loading...</Text>; 
    }
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
            <View style={{alignItems: 'center', gap: 10}}>
                <Text>Time Completion: 5 hrs</Text>
                <Text>19/30</Text>
                <Button title={'Apply'}/>
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
});

export default OrgView;
