import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  StatusBar,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import { TaskProvider, TaskContext } from "../../navigation/TaskContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import { Path, Svg } from "react-native-svg";

const CreateDashboardComponent = ({ coordinator, onTaskCreated }) => {
  const localhost = ipAddress;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  console.log(coordinator);

  const [taskLimit, setTaskLimit] = useState({
    easyLimit: coordinator.EasyLimit.toString(),
    moderateLimit: coordinator.ModerateLimit.toString(),
    hardLimit: coordinator.HardLimit.toString(),
    challengingLimit: coordinator.ChallengingLimit.toString(),
    expertLimit: coordinator.ExpertLimit.toString(),
  });

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
        <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>
          Advance Settings - Task Limits
        </Text>
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Easy</Text>
          <TextInput
            style={styles.inputStyle}
            editable={isEditing}
            value={taskLimit.easyLimit}
          />
        </View>
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Moderate</Text>
          <TextInput
            style={styles.inputStyle}
            editable={isEditing}
            value={taskLimit.moderateLimit}
          />
        </View>
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Hard</Text>
          <TextInput
            style={styles.inputStyle}
            editable={isEditing}
            value={taskLimit.hardLimit}
          />
        </View>
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Challenging</Text>
          <TextInput
            style={styles.inputStyle}
            editable={isEditing}
            value={taskLimit.challengingLimit}
          />
        </View>
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Expert</Text>
          <TextInput
            style={styles.inputStyle}
            editable={isEditing}
            value={taskLimit.expertLimit}
          />
        </View>
        <Button
          title={isSubmitting ? "Updating..." : "Update"}
          disabled={isSubmitting}
          icon={"update"}
        />
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
    </View>
  );
};

const AdvanceSettingTask = ({ route }) => {
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
    paddingLeft: 20,
    fontWeight: "600",
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
    fontWeight: "500",
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
    justifyContent: "center",
    alignItems: "center",
    left: -30,
    position: "absolute",
    zIndex: -2,
    bottom: -320,
    height: -320,
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
});

export default AdvanceSettingTask;
