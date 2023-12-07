import React, { useEffect, useState } from "react";
import {Text, View, StyleSheet, ScrollView, Dimensions, StatusBar,Image} from "react-native";
import { theme } from "../../assets/style";
import IntroCard from "../components/IntroCard";
import OrganizationCard from "../components/OrganizationCard";
import AchievementCard from "../components/AchievementCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import ipAddress from "../database/ipAddress";
import { useNavigation } from "@react-navigation/native";
import defaultProfile from "../../assets/img/verdiquestlogo-ver2.png";
import { Path, Svg } from "react-native-svg"
import { TouchableOpacity } from "react-native-gesture-handler";

const Profile = ({ route }) => {
  const navigation = useNavigation();
  const screenHeight = Dimensions.get("window").height;
  const paddingBottom = screenHeight * 0.15;
  const { user } = route.params;
  const localhost = ipAddress;
  const [personDetails, setPerson] = useState({
    FirstName: "",
    Initial: "",
    LastName: "",
  });
  const [orgDetails, setOrganizationDetails] = useState({
    OrganizationName: "",
  });

  const [userDescription, setTextInputValue] = useState(user.UserDescription);

  const handleTextInputChange = (text) => {
    setTextInputValue(text);
  };

  const goToEditProfile = (personDetails) => {
    navigation.navigate("EditProfileUser", {
      user: user,
      personDetails: personDetails,
    });
  };
  //

  const [isEditing, setIsEditing] = useState(false);

  const fetchPerson = async () => {
    try {
      const response = await axios.post(`${localhost}/user/fetchPerson`, {
        userId: user.UserId,
      });
      setPerson(response.data.fetchPerson);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrganizationDetails = async () => {
    try {
      const response = await axios.get(
        `${localhost}/user/organizationDetails/${user.OrganizationId}`
      );
      if (response.data && response.data.success) {
        setOrganizationDetails(response.data.organization);
      } else {
        throw new Error("Failed to fetch organization details");
      }
    } catch (error) {
      console.log("Error fetching organization details:", error);
    }
  };

  const editIntro = async () => {
    if (isEditing) {
      try {
        const response = await axios.post(`${localhost}/user/updateInfo`, {
          userId: user.UserId,
          userDescription: userDescription,
        });
      } catch (error) {
        console.error("Failed! editing info", error);
      }
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    fetchPerson();
    fetchOrganizationDetails();
  }, []);

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
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}
      contentContainerStyle={{ paddingBottom: paddingBottom }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ position: "absolute", top: 60, right: 20, zIndex: 1 }}>
          <TouchableOpacity onPress={() => goToEditProfile(personDetails)}>
          <Ionicons
            name="settings-outline"
            size={20}
            color="black"
          />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginTop: 10 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              marginHorizontal: 20,
            }}
          >
            <View style={styles.profileContainer}>
              <Image
                source={
                  user.ProfilePicture
                    ? {
                        uri: `${localhost}/img/profilepicture/${user.ProfilePicture}`,
                      }
                    : defaultProfile
                }
                style={styles.imageStyle}
              />
            </View>
            <Text style={styles.nameLabel}>
              {personDetails.FirstName} {personDetails.Initial}{" "}
              {personDetails.LastName}
            </Text>
            <Text style={styles.emailLabel}>{user.Email}</Text>
            <Text style={styles.roleLabel}>
              {user.SubscriptionStatus === "Inactive"
                ? "Volunteer"
                : "Volunteer+"}
            </Text>
          </View>
        </View>
        <View style={styles.introContainer}>
          <IntroCard
            editable={isEditing}
            onPress={editIntro}
            inputValue={userDescription}
            onInputChange={handleTextInputChange}
          />
        </View>
        <View style={styles.organizationContainer}>
          <OrganizationCard
            organization={orgDetails.OrganizationName || "N/A"}
          />
        </View>
        <View style={styles.achievementsContainer}>
          <AchievementCard />
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
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  img: {
    height: 120,
    width: 120,
  },
  introContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  organizationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  profileContainer: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    marginTop: 70,
    backgroundColor: theme.colors.primary,
  },
  nameLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emailLabel: {
    fontSize: 14,
    color: "#808080",
  },
  roleLabel: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
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
    zIndex: 0,
  },
});

export default Profile;
