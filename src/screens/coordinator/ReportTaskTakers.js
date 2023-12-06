import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import ipAddress from "../../database/ipAddress";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path,Svg } from "react-native-svg";
const ReportTaskTakers = ({ route }) => {
  const { item } = route.params;
  console.log(item);
  const localhost = ipAddress;

  const [fetchedTasks, setFetchedTasks] = useState([]);
  //FOR NAVIGATION
  const navigation = useNavigation();
  const goToViewSubmissionUser = (item, onTaskFetch) => {
    navigation.navigate("ViewSubmissionUser", {
      data: item,
      onTaskFetch: onTaskFetch,
    });
  };
  //----------------------------------------

  const fetchTasks = async () => {
    try {
      let taskId = item.taskId || item.TaskId; // Use taskId if it exists, otherwise use TaskId
      if (!taskId) {
        console.error("No task ID available");
        return; // Exit the function if no task ID is provided
      }

      const response = await axios.post(`${localhost}/coordinator/getTasks`, {
        taskId,
      });
      setFetchedTasks(response.data.fetchTable);
    } catch (error) {
      console.error("Error fetching tasks table", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [item.UserDailyTaskId]);

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.taskName}>{item.taskName || item.TaskName}</Text>
        </View>
        {/* Content ScrollView */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
         
        <View style={{ borderWidth: 0.5, width: "80%", marginTop: -20 }}></View>
          {fetchedTasks != null && fetchedTasks.length > 0 ? (
            fetchedTasks.map((item) => (
              <View key={item.TaskId} style={styles.cardContainer}>
                <View style={styles.imagePlaceholder} />
                <View style={styles.textContainer}>
                  <Text style={styles.name}>
                    {item.FirstName} {item.LastName}
                  </Text>
                  <Text style={styles.status}>Status: {item.Status}</Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => goToViewSubmissionUser(item, fetchTasks)}
                >
                  <Text style={styles.buttonText}>View Submission</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No task takers yet!
            </Text>
          )}
         
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
  background: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  taskName: {
    fontSize: 24, 
    fontWeight: "bold",
    color: "black", 
    zIndex: -1,
  },

  header: {
    paddingVertical: 20,
    paddingHorizontal: 16, 
    justifyContent: "center", 
    alignItems: "center", 
    width: "100%", 
    marginTop: "10%",
  },
  logo: {
    width: 50,
    height: 50, 
    resizeMode: "contain", 
  },
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(123, 144, 75, 0.25)",
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    width: "90%",
    top: 0,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#44483E",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e1e1",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 10,
    top: -10,
    fontWeight: "bold",
    color: "#000",
  },
  status: {
    fontSize: 9,
    left: 10,
    color: "grey",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
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
    bottom: -25,
    zIndex: 1,
  },
});

export default ReportTaskTakers;
