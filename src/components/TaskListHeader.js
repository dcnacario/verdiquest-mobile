import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
  StatusBar,
  Modal,
} from "react-native";
import { theme } from "../../assets/style";
import CardTask from "./CardTask";
import axios from "axios";
import ipAddress from "../database/ipAddress";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const TaskListHeader = ({ route }) => {
  const navigation = useNavigation();
  const user = route || {};
  const [tasks, setTasks] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [easyTaskCount, setEasyTaskCount] = useState(0);
  const localhost = ipAddress;
  const [infoModalVisible, setInfoModalVisible] = useState(false);

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
      console.log("Error fetching tasks:", error);
    }
  };

  const InfoModal = ({ isVisible, onClose }) => {
    return (
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Difficulty Guide</Text>
            <ScrollView>
              <Text style={styles.modalSectionTitle}>EASY:</Text>
              <Text style={styles.modalTextInfo}>
                {"\n"}Task suitable for beginners to those who are new to
                sustainability efforts It requires minimal time, resources, or
                expertise.{"\n"}
              </Text>

              <Text style={styles.modalSectionTitle}>MODERATE:</Text>
              <Text style={styles.modalTextInfo}>
                {"\n"}Tasks suitable for individuals with some experience in
                sustainability Involves a moderate level of time, resources, or
                expertise.{"\n"}
              </Text>

              <Text style={styles.modalSectionTitle}>HARD:</Text>
              <Text style={styles.modalTextInfo}>
                {"\n"}Tasks suitable for those with a commitment to
                sustainability Involves a significant investment of time,
                resources, or expertise.{"\n"}
              </Text>

              <Text style={styles.modalSectionTitle}>CHALLENGING:</Text>
              <Text style={styles.modalTextInfo}>
                {"\n"}Tasks suitable for sustainability enthusiasts Involves
                creativity, Innovation, or active promotion .{"\n"}
              </Text>

              <Text style={styles.modalSectionTitle}>EXPERT:</Text>
              <Text style={styles.modalTextInfo}>
                {"\n"}Tasks suitable for sustainability leaders or those seeking
                significant impact Involves coordination, leadership, or
                participation in large-scale events. {"\n"}
              </Text>

              {/* <Text style={styles.modalSectionTitle}>VERDIPOINTS:</Text>
              <Text style={styles.modalTextInfo}>
                <Text style={styles.modalInfoSubTitle}>1VP = 1Peso</Text>
                {"\n"}
                {"\n"}Easy = 0.20 - 0.49 VP
                {"\n"}Moderate = 0.50 - 0.99 VP
                {"\n"}Hard = 1 - 4 VP
                {"\n"}Challenging = 5 - 9 VP
                {"\n"}Expert = 10 - 20 VP
                {"\n"}
                {"\n"}75 VP = Bracelets, Stickers, Ballpens
                {"\n"}50-300 VP = Vouchers
                {"\n"}150 VP = Mugs, Umbrella
                {"\n"}300 VP = T-shirt
                {"\n"}700 VP = VIP Event Ticket
                {"\n"}
              </Text> */}

              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Ok</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const difficulties = [
    { id: "0", title: "All" },
    { id: "1", title: "Easy" },
    { id: "2", title: "Moderate" },
    { id: "3", title: "Hard" },
    { id: "4", title: "Challenging" },
    { id: "5", title: "Expert" },
  ];

  const getDifficulty = (difficultyId) => {
    const difficultyString = String(difficultyId);
    switch (difficultyString) {
      case "0":
        return "All";
      case "1":
        return "Easy";
      case "2":
        return "Moderate";
      case "3":
        return "Hard";
      case "4":
        return "Challenging";
      case "5":
        return "Expert";
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasksByDifficulty(selectedDifficulty);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          paddingBottom: 20,
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 32, color: "#3D691B" }}>Tasks</Text>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
          <MaterialIcons
            name="info-outline"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.divider}></View>
      <Text style={{ fontSize: 18, color: "#3D691B", marginBottom: 10 }}>
        Filter
      </Text>

      <FlatList
        data={difficulties}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        contentContainerStyle={styles.flatListContainer}
        showsHorizontalScrollIndicator={false}
        extraData={selectedDifficulty}
      />
      <InfoModal
        isVisible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              organizationId={task.OrganizationId}
              userId={user.UserId}
              difficultyId={task.DifficultyId}
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
    paddingTop: StatusBar.currentHeight + 60,
    alignItems: "center",
  },

  textStyle: {
    fontSize: 36,
    color: theme.colors.primary,
    textAlign: "center",
  },
  flatListContainer: {
    gap: 5,
    justifyContent: "center",
    alignContent: "center",
    paddingHorizontal: 16,
  },
  difficultyButton: {
    width: 100,
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
  divider: {
    borderWidth: 0.5,
    borderBlockColor: "black",
    width: "40%",
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%", // Set the width to 100%
    height: "100%", // Set the height to 100%
  },
  modalContent: {
    width: 300, // Set your desired width
    height: 500, // Set your desired height
    backgroundColor: "#839655",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderColor: "#454545",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextInfo: {
    textAlign: "justify",
    color: "#FFFFFF",
  },
  modalSectionTitle: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#FFFFFF",
  },
  modalInfoSubTitle: {
    fontWeight: "500",
    color: "#FFFFFF",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: theme.colors.primary,
    marginVertical: 10,
    width: "40%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TaskListHeader;
