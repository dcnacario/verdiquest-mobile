import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import defaultImage from "../../../assets/img/default-image.png";
import { Path, Svg } from "react-native-svg";

const CoordInterface = ({ route }) => {
  const [coordinator, setCoordinator] = useState(route.params.coordinator);
  const isFocused = useIsFocused(); // Determines if the screen is focused
  const localhost = ipAddress;
  const navigation = useNavigation();

  const fetchCoordinatorData = async () => {
    try {
      // Replace with your API call to fetch coordinator data
      const response = await axios.post(
        `${localhost}/coordinator/fetchCoordinator`,
        {
          coordinatorId: coordinator.CoordinatorId,
        }
      );
      setCoordinator(response.data.fetchedUser);
    } catch (error) {
      console.log("Error fetching coordinator data:", error);
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchCoordinatorData();
    }
  }, [isFocused]);

  const gotoTasks = () => {
    navigation.navigate("TaskMaster", { coordinator: coordinator });
  };
  const gotoEvents = () => {
    navigation.navigate("EventMaster", { coordinator: coordinator });
  };
  const gotoReports = () => {
    navigation.navigate("ReportEvent", { coordinator: coordinator });
  };

  const gotoCoordinators = () => {
    navigation.navigate("CoordinatorMaster", { coordinator: coordinator });
  };
  const editCoordinator = () => {
    navigation.navigate("EditProfileCoordinator", { coordinator: coordinator });
  };
  const goToOrganizationProfile = () => {
    navigation.navigate("ViewOrganization", { coordinator: coordinator });
  };
  const goToOrganization = () => {
    navigation.navigate("Organization", { coordinator: coordinator });
  };
  const goToReward = () => {
    navigation.navigate("CoordinatorProduct", { coordinator: coordinator });
  };

  const isDisable = coordinator.Rank === 0 ? true : false;

  return (
    <View style={styles.container}>
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
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background, flex: 1 }}
    >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={{ alignSelf: "flex-end" }}>
            <TouchableOpacity onPress={goToOrganizationProfile}>
              {coordinator.OrganizationImage != null ? (
                <Image
                  source={{
                    uri: `${localhost}/img/organization/${coordinator.OrganizationImage}`,
                  }}
                  style={styles.profileAvatar}
                />
              ) : (
                <Image source={defaultImage} style={styles.profileAvatar} />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}></View>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../../assets/img/default-profile.png")}
              style={styles.coordinatorAvatar}
            />
            <View style={styles.userNameWithIcon}>
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {coordinator.FirstName} {coordinator.LastName}
              </Text>
              <TouchableOpacity onPress={editCoordinator}>
                <Icon name="pencil" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.role}>
              {coordinator.Rank === 1 ? "Head Coordinator" : "Coordinator"}
            </Text>
          </View>
        </View>

        {/* Ongoing Events Section */}
        <View style={styles.ongoingEventsContainer}>
          <Text style={styles.ongoingEventsTitle}>Ongoing Events</Text>
          {/* Insert other components representing the event details here */}
        </View>

        <View style={styles.row}>
          <View style={styles.leftButton}>
            <Button title="Tasks" onPress={gotoTasks} />
          </View>
          <View style={styles.rightButton}>
            <Button title="Coordinators" onPress={gotoCoordinators} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftButton}>
            <Button title="Events" onPress={gotoEvents} />
          </View>
          <View style={styles.rightButton}>
            <Button title="Report" onPress={gotoReports} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftButton}>
            <Button title="Organization" onPress={goToOrganization} />
          </View>
          <View style={styles.rightButton}>
            <Button title="Rewards" onPress={goToReward} disabled={isDisable} />
          </View>
        </View>
    </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
    padding: 10,
    marginTop: 75,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    flex: 1,
    marginHorizontal: 50,
  },
  leftButton: {
    flex: 1,
    marginRight: 5,
  },
  rightButton: {
    flex: 1,
    marginLeft: 5,
  },
  logoutButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  subtextCoordinator: {
    textAlign: "center",
    color: "#000000",
  },
  mainTextCoordinator: {
    textAlign: "center",
    color: "#000000",
  },
  scrollView: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  userNameWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flexShrink: 1,
    marginRight: 8,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderColor: "black",
    borderWidth: 1,
  },
  coordinatorAvatar: {
    width: 90,
    height: 90,
  },

  role: {
    fontSize: 16,
    color: "#000",
  },
  ongoingEventsContainer: {
    height: 200, // Set your desired height
    backgroundColor: "#D9EAD3",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  ongoingEventsTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
  },
  svgCurve: {
    position: "absolute",
    top: -77,
    left: -316,
    zIndex: 1,
  },
  row1: {
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

export default CoordInterface;
