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
import { Path, Svg } from "react-native-svg";

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

    setIsUploading(true); // Start the loading state

    try {
      let formData = new FormData();
      formData.append("userDailyTaskId", userDailyTaskDetails.UserDailyTaskId);
      formData.append("filePath", "/images/proof");

      // Append each image to the formData under the expected field name
      selectedImages.forEach((image, index) => {
        const imageFile = {
          uri: image,
          type: "image/jpeg", // Or dynamically determine the mime type
          name: `upload${index}.jpg`, // Generating a unique name for each file
        };
        formData.append("images", imageFile); // Assuming 'images' is the field name expected by the server
      });

      const response = await axios.post(
        `${localhost}/coordinator/upload/postTaskProofs`,
        formData
      );

      console.log("Response:", response.data);
      Alert.alert("Submit Task", "Task submitted successfully!");
      // Handle the response as needed
    } catch (error) {
      console.error("Error during submission: ", error.message);
      Alert.alert("Error", "Failed to submit task proof.");
    } finally {
      setIsUploading(false); // End the loading state
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

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
        padding: 10,
    },
    contentContainer: {
        padding: 10,
        paddingBottom: Dimensions.get('window').height * 0.1,
    },
    imageContainer: {
        alignItems: 'center', 
        marginVertical: 5,    
    },
    imageStyle: {
        width: '80%',         
        height: 200,          
        resizeMode: 'cover',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',       
    },
    detailsContainer: {
        padding: 10,                
        borderRadius: 10,   
        marginVertical: -20,                  
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
        bottom: -30,
        zIndex: 0,
      },
      
});

export default TaskSubmit;
