import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import CoordTaskCard from "../../components/CoordTaskCard";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const TaskMaster = ({ route }) => {
  const navigation = useNavigation();
  const { coordinator } = route.params;
  console.log(coordinator);
  //navigate to creation of task
  const goToCreateTask = () => {
    navigation.navigate("CreateTaskDashboard", { coordinator: coordinator });
  };

  // for fetching
  const [fetchedTasks, setFetchedTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.14:3000/coordinator/fetchTasks?coordinatorId=${coordinator.CoordinatorId}`
        );
        setFetchedTasks(response.data.fetchTable);
      } catch (error) {
        console.error("Error fetching tasks table", error);
        return []; // Return an empty array in case of an error
      }
    };
    fetchTasks();
  }, [coordinator.CoordinatorId]);

  //navigation for View
  const gotoCard = (taskData) => {
    navigation.navigate("UpdateTaskDashboard", { taskData: taskData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Button title="+ Create" onPress={goToCreateTask} />
        </View>
        <Text style={styles.textStyle}>Tasks</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <ScrollView style={styles.scrollView}>
        {fetchedTasks.map((item) => (
          <CoordTaskCard
            key={item.TaskId}
            participants={0}
            done={2}
            title={item.TaskName}
            description={item.TaskDescription}
            onPress={() => gotoCard(item)}
          />
        ))}
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
