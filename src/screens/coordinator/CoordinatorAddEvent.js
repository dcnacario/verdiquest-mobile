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
import * as ImagePicker from "expo-image-picker";

const CoordinatorAddEvent = () => {
  const [imageUri, setImageUri] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [eventPoints, setEventPoints] = useState("");
  const [eventCapacity, setEventCapacity] = useState("");

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
        {/* Event Name */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Event Name</Text>
          <TextInput
            style={styles.inputStyle}
            value={eventName}
            onChangeText={setEventName}
            placeholder="Enter event's name"
          />
        </View>
        {/* Event Type */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Event Type</Text>
          <TextInput
            style={styles.inputStyle}
            value={eventType}
            onChangeText={setEventType}
            placeholder="Enter event's type"
          />
        </View>
        {/* Event Description */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Event Description</Text>
          <TextInput
            style={styles.inputStyle}
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholder="Enter event's description"
          />
        </View>
        {/* Event Venue */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Event Venue</Text>
          <TextInput
            style={styles.inputStyle}
            value={eventVenue}
            onChangeText={setEventVenue}
            placeholder="Enter event's description"
          />
        </View>
        <View style={styles.row}>
          {/* Event Duration */}
          <View style={styles.column}>
            <Text style={styles.modifiedTextInput}>Event Duration</Text>
            <TextInput
              style={styles.modifiedInputStyle}
              value={eventDuration}
              onChangeText={setEventDuration}
              placeholder="Event Duration"
            />
          </View>
          {/* Event Points */}
          <View style={styles.column}>
            <Text style={styles.modifiedTextInput}>Points Reward</Text>
            <TextInput
              style={styles.modifiedInputStyle}
              value={eventPoints}
              onChangeText={setEventPoints}
              placeholder="Points Reward"
            />
          </View>
        </View>
        {/* Event Participant Capacity */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.modifiedParticipantTextInput}>
            Participants Capacity
          </Text>
          <TextInput
            style={styles.modifiedParticipantInputStyle}
            value={eventCapacity}
            onChangeText={setEventCapacity}
            placeholder="Enter participant capacity"
          />
        </View>
        <Button title="Create" />
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
});

export default CoordinatorAddEvent;
