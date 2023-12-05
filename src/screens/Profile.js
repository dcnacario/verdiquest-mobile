import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { theme } from "../../assets/style";
import IntroCard from "../components/IntroCard";
import OrganizationCard from "../components/OrganizationCard";
import AchievementCard from "../components/AchievementCard";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import ipAddress from "../database/ipAddress";

const Profile = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const paddingBottom = screenHeight * 0.15;
  const { user } = route.params;
  const localhost = ipAddress;
  const [personDetails, setPerson] = useState({
    FirstName: "",
    Initial: "",
    LastName: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const fetchPerson = async () => {
    try {
      const response = await axios.post(`${localhost}/user/fetchPerson`, {
        userId: user.UserId,
      });
      setPerson(response.data.fetchPerson);
      console.log(response.data.fetchPerson);
    } catch (error) {
      console.log(error);
    }
  };

  const editIntro = () => {
    if (isEditing) return;

    setIsEditing(!isEditing);
  };

  useEffect(() => {
    fetchPerson();
  }, []);

  console.log(personDetails);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background, flex: 1 }}
      contentContainerStyle={{ paddingBottom: paddingBottom }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ position: "absolute", top: 40, right: 20, zIndex: 1 }}>
          <Ionicons
            name="settings-outline"
            size={20}
            color="black"
            onPress={() => console.log("Settings Pressed")}
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
            <View style={styles.profileContainer}></View>
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
          <IntroCard editable={isEditing} onPress={editIntro} />
        </View>
        <View style={styles.organizationContainer}>
          <OrganizationCard />
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
});

export default Profile;
