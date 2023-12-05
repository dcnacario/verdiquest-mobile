import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { theme } from "../../assets/style";

const IntroCard = ({ editable, onPress, description }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.introLabel}>Intro</Text>
        <TouchableOpacity style={styles.editButton} onPress={onPress}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <TextInput placeholder="Create your profile intro" editable={editable}>
        {description}
      </TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 350,
    backgroundColor: "#DAE7C9",
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  introLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  editButton: {
    // Add styles for EDIT button
  },
  editButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  divider: {
    width: "100%",
    height: 0.75,
    backgroundColor: "#000000",
    marginVertical: 5,
  },
  descriptionLabel: {
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: "center",
  },
});

export default IntroCard;
