import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  StatusBar,
  Modal,
  ScrollView,
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
import { MaterialIcons } from "@expo/vector-icons";

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
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const [taskData, setTaskData] = useState({
    organizationId: coordinator.OrganizationId,
    difficultyId: selectedDifficulty,
    taskName: "",
    taskDescription: "",
    taskDuration: "".toString(),
    taskPoints: "",
    Status: "Active",
  });

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
            <Text style={styles.modalTitle}>Task Difficulty Levels</Text>
            <ScrollView>
              <Text style={styles.modalSectionTitle}>Easy:</Text>
              <Text style={styles.modalTextInfo}>
                <Text style={styles.modalInfoSubTitle}>Criteria:</Text>
                {"\n"}Tasks suitable for beginners or those new to
                sustainability efforts. Require minimal time, resources, or
                expertise.{"\n"}
                <Text style={styles.modalInfoSubTitle}>Examples:</Text>
                {"\n"}Use a reusable alternative.{"\n"}
                Pick up a bag of trash/litter in local areas.{"\n"}
                <Text style={styles.modalInfoSubTitle}>Proof:</Text>
                {"\n"}
                Submit a photo of the reusable item. Submit a photo of the
                filled bag of collected litter.
              </Text>

              <Text style={styles.modalSectionTitle}>Moderate:</Text>
              <Text style={styles.modalTextInfo}>
                <Text style={styles.modalInfoSubTitle}>Criteria:</Text>
                {"\n"}Tasks suitable for individuals with some experience in
                sustainability. Involve a moderate level of time, resources, or
                expertise.{"\n"}
                <Text style={styles.modalInfoSubTitle}>Examples:</Text>
                {"\n"}Pick up a bag of trash/litter in rural areas.{"\n"}Recycle
                and sell plastic or glass bottles.{"\n"}Plant/Grow a seedling in
                your backyard.{"\n"}
                <Text style={styles.modalInfoSubTitle}>Proof:</Text>
                {"\n"}
                Submit a photo of the filled bag of rural litter.{"\n"}Submit a
                photo of the recycled items and proof of sale.{"\n"}Submit a
                photo of the planted seedling in your backyard.
              </Text>

              <Text style={styles.modalSectionTitle}>Hard:</Text>
              <Text style={styles.modalTextInfo}>
                <Text style={styles.modalInfoSubTitle}>Criteria:</Text>
                {"\n"}Tasks suitable for those with a commitment to
                sustainability. Involve a significant investment of time,
                resources, or expertise.{"\n"}
                <Text style={styles.modalInfoSubTitle}>Examples:</Text>
                {"\n"}Join a community cleanup event.{"\n"}Buy Eco-Friendly or
                Locally made products.{"\n"}Build a compost in your backyard.
                {"\n"}
                <Text style={styles.modalInfoSubTitle}>Proof:</Text>
                {"\n"}
                Submit a photo of your participation in the community cleanup.
                {"\n"}Submit a photo of the Eco-Friendly or Locally made
                products you purchased.{"\n"}Submit a photo of the composting
                setup in your backyard.
              </Text>

              <Text style={styles.modalSectionTitle}>Challenging:</Text>
              <Text style={styles.modalTextInfo}>
                <Text style={styles.modalInfoSubTitle}>Criteria:</Text>
                {"\n"}Tasks suitable for sustainability enthusiasts. Involve
                creativity, innovation, or active promotion.{"\n"}
                <Text style={styles.modalInfoSubTitle}>Examples:</Text>
                {"\n"}Create Eco-Friendly products/items from scratch.{"\n"}
                Promote/Invite others to the concept of sustainability through
                the application, flyers, etc.
                {"\n"}
                <Text style={styles.modalInfoSubTitle}>Proof:</Text>
                {"\n"}
                Submit a photo of the Eco-Friendly product you created.{"\n"}
                Provide evidence of your promotional efforts, such as photos of
                flyers or screenshots of social media posts.
              </Text>

              <Text style={styles.modalSectionTitle}>Expert:</Text>
              <Text style={styles.modalTextInfo}>
                <Text style={styles.modalInfoSubTitle}>Criteria:</Text>
                {"\n"}Tasks suitable for sustainability leaders or those seeking
                significant impact. Involve coordination, leadership, or
                participation in large-scale events.{"\n"}
                <Text style={styles.modalInfoSubTitle}>Examples:</Text>
                {"\n"}Organize a community cleanup event.{"\n"}Join a tree
                planting event.
                {"\n"}
                <Text style={styles.modalInfoSubTitle}>Proof:</Text>
                {"\n"}
                Submit a series of photos capturing different stages of the
                cleanup and participants.{"\n"}Submit photos of your
                participation in the tree planting event.
              </Text>

              <Text style={styles.modalSectionTitle}>VERDIPOINTS:</Text>
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
              </Text>

              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const updateTaskData = (field, value) => {
    if (field === "taskPoints") {
      value = parseFloat(value);
    }
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

    if (result.canceled) {
      // User canceled image selection
      Alert.alert("Image Selection Canceled", "You didn't select an image.");
      return;
    }

    if (!result.assets || result.assets.length === 0) {
      // No image selected
      Alert.alert("No Image Selected", "Please select an image to upload.");
      return;
    }

    setTaskCover({ uri: result.assets[0].uri });
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
      console.log("Error during image upload: ", error.message);
      Alert.alert("No Image Selected", "Please select an image to upload.");
      return null;
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
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
          {taskCover != null ? (
            <Image source={taskCover} style={styles.img} />
          ) : (
            <Text style={styles.imagePlaceholderText}>Select Image</Text>
          )}
        </TouchableOpacity>

        <InfoModal
          isVisible={infoModalVisible}
          onClose={() => setInfoModalVisible(false)}
        />

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

        {/* Task Instruction */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Task Instruction</Text>
          <TextInput
            style={styles.modifiedDescriptionInputStyle}
            value={taskData.taskDescription}
            onChangeText={(text) => updateTaskData("taskDescription", text)}
            placeholder="Enter task instruction"
            multiline={true}
            numberOfLines={4}
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
          <View style={styles.column}>
            <Text style={styles.modifiedTextInput}>Task Points</Text>
            <TextInput
              style={styles.modifiedInputStyle}
              value={taskData.taskPoints.toString()}
              onChangeText={(text) => updateTaskData("taskPoints", text)}
              placeholder="Enter VerdiPoints"
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between", // Center the child elements
            alignItems: "center",
            gap: 70, // Center vertically
          }}
        >
          <View style={{ flex: 1 }}></View>
          <Button
            title={isSubmitting ? "Creating..." : "Create"}
            onPress={uploadImage}
            disabled={isSubmitting}
          />
          <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
            <MaterialIcons
              name="info-outline"
              size={32}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
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
    zIndex: -2,
  },
  modifiedDescriptionInputStyle: {
    borderColor: "#44483E",
    borderWidth: 1,
    borderRadius: 12,
    width: 280,
    minHeight: 100,
    padding: 10,
    textAlignVertical: "top",
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
    paddingVertical: 5,
    color: "#FFFFFF",
  },
  modalSectionTitle: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    paddingVertical: 5,
    fontSize: 16,
    color: "#FFFFFF",
  },
  modalInfoSubTitle: {
    fontWeight: "500",
    paddingVertical: 5,
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
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CreateTaskDashboard;
