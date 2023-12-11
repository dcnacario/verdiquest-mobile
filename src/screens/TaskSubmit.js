import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
import ipAddress from "../database/ipAddress";
import defaultImage from "../../assets/img/default-image.png";
import Details from "../components/Details";
import SubmitTaskProof from "../components/SubmitTaskProof";

const TaskSubmit = ({ route }) => {
  const { taskId, userId } = route.params; // Fetching taskId and userId from parameters
  //const navigation = useNavigation();
  const [taskDetails, setTaskDetails] = useState({});
  const [userDailyTaskDetails, setUserDailyTaskDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadng, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const localhost = ipAddress;
  const screenHeight = Dimensions.get("window").height;
  const paddingBottom = screenHeight * 0.15;

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(
        `${localhost}/user/fetchTaskDetails/${taskId}`
      );
      setTaskDetails(response.data.taskDetails || {});
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDailyTask = async () => {
    try {
      const response = await axios.post(`${localhost}/user/getUserDailyTask`, {
        userId: userId,
        taskId: taskId,
      });
      setUserDailyTaskDetails(response.data.result);
    } catch (error) {
      console.error("Error fetching user daily task: ", error);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
    fetchUserDailyTask();
  }, [taskId]);

  const handleSubmit = async (selectedImages) => {
    // Check if there are selected images
    if (!selectedImages || selectedImages.length === 0) {
      Alert.alert("No images selected for upload.");
      return;
    }

    console.log(userDailyTaskDetails);
    console.log(selectedImages);

    setIsUploading(true); 

    try {
      let formData = new FormData();
      formData.append("userDailyTaskId", userDailyTaskDetails.UserDailyTaskId);
      formData.append("filePath", "/images/proof");

      selectedImages.forEach((image, index) => {
        const imageFile = {
          uri: image,
          type: "image/jpeg", 
          name: `upload${index}.jpg`, 
        };
        formData.append("images", imageFile); 
      });

      const response = await axios.post(
        `${localhost}/coordinator/upload/postTaskProofs`,
        formData
      );

      console.log("Response:", response.data);
      Alert.alert("Submit Task", "Task submitted successfully!");
    } catch (error) {
      console.error("Error during submission: ", error.message);
      Alert.alert("Error", "Failed to submit task proof.");
    } finally {
      setIsUploading(false); 
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            taskDetails.TaskImage
              ? { uri: `${localhost}/img/task/${taskDetails.TaskImage}` }
              : defaultImage
          }
          style={styles.imageStyle}
        />
      </View>
      <Text style={styles.title}>{taskDetails.TaskName}</Text>
      <View style={styles.detailsContainer}>
        <Details
          timeCompleted={taskDetails.TaskDuration || "N/A"}
          taskDescription={
            taskDetails.TaskDescription || "No description available."
          }
          rewardPoints={taskDetails.TaskPoints || 0}
        />
      </View>
      <SubmitTaskProof onSubmit={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    padding: 10,
    paddingBottom: Dimensions.get("window").height * 0.1,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  imageStyle: {
    width: "80%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: -20,
  },
});

export default TaskSubmit;
