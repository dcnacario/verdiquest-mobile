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
import { Path, Svg } from "react-native-svg";

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

export default TaskMaster;
