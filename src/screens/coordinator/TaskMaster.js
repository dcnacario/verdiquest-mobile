import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import CoordTaskCard from "../../components/CoordTaskCard";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ipAddress from "../../database/ipAddress";

const TaskMaster = ({ route }) => {
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const localhost = ipAddress;

  const navigation = useNavigation();
  const { coordinator } = route.params;
  console.log(coordinator);
  //navigate to creation of task
  const goToCreateTask = () => {
    navigation.navigate("CreateTaskDashboard", {
      coordinator: coordinator,
      onTaskCreated: fetchTasks,
    });
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${localhost}/coordinator/fetchTasks?organizationId=${coordinator.OrganizationId}`
      );
      setFetchedTasks(response.data.fetchTable);
    } catch (error) {
      console.error("Error fetching tasks table", error);
      return []; // Return an empty array in case of an error
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.post(`${localhost}/coordinator/deleteTask`, {
        taskId: taskId,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task!", error);
      return [];
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [coordinator.OrganizationId]);

  //navigation for View
  const gotoCard = (taskData) => {
    navigation.navigate("TaskView", { taskData: taskData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Button title="+ Create" onPress={() => goToCreateTask()} />
        </View>
        <Text style={styles.textStyle}>Tasks</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <ScrollView style={styles.scrollView}>
        {fetchedTasks != null ? (
          fetchedTasks.map((item) => (
            <CoordTaskCard
              key={item.TaskId}
              participants={0}
              done={2}
              title={item.TaskName}
              description={item.TaskDescription}
              onPress={() => gotoCard(item)}
              deleteTask={() => deleteTask(item.TaskId)}
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
});

export default TaskMaster;
