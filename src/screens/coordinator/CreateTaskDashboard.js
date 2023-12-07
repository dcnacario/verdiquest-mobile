import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { TaskProvider, TaskContext } from "../../navigation/TaskContext";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import { Path, Svg } from "react-native-svg";

const CreateDashboardComponent = ({ coordinator, onTaskCreated }) => {
  const { fetchDifficulty } = useContext(TaskContext);
  const navigation = useNavigation();
  const imageSource = {
    uri: `${localhost}/img/task/${coordinator.TaskImage}`,
  };
  const localhost = ipAddress;

  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const [taskDurationHours, setTaskDurationHours] = useState("");
  const [difficultyData, setDifficultyData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskCover, setTaskCover] = useState(imageSource);

  const [taskData, setTaskData] = useState({
    organizationId: coordinator.OrganizationId,
    difficultyId: selectedDifficulty,
    taskName: "",
    taskDescription: "",
    taskDuration: "".toString(),
    taskPoints: "",
    Status: "Active",
  });

  const updateTaskData = (field, value) => {
    setTaskData({ ...taskData, [field]: value });
  };
  useEffect(() => {
    const durationInHours = parseInt(taskDurationHours) || 0;
    updateTaskData("taskDuration", durationInHours);
  }, [taskDurationHours]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your photos to upload an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setTaskCover({ uri: result.assets[0].uri });
    }
  };

  const uploadImage = async () => {
    let formData = new FormData();
    formData.append("filePath", "/images/task");
    for (const key in taskData) {
      if (taskData.hasOwnProperty(key)) {
        formData.append(key, taskData[key]);
      }
    }
    formData.append("image", {
      uri: taskCover.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${localhost}/coordinator/upload/insertTask`,
        formData
      );

      const result = await response.data;
      navigation.navigate("TaskMaster", { coordinator: coordinator });
    } catch (error) {
      console.error("Error during image upload: ", error.message);
      return null;
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  const calculatePoints = (difficultyId) => {
    const difficultyPointsMap = {
      1: 150,
      2: 250,
      3: 500,
    };

    return difficultyPointsMap[difficultyId] || 0; // Default to 0 if difficultyId is not found
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDifficulty();
      setDifficultyData(data);
    };
    loadData();
  }, [fetchDifficulty]); // Dependency array

  useEffect(() => {
    updateTaskData("difficultyId", selectedDifficulty);

    // Calculate and set task points based on selected difficulty
    const points = calculatePoints(selectedDifficulty);
    updateTaskData("taskPoints", points.toString());
  }, [selectedDifficulty]);

  // Handle submit-----------------------------------------

  // const handleSubmit = async () => {
  //   if (isSubmitting) return; // Prevents multiple submissions

  //   setIsSubmitting(true); // Disable the button

  //   try {
  //     uploadImage();
  //     // Handle successful submission
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsSubmitting(false); // Re-enable the button
  //   }
  // };
  //----------------------------------------------------------
  return (
    <View style={styles.background}>
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
      <View style={styles.eventDetailsContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
          {taskCover ? (
            <Image source={taskCover} style={styles.img} />
          ) : (
            <Text style={styles.imagePlaceholderText}>Select Image</Text>
          )}
        </TouchableOpacity>

        {/* Task Name */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Task Name</Text>
          <TextInput
            style={styles.inputStyle}
            value={taskData.taskName}
            onChangeText={(text) => updateTaskData("taskName", text)}
            placeholder="Enter task name"
          />
        </View>

        {/* Task Description */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Task Description</Text>
          <TextInput
            style={styles.inputStyle}
            value={taskData.taskDescription}
            onChangeText={(text) => updateTaskData("taskDescription", text)}
            placeholder="Enter task description"
          />
        </View>

        {/* Task Duration and Task Points */}
        <View style={styles.row}>
          {/* Task Duration */}
          <View style={styles.column}>
            <Text style={styles.modifiedTextInput}>Task Duration</Text>
            <TextInput
              style={styles.modifiedInputStyle}
              value={taskData.taskDuration.toString()}
              onChangeText={(text) => updateTaskData("taskDuration", text)}
              placeholder="in Minutes"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDifficulty}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedDifficulty(itemValue)
            }
            style={styles.pickerStyle}
            mode="dropdown"
            dropdownIconColor={"#A7A6A6"}
            dropdownIconRippleColor={theme.colors.background}
          >
            {difficultyData.map((item) => (
              <Picker.Item
                key={item.DifficultyId}
                label={item.Level}
                value={item.DifficultyId}
              />
            ))}
          </Picker>
        </View>

        <Button
          title={isSubmitting ? "Creating..." : "Create"}
          onPress={uploadImage}
          disabled={isSubmitting}
        />
      </View>
      <View style={styles.row1}>
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

const CreateTaskDashboard = ({ route }) => {
  const { coordinator, onTaskCreated } = route.params;
  return (
    <TaskProvider>
      <CreateDashboardComponent
        coordinator={coordinator}
        onTaskCreated={onTaskCreated}
      />
    </TaskProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  eventDetailsContainer: {
    backgroundColor: "rgba(123, 144, 75, 0.25);",
    padding: 30,
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 15,
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#44483E",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e1e1",
    marginTop: 15,
    marginBottom: 15,
  },
  imagePlaceholderText: {
    textAlign: "center",
    color: "#999",
  },

  inputStyle: {
    borderColor: "#44483E",
    borderWidth: 1,
    borderRadius: 12,
    width: 280,
    height: 45,
    marginTop: -15,
    margin: 10,
    padding: 10,
  },
  modifiedDescriptioninputStyle: {
    borderColor: "#44483E",
    borderWidth: 1,
    borderRadius: 12,
    width: 280,
    height: 100,
    marginTop: -15,
    margin: 5,
    padding: 10,
  },
  modifiedInputStyle: {
    borderColor: "#44483E",
    borderWidth: 1,
    borderRadius: 12,
    width: 140,
    height: 45,
    marginTop: -15,
    margin: 5,
    padding: 10,
  },
  textInput: {
    marginLeft: 20,
    backgroundColor: theme.colors.background,
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#44483E",
    zIndex: 1,
    padding: 5,
  },

  modifiedTextInput: {
    marginLeft: 10,
    backgroundColor: theme.colors.background,
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#44483E",
    zIndex: 1,
    padding: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: {
    flex: 1,
    alignItems: "center",
    padding: 5,
  },
  pickerContainer: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
  },
  pickerStyle: {
    height: 20,
    width: 150,
  },
  svgCurve: {
    position: "absolute",
    top: -2,
    left: -316,
    zIndex: 0,
  },
  row1: {
    flexDirection: "row",
    height: 0,
    justifyContent: "center",
    alignItems: "center",
    left: -30,
    position: "absolute",
    bottom: -25,
    zIndex: 0,
  },
});

export default CreateTaskDashboard;