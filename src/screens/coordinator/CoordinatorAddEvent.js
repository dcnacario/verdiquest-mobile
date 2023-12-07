import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Image, Text, } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import ipAddress from "../../database/ipAddress";
import { Path, Svg } from "react-native-svg";

const CoordinatorAddEvent = ({ route }) => {
  const navigation = useNavigation();
  const { coordinator, onFetchEvent } = route.params;
  const localhost = ipAddress;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageSource = {
    uri: `${localhost}/img/task/${coordinator.EventImage}`,
  };
  const [taskCover, setTaskCover] = useState(imageSource);
  const minimumDate = new Date();
  const [eventData, setEventData] = useState({
    organizationId: coordinator.OrganizationId,
    eventName: "",
    eventDescription: "",
    eventVenue: "",
    eventDate: selectedDate,
    eventPoints: "",
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
      setTaskCover({ uri: result.assets[0].uri });
    }
  };

  //DateTimePicker
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate); // Update the selected date
      const combinedDateTime = combineDateTime(selectedDate, selectedTime);
      updateEventData("eventDate", combinedDateTime);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime); // Update the selected time
      const combinedDateTime = combineDateTime(selectedDate, selectedTime);
      updateEventData("eventDate", combinedDateTime);
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

  //API CALL FOR BACKEND
  const uploadImage = async () => {
    const combinedDateTime = combineDateTime();
    const updatedEventData = {
      ...eventData,
      eventDate: combinedDateTime,
    };
    let formData = new FormData();
    formData.append("filePath", "/images/event");
    for (const key in updatedEventData) {
      if (updatedEventData.hasOwnProperty(key)) {
        formData.append(key, updatedEventData[key]);
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
        `${localhost}/coordinator/upload/insertEvent`,
        formData
      );

      const result = await response.data;
      onFetchEvent();
      navigation.navigate("EventMaster", { coordinator: coordinator });
    } catch (error) {
      console.error("Error during image upload: ", error.message);
      return null;
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
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
      <View style={styles.eventDetailsContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
          {taskCover ? (
            <Image source={taskCover} style={styles.img} />
          ) : (
            <Text style={styles.imagePlaceholderText}>Select Image</Text>
          )}
        </TouchableOpacity>
        {/* Event Name */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Event Name</Text>
          <TextInput
            style={styles.inputStyle}
            value={eventData.eventName}
            onChangeText={(text) => updateEventData("eventName", text)}
            placeholder="Enter event's name"
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
          />
        </View>
        <View style={styles.row}>
          {/* Event Date */}
          {/* Date Picker */}
          <View style={styles.column}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
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
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text>
                Event Start Time: {selectedTime.toLocaleTimeString("en-GB")}
              </Text>
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
            />
          </View>
        </View>
        <Button title="Create" onPress={uploadImage} />
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
    zIndex: -1,
  },
});

export default CoordinatorAddEvent;
