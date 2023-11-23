import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const TaskView = ({ route }) => {
  const navigation = useNavigation();
  const { taskData } = route.params;
  const [isEditing, setIsEditing] = useState(false);

  const [imageUri, setImageUri] = useState(null);

  const [editTaskData, setEditTaskData] = useState({
    taskName: taskData.TaskName,
    taskType: taskData.TaskType,
    taskDescription: taskData.TaskDescription,
    taskPoints: taskData.TaskPoints.toString(),
    taskDuration: taskData.TaskDuration.toString(),
    taskId: taskData.TaskId,
  });

  const gotoView = () => {
    navigation.navigate("ViewSubmission", { taskData: editTaskData });
  };

  const handleEditSave = async () => {
    if (isEditing) {
      try {
        const response = await axios.post(
          "http://192.168.1.14:3000/coordinator/updateTask",
          editTaskData
        );
        console.log("Update response:", response.data);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  const updateField = (field, value) => {
    setEditTaskData({ ...editTaskData, [field]: value });
  };

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
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.eventDetailsContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.img} />
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
        {/* Task Type */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Task Type</Text>
          <TextInput
            style={styles.inputStyle}
            value={editTaskData.taskType}
            editable={isEditing}
            onChangeText={(text) => updateField("taskType", text)}
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
        <View style={styles.row}>
          <TouchableOpacity style={styles.column} onPress={() => gotoView()}>
            <MaterialIcon name="check" size={18} />
            <Text style={styles.View}>View Submission</Text>
          </TouchableOpacity>
          <Button
            title={isEditing ? "Save" : "Edit"}
            onPress={handleEditSave}
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
});

export default TaskView;
