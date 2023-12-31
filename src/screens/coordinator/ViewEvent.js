import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import ipAddress from "../../database/ipAddress";
import { Path, Svg } from "react-native-svg";
const ViewEvent = ({ route }) => {
  const { coordinator, onFetchEvent, item } = route.params;
  const navigation = useNavigation();
  const dateOfEvent = new Date(item.EventDate);
  const [isUploading, setIsUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dateOfEvent);
  const [selectedTime, setSelectedTime] = useState(dateOfEvent);
  const localhost = ipAddress;
  const imageSource = { uri: `${localhost}/img/event/${item.EventImage}` };
  const [taskCover, setTaskCover] = useState(imageSource);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmit, setIsSubmitting] = useState(false);

  const minimumDate = new Date();
  const [eventData, setEventData] = useState({
    eventName: item.EventName,
    eventDescription: item.EventDescription,
    eventVenue: item.EventVenue,
    eventPoints: item.EventPoints.toString(),
    eventDate: dateOfEvent,
    eventId: item.EventId,
  });

  const updateEventData = (field, value) => {
    setEventData({ ...eventData, [field]: value });
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
      const imageUri = result.assets[0].uri;
      // Validate the URI
      if (imageUri) {
        setTaskCover({ uri: imageUri });
      } else {
        // Handle the case where the URI is not valid
        console.error("Selected image URI is invalid.");
      }
    }
  };

  //DateTimePicker
  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const combineDateTime = () => {
    const date = selectedDate.toISOString().split("T")[0];
    const time =
      selectedTime.getHours().toString().padStart(2, "0") +
      ":" +
      selectedTime.getMinutes().toString().padStart(2, "0") +
      ":" +
      selectedTime.getSeconds().toString().padStart(2, "0");

    return `${date}T${time}`;
  };

  //------------------

  const goToViewParticipants = () => {
    navigation.navigate("ViewParticipants", {
      eventData: eventData,
    });
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
    formData.append("filePath", "/images/event");
    formData.append("eventId", eventData.eventId);
    formData.append("image", {
      uri: taskCover.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    try {
      const response = await axios.post(
        `${localhost}/coordinator/upload/updateEventImage`,
        formData
      );

      if (response.data.success && response.data.newImageUri) {
        setTaskCover({
          uri: `${localhost}/img/event/${response.data.newImageUri}`,
        });
      }

      onFetchEvent();
    } catch (error) {
      console.error("Error during image upload: ", error.message);
    } finally {
      await delay(3000);
      setIsUploading(false); // End loading
      setIsSubmitting(false);
    }
  };

  //API CALL FOR BACKEND

  const handleEditSave = async () => {
    if (isEditing) {
      const combinedDateTime = combineDateTime();
      const updatedEventData = {
        ...eventData,
        eventDate: combinedDateTime,
      };
      try {
        await updateImage();
        const response = await axios.post(
          `${localhost}/coordinator/updateEvent`,
          updatedEventData
        );
        console.log("Update response:", response.data);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  //-------------------------------------------------------

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
      {isUploading && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}

      <View style={styles.eventDetailsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.imagePlaceholder}
            disabled={isEditing === false ? true : false}
          >
            {taskCover ? (
              <Image source={taskCover} style={styles.img} />
            ) : (
              <Text style={styles.imagePlaceholderText}>Select Image</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* Event Name */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Event Name</Text>
          <TextInput
            style={styles.inputStyle}
            value={eventData.eventName}
            onChangeText={(text) => updateEventData("eventName", text)}
            placeholder="Enter event's name"
            editable={isEditing}
          />
        </View>
        {/* Event Description */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Event Description</Text>
          <TextInput
            style={styles.inputStyle}
            value={eventData.eventDescription}
            onChangeText={(text) => updateEventData("eventDescription", text)}
            placeholder="Enter event's description"
            editable={isEditing}
          />
        </View>
        {/* Event Venue */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Event Venue</Text>
          <TextInput
            style={styles.inputStyle}
            value={eventData.eventVenue}
            onChangeText={(text) => updateEventData("eventVenue", text)}
            placeholder="Enter event's event"
            editable={isEditing}
          />
        </View>
        <View style={styles.row}>
          {/* Event Date */}
          {/* Date Picker */}
          <View style={styles.column}>
            <TouchableOpacity
              disabled={isEditing ? false : true}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>Event Date: {selectedDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                minimumDate={minimumDate}
                onChange={handleDateChange}
              />
            )}
          </View>
          {/* Time Picker */}
          <View style={styles.column}>
            <TouchableOpacity
              disabled={isEditing ? false : true}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>Event Start Time: {selectedTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
        </View>
        <View style={styles.row}>
          {/* Event Points */}
          <View style={styles.column}>
            <Text
              style={{
                marginLeft: 80,
                backgroundColor: theme.colors.background,
                alignSelf: "flex-start",
                fontSize: 14,
                color: "#44483E",
                zIndex: 1,
                padding: 5,
              }}
            >
              Points Reward
            </Text>
            <TextInput
              style={styles.modifiedInputStyle}
              value={eventData.eventPoints}
              onChangeText={(text) => updateEventData("eventPoints", text)}
              placeholder="Points Reward"
              keyboardType="numeric"
              editable={isEditing}
            />
          </View>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => goToViewParticipants(onFetchEvent)}>
            <View
              style={{
                marginRight: 50,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="people-alt"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={{ fontWeight: "bold", color: theme.colors.primary }}>
                View Participants
              </Text>
            </View>
          </TouchableOpacity>
          <Button
            title={isEditing ? "Save" : "Edit"}
            onPress={handleEditSave}
            disabled={isSubmit}
            icon={"update"}
          />
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
  modifiedParticipantInputStyle: {
    borderColor: "#44483E",
    borderWidth: 1,
    borderRadius: 12,
    width: 180,
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

  modifiedParticipantTextInput: {
    marginLeft: 12,
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
    zIndex: 1,
  },
});

export default ViewEvent;
