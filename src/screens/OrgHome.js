import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions } from "react-native";
import defaultImage from '../../assets/img/default-image.png';
import { theme } from "../../assets/style";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import DeleteButton from "../components/DeleteButton";
import CardTask from "../components/CardTask";
import CardEvent from "../components/CardEvent";
import axios from "axios";
import ipAddress from "../database/ipAddress";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";

const OrgHome = ({route}) => {
    const localhost = ipAddress;

    const screenHeight = Dimensions.get('window').height;
    const paddingBottom = screenHeight * 0.15;

    const {user, organization} = route.params;
    const navigation = useNavigation();
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const [selected, setSelected] = useState('Tasks');

    const handleEventPress = (eventId) => {
        navigation.navigate('OrgView', { eventId: eventId });
    };
    
    const data = [
        {id: '1', title: 'Tasks'},
        {id: '2', title: 'Events'},
    ];

    const renderItem = ({item}) => {
        return (
            <DeleteButton title={item.title} onPress={() => setSelected(item.title)}/>
        );
    };

    const fetchOrganizationTasks = async () => {
        try {
            const response = await axios.get(`${localhost}/user/tasks/${user.OrganizationId}`);
            if (response.data && response.data.success) {
                setTasks(response.data.tasks);
            } else {
                throw new Error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchOrganizationEvents = async () => {
        try {
            const response = await axios.get(`${localhost}/user/organization/events/${user.OrganizationId}`);
            if (response.data && response.data.success) {
                setEvents(response.data.events);
            } else {
                throw new Error('Failed to fetch events');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const getDifficulty = (difficultyId) => {
        const difficultyString = String(difficultyId);
        switch (difficultyString) {
            case "0":
                return "All";
            case "1":
                return "Easy";
            case "2":
                return "Normal";
            case "3":
                return "Hard";
            default:
                return "Unknown";
            }
    };

    useEffect(() => {
        fetchOrganizationTasks();
        fetchOrganizationEvents();
    }, [user.OrganizationId]);

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
        <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: theme.colors.background, flex: 1,}} contentContainerStyle
        ={{paddingBottom: paddingBottom}} showsVerticalScrollIndicator={false}>
           
                <Image 
                    source={organization.OrganizationImage ? { uri: `${localhost}/img/organization/${organization.OrganizationImage}` } : defaultImage} 
                    style={styles.imageStyle} 
                />
                <View style={styles.divider} />
                <View style={{alignSelf: 'center', flex: 1,}}>
                    <FlatList 
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        horizontal={true}
                        contentContainerStyle={styles.flatListContainer}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                {selected === 'Tasks' ? 
                    tasks.map(task => (
                        <CardTask
                            key={task.TaskId}
                            img={`${localhost}/img/task/${task.TaskImage}`}
                            title={task.TaskName}
                            difficulty={getDifficulty(task.DifficultyId) || "No Difficulty"}
                            description={task.TaskDescription}
                            onPress={() => navigation.navigate('Tasks', { screen: 'TaskDetails', params: { taskId: task.TaskId }})}
                        />
                    )) : 
                    events.map(event => (
                        <CardEvent
                            key={event.EventId}
                            img={`${localhost}/img/event/${event.EventImage}`}
                            title={event.EventName}
                            venue={event.EventVenue}
                            description={event.EventDescription}
                            onPress={() => handleEventPress(event.EventId)}
                        />
                    ))
                }
        </ScrollView>
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
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    divider: {
        height: 1, 
        backgroundColor: '#B0A695', 
        width: '70%', 
        alignSelf: 'center', 
        marginTop: 10, 
        marginBottom: 10, 
    },
    imageStyle: {
        width: '90%',
        height: 150,
        resizeMode: 'center',
        borderRadius: 10,
        alignSelf: 'center',
    },
    flatListContainer: {
        marginTop: 20,
        gap: 30,
        justifyContent: 'center',
        alignContent: 'center',
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
        bottom: -25,
        zIndex: 1,
      },
    });


export default OrgHome;