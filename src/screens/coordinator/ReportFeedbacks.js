import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, StatusBar } from "react-native";
import { theme } from "../../../assets/style";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import { Path, Svg } from "react-native-svg";
const ReportFeedbacks = ({ route }) => {
  const { item } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const localhost = ipAddress;

  const [fetchedParticipants, setFetchedParticipants] = useState([]);

  //API BACKEND CALL
  const fetchParticipants = async () => {
    try {
      let eventId = item.EventId;
      if (!eventId) {
        console.error("No event ID available");
        setError("No event ID available"); // Set error message
        setIsLoading(false); // End loading
        return;
      }
      const response = await axios.post(
        `${localhost}/coordinator/fetchParticipantsVerified`,
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

  useEffect(() => {
    fetchParticipants();
  }, [item.EventId || item.eventId]);

  // const renderStars = (rating) => {
  //   let stars = [];
  //   for (let i = 0; i < 5; i++) {
  //     stars.push(
  //       <MaterialIcon
  //         name={i < rating ? "star" : "star-border"}
  //         size={16}
  //         color="#ffd700"
  //         key={i}
  //       />
  //     );
  //   }
  //   return stars;
  // };

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
      <View style={styles.header}>
        <Text style={styles.taskName}>Feedbacks</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <Text
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}
          >
            {item.EventName}
          </Text>
          {fetchedParticipants != null && fetchedParticipants.length > 0 ? (
            fetchedParticipants.map((item) => (
              <View key={item.ParticipantId} style={styles.feedbackCard}>
                <View style={styles.userAvatar} />
                <View style={styles.feedbackTextContainer}>
                  <Text style={styles.feedbackText}>"{item.Feedback}"</Text>
                  <Text style={styles.userText}>{item.FirstName}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No user feedbacks yet!
            </Text>
          )}

          <View style={styles.totalRatingContainer}>
            {/* <Text>Total Rating:</Text>
            <Text style={styles.totalRating}>4.3</Text> */}
          </View>
        </View>
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
    backgroundColor: theme.colors.background,
    paddingTop: StatusBar.currentHeight + 80,
  },
  header: {
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    width: "100%", // Header width
    marginTop: "10%",
  },
  taskName: {
    fontSize: 24, // Adjust the size to match your design
    fontWeight: "bold",
    color: "black", // Adjust the color to match your design
  },
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  feedbackCard: {
    backgroundColor: "rgba(123, 144, 75, 0.4)", // Use your theme card background color
    flexDirection: "row",
    padding: 10,
    marginHorizontal: 40,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: "center",
    borderRadius: 16,
  },
  userAvatar: {
    backgroundColor: theme.colors.avatarBackground, // Use your theme avatar background color
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  feedbackTextContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  feedbackText: {
    fontSize: 12, // Adjust as needed
    textAlign: "justify",
    // Use your theme text color
  },
  starRating: {
    flexDirection: "row",
    marginTop: 4,
  },
  userText: {
    fontSize: 12,
    color: theme.colors.subText, // Use your theme subtext color
    marginTop: 4,
    fontWeight: "bold",
  },
  totalRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  totalRating: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.highlight, // Use your theme highlight color
  },
  container: {
    backgroundColor: "rgba(123,144,75,0.4)",
    borderRadius: 20,
    width: "80%",
    paddingTop: 20,
    flex: 1,
  },
  svgCurve: {
    position: "absolute",
    top: -2,
    left: -316,
    zIndex: -1,
  },
  row: {
    flexDirection: "row",
    height: 0,
    justifyContent: "center",
    alignItems: "center",
    left: -30,
    position: "absolute",
    bottom: -25,
    zIndex: 0,
  },
});

export default ReportFeedbacks;
