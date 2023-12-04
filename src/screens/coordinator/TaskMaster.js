import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import CoordTaskCard from "../../components/CoordTaskCard";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import { useIsFocused } from "@react-navigation/native";

const TaskMaster = ({ route }) => {
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const localhost = ipAddress;
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const navigation = useNavigation();
  const { coordinator } = route.params;

  //CREATING A CONFIRMATION MODAL FOR DELETING
  const ConfirmModal = ({ isVisible, onConfirm, onCancel, title }) => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={isVisible}
        onRequestClose={onCancel}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure to delete this Task?
            </Text>
            <Text style={styles.modalText}>{title}</Text>
            <View
              style={{ flexDirection: "row", alignSelf: "flex-end", gap: 10 }}
            >
              <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  //navigate to creation of task
  const goToCreateTask = () => {
    navigation.navigate("CreateTaskDashboard", {
      coordinator: coordinator,
      // onTaskCreated: fetchTasks,
    });
  };

  //navigation for View
  const gotoCard = (taskData, onTaskFetch) => {
    navigation.navigate("TaskView", {
      taskData: taskData,
      onTaskFetch: onTaskFetch,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchTasks();
    }, 2000);
  }, []);

  const countTakers = async (taskId) => {
    try {
      const response = await axios.post(
        `${localhost}/coordinator/fetchCountTakers`,
        {
          taskId: taskId,
        }
      );
      return response.data.count;
    } catch (error) {
      console.error("Error counting Takers", error);
    }
  };

  const taskTakers = async (taskId) => {
    try {
      const response = await axios.post(
        `${localhost}/coordinator/fetchTaskTakers`,
        {
          taskId: taskId,
        }
      );
      return response.data.count;
    } catch (error) {
      console.error("Error counting Takers", error);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${localhost}/coordinator/fetchTasks?organizationId=${coordinator.OrganizationId}`
      );
      const taskWithCount = await Promise.all(
        (response.data.fetchTable || []).map(async (item) => {
          const takersCount = await countTakers(item.TaskId);
          const takersTask = await taskTakers(item.TaskId);
          return { ...item, takersCount, takersTask };
        })
      );
      setFetchedTasks(taskWithCount);
    } catch (error) {
      console.error("Error fetching task table", error);
      return []; // Return an empty array in case of an error
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async () => {
    if (currentTaskId) {
      try {
        const response = await axios.post(
          `${localhost}/coordinator/deleteTask`,
          {
            taskId: currentTaskId,
          }
        );
        // Reset the current task ID after deletion
        setCurrentTaskId(null);
        setModalVisible(false);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task!", error);
      }
    }
  };

  const promptDeleteTask = (taskId) => {
    setCurrentTaskId(taskId); // Set the current task ID
    setModalVisible(true); // Show the modal
  };

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Button title="+ Create" onPress={() => goToCreateTask()} />
        </View>
        <Text style={styles.textStyle}>Tasks</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={styles.divider}></View>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ConfirmModal
          isVisible={modalVisible}
          message="Are you sure you want to delete this item?"
          onConfirm={deleteTask}
          onCancel={() => setModalVisible(false)}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} /> // Loading indicator
        ) : fetchedTasks != null ? (
          fetchedTasks.map((item) => (
            <CoordTaskCard
              img={`${localhost}/img/task/${item.TaskImage}`}
              key={item.TaskId}
              participants={item.takersTask || 0}
              done={item.takersCount || 0}
              title={item.TaskName}
              description={item.TaskDescription}
              onPress={() => gotoCard(item, fetchTasks)}
              deleteTask={() => promptDeleteTask(item.TaskId)}
            />
          ))
        ) : (
          <Text>No tasks available for this coordinator.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: theme.colors.background,
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  textStyle: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scrollView: {
    width: "90%", // Ensures ScrollView takes full width
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#161616",
    marginTop: -10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim the background
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
    marginTop: 10,
  },
});

export default TaskMaster;
