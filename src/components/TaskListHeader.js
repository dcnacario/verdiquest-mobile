import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { theme } from "../../assets/style";
import CardTask from "./CardTask";
import axios from "axios";
import ipAddress from "../database/ipAddress";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";

const TaskListHeader = ({ route }) => {
  const navigation = useNavigation();
  const user = route?.params?.user || {};
  const [tasks, setTasks] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const localhost = ipAddress;

  useEffect(() => {
    fetchTasksByDifficulty("All");
  }, []);

  const fetchTasksByDifficulty = async (difficultyTitle) => {
    try {
      setSelectedDifficulty(difficultyTitle);
      let endpoint =
        difficultyTitle === "All"
          ? `${localhost}/user/fetchAllDifficulty`
          : `${localhost}/user/fetch${difficultyTitle}Task`;

      const response = await axios.get(endpoint);
      if (response.data.success) {
        setTasks(response.data.fetchedTable);
      } else {
        console.log("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const difficulties = [
    { id: "0", title: "All" },
    { id: "1", title: "Easy" },
    { id: "2", title: "Normal" },
    { id: "3", title: "Hard" },
  ];

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.difficultyButton,
        selectedDifficulty === item.title ? styles.selectedButton : null,
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
        keyExtractor={(item) => item.id}
        horizontal={true}
        contentContainerStyle={styles.flatListContainer}
        showsHorizontalScrollIndicator={false}
        extraData={selectedDifficulty}
      />
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {/* Your task list */}
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <CardTask
              key={index}
              img={`${localhost}/img/task/${task.TaskImage}`}
              title={task.TaskName}
              difficulty={getDifficulty(task.DifficultyId)}
              description={task.TaskDescription}
              onPress={() =>
                navigation.navigate("TaskDetails", { taskId: task.TaskId })
              }
            />
          ))
        ) : (
          <Text style={styles.noTasksText}>
            No available tasks, come back tomorrow.
          </Text>
        )}
      </ScrollView>
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
    textAlign: "center",
  },
  flatListContainer: {
    marginTop: 100,
    gap: 5,
    justifyContent: "center",
    alignContent: "center",
    paddingHorizontal: 16,
  },
  difficultyButton: {
    width: 70,
    padding: 10,
    marginHorizontal: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
  },
  difficultyText: {
    color: "white",
    textAlign: "center",
  },
  noTasksText: {
    fontSize: 16,
    color: "#36454F",
    textAlign: "center",
    marginTop: 10,
  },
});

export default TaskListHeader;
