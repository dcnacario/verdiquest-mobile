import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { theme } from "../../../assets/style";
import CoordEventCard from "../../components/CoordReportCard";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ipAddress from "../../database/ipAddress";

const ReportMission = ({ route }) => {
  const navigation = useNavigation();
  const { coordinator } = route.params;

  const localhost = ipAddress;

  const [fetchedTasks, setFetchedTasks] = useState([]);

  const goToEvent = (coordinator) => {
    navigation.navigate("ReportEvent", {
      coordinator: coordinator,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textStyle}>REPORT</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonStyle, styles.buttonActive]}
          onPress={() => goToEvent(coordinator)}
        >
          <Text style={styles.buttonTextActive}>Events</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {fetchedTasks != null && fetchedTasks.length > 0 ? (
          fetchedTasks.map((item) => (
            <CoordEventCard
              key={item.EventId}
              participants={item.participantCount || 0}
              feedback={0}
              title={item.EventName}
              description={item.EventDescription}
              status={item.EventStatus}
              onPress={() => goToView(item)}
            />
          ))
        ) : (
          <Text>No event/s available for this organization.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: theme.colors.background,
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  textStyle: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollView: {
    width: "90%", // Ensures ScrollView takes full width
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20, // Space from the bottom
  },
  buttonStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#4CAF50", // Change as per your inactive button color
  },
  buttonActive: {
    backgroundColor: "#3F4A34", // Change as per your active button color
  },
  buttonText: {
    color: "#000000", // Change as per your inactive text color
    textAlign: "center",
  },
  buttonTextActive: {
    color: "#FFFFFF", // Change as per your active text color
    textAlign: "center",
  },
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: theme.colors.background,
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  textStyle: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scrollView: {
    width: "90%", // Ensures ScrollView takes full width
  },
});

export default ReportMission;
