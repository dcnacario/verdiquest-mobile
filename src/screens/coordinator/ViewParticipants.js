import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import { theme } from "../../../assets/style";
import { Path, Svg } from "react-native-svg";

const ViewParticipants = ({ route }) => {
  const { eventData } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [fetchedParticipants, setFetchedParticipants] = useState([]);
  const [error, setError] = useState("");
  const [verified, setVerify] = useState(false);
  const localhost = ipAddress;

  //BACKEND API CALL
  //FETCHING PARTICIPANTS
  const fetchParticipants = async () => {
    try {
      let eventId = eventData.eventId;
      if (!eventId) {
        console.error("No event ID available");
        setError("No event ID available"); // Set error message
        setIsLoading(false); // End loading
        return;
      }
      const response = await axios.post(
        `${localhost}/coordinator/fetchParticipants`,
        {
          eventId,
        }
      );
      setFetchedParticipants(response.data.fetchTable);
      setIsLoading(false); // End loading
    } catch (error) {
      console.error("Error fetching participants table", error);
      setError("Error fetching participants table");
      setIsLoading(false);
    }
  };

  //VERIFICATION OF PARTICIPANTS

  const handleVerify = async (data) => {
    try {
      const response = await axios.post(
        `${localhost}/coordinator/updateParticipant`,
        {
          Status: "VERIFIED",
          participantId: data.ParticipantId,
        }
      );
      const responsePoints = await axios.post(`${localhost}/user/updateUser`, {
        verdiPoints: data.EventPoints,
        userId: data.UserId,
      });
      fetchParticipants();
    } catch (error) {
      console.log("Error updating user/task data:", error);
      throw error;
    }
  };

  //---------------------

  useEffect(() => {
    fetchParticipants();
  }, [eventData.EventId || eventData.eventId]);

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
        <Text style={styles.taskName}>
          {eventData.eventName || eventData.EventName}
        </Text>
        <View style={styles.divider}></View>
      </View>
      {isLoading && (
        <Text>Loading...</Text> // Simple loading text, can be replaced with a spinner
      )}
      {/* Content ScrollView */}
      {error ? (
        <Text style={styles.errorMessage}>{error}</Text> // Display error message
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {fetchedParticipants != null ? (
            fetchedParticipants.map((item) => (
              <View key={item.ParticipantId} style={styles.cardContainer}>
                {console.log(item.ProfilePicture)}
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={{
                      uri: `${localhost}/img/profilepicture/${item.ProfilePicture}`,
                    }}
                    style={styles.imageStyle}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.name}>
                    {item.FirstName} {item.LastName}
                  </Text>
                  <Text style={styles.status}>Status: {item.Status}</Text>
                </View>
                <TouchableOpacity
                  style={
                    item.Status == "VERIFIED"
                      ? {
                          backgroundColor: "grey",
                          paddingVertical: 6,
                          paddingHorizontal: 16,
                          borderRadius: 20,
                          justifyContent: "center",
                        }
                      : styles.button
                  }
                  onPress={() => handleVerify(item)}
                  disabled={item.Status == "VERIFIED" ? true : false}
                >
                  <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No participants yet!</Text>
          )}
        </ScrollView>
      )}
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
    paddingTop: StatusBar.currentHeight + 80,
    paddingBottom: 20,
  },
  taskName: {
    fontSize: 24, // Adjust the size to match your design
    fontWeight: "bold",
    color: "black", // Adjust the color to match your design
  },

  header: {
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    width: "100%", // Header width
  },
  logo: {
    width: 50, // Logo width
    height: 50, // Logo height
    resizeMode: "contain", // Keeps the logo's aspect ratio
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
    marginVertical: 8,
    width: "90%",
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
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#161616",
    marginTop: 10,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 60,
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

export default ViewParticipants;
