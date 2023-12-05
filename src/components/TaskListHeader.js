import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList , ScrollView} from 'react-native';
import { theme } from "../../assets/style";
import CardTask from "./CardTask";
import axios from 'axios';
import ipAddress from "../database/ipAddress";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from 'react-native-svg';

const TaskListHeader = ({ route }) => {
    const navigation = useNavigation();
    const user = route?.params?.user || {};
    const [tasks, setTasks] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const localhost = ipAddress;

    useEffect(() => {
        fetchTasksByDifficulty('All');
    }, []);

    const fetchTasksByDifficulty = async (difficultyTitle) => {
        try {
            setSelectedDifficulty(difficultyTitle);
            let endpoint = difficultyTitle === 'All'
                ? `${localhost}/user/fetchAllDifficulty`
                : `${localhost}/user/fetch${difficultyTitle}Task`;

            const response = await axios.get(endpoint);
            if (response.data.success) {
                setTasks(response.data.fetchedTable);
            } else {
                console.log('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const difficulties = [
        { id: '0', title: 'All' },
        { id: '1', title: 'Easy' },
        { id: '2', title: 'Normal' },
        { id: '3', title: 'Hard' },
    ];

    const getDifficulty = (difficultyId) => {
        const difficultyString = String(difficultyId);
        switch (difficultyString) {
            case '0': return 'All';
            case '1': return 'Easy';
            case '2': return 'Normal';
            case '3': return 'Hard';
            default: return 'Unknown';
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.difficultyButton,
                selectedDifficulty === item.title ? styles.selectedButton : null
            ]}
            onPress={() => fetchTasksByDifficulty(item.title)}
        >
            <Text style={styles.difficultyText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
        <FlatList
            data={difficulties}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal={true}
            contentContainerStyle={styles.flatListContainer}
            showsHorizontalScrollIndicator={false}
            extraData={selectedDifficulty}
        />
        <View style={styles.svgContainer}>
            <Svg
                height={200}
                width={1440}
                viewBox="0 0 1440 320"
                style={styles.svgCurve}
            >
                 <Path
                    fill="#7B904B"
                    d='M612.476 144.841L550.386 111.881C529.789 100.947 504.722 102.937 486.109 116.985L415.77 170.07C398.787 182.887 376.287 185.752 356.635 177.599L310.915 158.633C298.156 153.339 283.961 152.611 270.727 156.57L214.143 173.499C211.096 174.41 208.241 175.872 205.72 177.813C194.011 186.826 177.156 184.305 168.597 172.26L150.51 146.806C133.89 123.417 102.3 116.337 77.2875 130.397L0.635547 173.483L1.12709 99.8668C1.49588 44.6395 46.5654 0.167902 101.793 0.536689L681.203 4.40584C727.636 4.71591 765.026 42.6089 764.716 89.0422C764.538 115.693 743.66 137.608 717.049 139.075L612.476 144.841Z'
                />
            </Svg>
        </View>
        <ScrollView style={{ flex: 1, width: '100%' }}>
            {/* Your task list */}
            {tasks.length > 0 ? (
                tasks.map((task, index) => (
                    <CardTask
                        key={index}
                        img={`${localhost}/img/task/${task.TaskImage}`}
                        title={task.TaskName}
                        difficulty={getDifficulty(task.DifficultyId)} 
                        description={task.TaskDescription}
                        onPress={() => navigation.navigate('TaskDetails', { taskId: task.TaskId })}
                    />
                ))
            ) : (
                <Text style={styles.noTasksText}>No available tasks, come back tomorrow.</Text>
            )}
        </ScrollView>
        <View style={styles.bottomWavyContainer}>
            <Svg
                height={200}
                width="1440"
                viewBox="0 0 1440 320"
                style={styles.bottomWavy}
            >
                <Path
                    fill="#7B904B"
                    d='M161.5 41.4474L219.626 76.2389C241.673 89.435 269.675 87.1283 289.265 70.5023L323.5 41.4474L357.823 16.6873C375.519 3.92172 398.75 1.76916 418.49 11.0659L462.12 31.6136C475.56 37.9434 490.87 39.0619 505.088 34.7525L556.393 19.2018C562.151 17.4565 567.521 14.6238 572.213 10.857C583.853 1.51223 599.233 -1.76023 613.669 2.03681L718.763 29.68C745.125 36.6142 763.5 60.4475 763.5 87.7063V135.5H544H69.9837C31.3327 135.5 0 104.167 0 65.5163C0 39.7769 22.9464 20.0957 48.3856 24.016L161.5 41.4474Z'
                />
            </Svg>
        </View>
    </View>
);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    textStyle: {
        fontSize: 36,
        color: theme.colors.primary,
        textAlign: 'center',
    },
    flatListContainer: {
        marginTop: 100,
        gap: 5,
        justifyContent: 'center',
        alignContent: 'center',
        paddingHorizontal: 16,
    },
    difficultyButton: {
        width: 70,
        padding: 10,
        marginHorizontal: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
    },
    selectedButton: {
        backgroundColor: theme.colors.primary,
    },
    difficultyText: {
        color: 'white',
        textAlign: 'center',
    },
    noTasksText: {
        fontSize: 16,
        color: '#36454F',
        textAlign: 'center',
        marginTop: 10,
    },
    svgCurve: {
        position: 'absolute',
        top: -141,
        left: -300,
        zIndex: -1,
    },
    bottomWavy: {
        position: 'absolute',
        bottom: -150,
        left: -300,
        zIndex: -5,
    },
    svgContainer: {
        zIndex: -1,
    },
});

export default TaskListHeader;
