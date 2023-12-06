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
      console.error("Error fetching organization details:", error);
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
        <View style={{ position: "absolute", top: 40, right: 20, zIndex: 1 }}>
          <Ionicons
            name="settings-outline"
            size={20}
            color="black"
            onPress={() => goToEditProfile(personDetails)}
          />
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
  );
};

const styles = StyleSheet.create({
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
    marginTop: 20,
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
});

export default Profile;
