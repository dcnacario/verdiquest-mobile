import React, { useState, useCallback } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import axios from 'axios';
import { theme } from '../../assets/style';
import PointCard from '../components/PointCard';
import ProfileCard from '../components/ProfileCard';
import CardTask from '../components/CardTask';
import ipAddress from '../database/ipAddress';
import { useNavigation } from '@react-navigation/native';

const Home = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();
  const [userPoint, setUserPoints] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const localhost = ipAddress;
  const screenHeight = Dimensions.get('window').height;
  const paddingBottom = screenHeight * 0.15;

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${localhost}/user/fetchAcceptedTasks/${user.UserId}`);
      if (response.data.success) {
        const tasksWithUniqueKeys = response.data.acceptedTasks.map(task => ({
          ...task,
          key: `task-${task.TaskId}-${Math.random().toString(16).slice(2)}`,
        }));
        setTasks(tasksWithUniqueKeys);
      } else {
        console.log('Failed to fetch accepted tasks');
      }
    } catch (error) {
      console.error('Error fetching accepted tasks:', error);
    }
  };

  const fetchVerdiPoints = async () => {
    try {
      const response = await axios.get(`${localhost}/user/fetchVerdiPoints/${user.UserId}`);
      if (response.data.success) {
        setUserPoints(response.data.verdiPoints);
      } else {
        console.log('Failed to fetch VerdiPoints');
      }
    } catch (error) {
      console.error('Error fetching VerdiPoints:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTasks();
      await fetchVerdiPoints();
    } catch (error) {
      console.error('Error occurred during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  const formatPoints = points => {
    return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getDifficultyLevel = difficultyId => {
    const difficultyString = String(difficultyId);
    switch (difficultyString) {
      case '0':
        return 'All';
      case '1':
        return 'Easy';
      case '2':
        return 'Normal';
      case '3':
        return 'Hard';
      default:
        return 'Unknown';
    }
  };

  const truncateDescription = (description, maxLength = 40) => {
    if (description.length > maxLength) {
      return `${description.substring(0, maxLength)}...`;
    }
    return description;
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      style={{ backgroundColor: theme.colors.background, flex: 1 }}
      contentContainerStyle={{ paddingBottom: paddingBottom }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, marginTop: 10 }}>
          <View style={styles.cardContainer}>
            <ProfileCard email={user.Email} />
            <PointCard points={formatPoints(userPoint)} />
          </View>
          <View>
            <TouchableOpacity style={styles.buttonStyle}>
              <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
                Ongoing Tasks
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: theme.colors.primary, fontWeight: 'bold', marginVertical: 20 }}>
              Daily Tasks
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column', margin: 10 }}>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <CardTask
                  key={task.key}
                  img={`${localhost}/img/task/${task.TaskImage}`}
                  title={task.TaskName || 'No Title'}
                  difficulty={getDifficultyLevel(task.DifficultyId) || 'No Difficulty'}
                  description={truncateDescription(task.TaskDescription || 'No Description')}
                  onPress={() => navigation.navigate('Tasks', { screen: 'TaskDetails', params: { taskId: task.TaskId } })}
                />
              ))
            ) : (
              <Text style={styles.noTasksText}>You have not yet accepted any tasks.</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 30,
  },
  buttonStyle: {
    marginHorizontal: 30,
    backgroundColor: '#3D691B',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  noTasksText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 20,
  },
  // Add other styles here as needed
});

export default Home;
