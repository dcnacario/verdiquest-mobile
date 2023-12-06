import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import ipAddress from "../../database/ipAddress";
import { Picker } from "@react-native-picker/picker";

const TaskView = ({ route }) => {
  const navigation = useNavigation();
  const { taskData, onTaskFetch } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const initialValue = Number(taskData.DifficultyId);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialValue);
  const [difficultyData, setDifficultyData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [initial, setInitial] = useState(true);
  const localhost = ipAddress;
  const imageSource = { uri: `${localhost}/img/task/${taskData.TaskImage}` };
  const [taskCover, setTaskCover] = useState(imageSource);

  const [editTaskData, setEditTaskData] = useState({
    taskName: taskData.TaskName,
    taskDescription: taskData.TaskDescription,
    difficultyId: selectedDifficulty,
    taskPoints: taskData.TaskPoints.toString(),
    taskDuration: taskData.TaskDuration.toString(),
    taskId: taskData.TaskId,
  });

  //API BACKEND CALL
  const fetchDifficulty = useCallback(async () => {
    try {
      const response = await axios.get(
        `${localhost}/coordinator/fetchDifficulty`
      );
      if (Array.isArray(response.data.fetchTable)) {
        setDifficultyData(response.data.fetchTable);
      } else {
        console.log("Unexpected format of difficulty data", response.data);
      }
    } catch (error) {
      console.error("Error fetching difficulty table", error);
    }
  }, [localhost]);

  ///

  const gotoView = () => {
    navigation.navigate("ViewSubmission", { taskData: editTaskData });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateImage = async () => {
    if (!taskCover.uri) {
      console.error("Image URI is not valid for upload.");
      return null;
    }

    setIsUploading(true); // Start loading
    setIsSubmitting(true);

    let formData = new FormData();
    formData.append("filePath", "/images/task");
    formData.append("taskId", editTaskData.taskId);
    formData.append("image", {
      uri: taskCover.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    try {
      const response = await axios.post(
        `${localhost}/coordinator/upload/updateTaskImage`,
        formData
      );

      if (response.data.success && response.data.newImageUri) {
        setTaskCover({
          uri: `${localhost}/img/task/${response.data.newImageUri}`,
        });
      }

      onTaskFetch();
    } catch (error) {
      console.error("Error during image upload: ", error.message);
    } finally {
      await delay(3000);
      setIsUploading(false); // End loading
      setIsSubmitting(false);
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

  const handleEditSave = async () => {
    if (isEditing) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await updateImage();
        const response = await axios.post(
          `${localhost}/coordinator/updateTask`,
          editTaskData
        );
        console.log("Update response:", response.data);
        onTaskFetch();
      } catch (error) {
        console.error("Error updating task:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
    setIsEditing(!isEditing);
    setInitial(!initial);
  };

  const updateField = (field, value) => {
    setEditTaskData({ ...editTaskData, [field]: value });
  };

  // UPDATING IMAGE --------------------------------------------------------
  const handleEditPress = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Request Change Denied!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (pickerResult.canceled) {
      return;
    }

    if (!pickerResult.canceled && pickerResult.assets) {
      const imageUri = pickerResult.assets[0].uri;
      // Validate the URI
      if (imageUri) {
        setTaskCover({ uri: imageUri });
      } else {
        // Handle the case where the URI is not valid
        console.error("Selected image URI is invalid.");
      }
    }
  };
  //-------------------------------------------------------------------------------

  useEffect(() => {
    fetchDifficulty();
  }, [fetchDifficulty]);

  useEffect(() => {
    updateField("difficultyId", selectedDifficulty);

    // Calculate and set task points based on selected difficulty
    const points = calculatePoints(selectedDifficulty);
    updateField("taskPoints", points.toString());
  }, [selectedDifficulty]);

  return (
    <View style={styles.background}>
      {isUploading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
      <View style={styles.eventDetailsContainer}>
        <TouchableOpacity
          style={styles.imagePlaceholder}
          disabled={initial}
          onPress={handleEditPress}
        >
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
            value={editTaskData.taskName}
            onChangeText={(text) => updateField("taskName", text)}
            editable={isEditing}
          />
        </View>
        {/* Task Description */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Task Description</Text>
          <TextInput
            style={styles.modifiedDescriptioninputStyle}
            value={editTaskData.taskDescription}
            editable={isEditing}
            onChangeText={(text) => updateField("taskDescription", text)}
          />
        </View>
        <View style={styles.row}>
          {/* Task Duration */}
          <View style={styles.column}>
            <Text style={styles.modifiedTextInput}>Task Duration</Text>
            <TextInput
              style={styles.modifiedInputStyle}
              value={editTaskData.taskDuration}
              onChangeText={(text) => updateField("taskDuration", text)}
              editable={isEditing}
              keyboardType="numeric"
            />
          </View>
          {/* Task Points */}
          <View style={styles.column}>
            <Text style={styles.modifiedTextInput}>Points Reward</Text>
            <TextInput
              style={styles.modifiedInputStyle}
              value={editTaskData.taskPoints}
              editable={isEditing}
              onChangeText={(text) => updateField("taskPoints", text)}
            />
          </View>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDifficulty}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedDifficulty(itemValue)
            }
            enabled={isEditing}
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
        <View style={styles.row}>
          <TouchableOpacity style={styles.column} onPress={() => gotoView()}>
            <MaterialIcon name="check" size={18} />
            <Text style={styles.View}>View Submission</Text>
          </TouchableOpacity>
          <Button
            title={isEditing ? "Save" : "Edit"}
            onPress={handleEditSave}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </View>
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
    width: "100%",
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
});

export default TaskView;
