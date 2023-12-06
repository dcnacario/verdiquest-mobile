import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, StatusBar } from "react-native";
import defaultImage from "../../assets/img/default-image.png";
import { theme } from "../../assets/style";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ipAddress from "../database/ipAddress";
import { Path, Svg } from "react-native-svg";

const PartnerOverview = ({ route }) => {
  const navigation = useNavigation();
  const { user, organization } = route.params;
  const [organizationDetails, setOrganizationDetails] = useState({});
  const localhost = ipAddress;

  const fetchOrganizationDetails = async (organization) => {
    try {
      const response = await axios.get(
        `${localhost}/user/organizationDetails/${organization}`
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

  const handleJoinOrg = async () => {
    try {
      const response = await axios.post(`${localhost}/user/joinOrg`, {
        userId: user.UserId,
        organizationId: organization.OrganizationId,
      });

      console.log("response: ", response.data);

      if (response.data && response.data.success) {
        const updatedUser = response.data.user[0];
        console.log("updatedUser", updatedUser);

        navigation.navigate("SuccessJoin", {
          user: updatedUser,
          organization: organization,
        });
      } else {
        console.error("Failed to join organization");
      }
    } catch (error) {
      console.error("Error joining organization:", error);
    }
  };

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
      <Image
        source={
          organization.OrganizationImage
            ? {
                uri: `${localhost}/img/organization/${organization.OrganizationImage}`,
              }
            : defaultImage
        }
        style={styles.imageStyle}
      />
      <Text style={styles.headerStyle}>
        {organization.OrganizationName || "Organization Name"}
      </Text>
      <View style={styles.visionMissionContainer}>
        <Text style={styles.titleStyle}>Address</Text>
        <Text style={styles.textStyle}>
          {organization.OrganizationAddress || "Lorem Ipsum"}
        </Text>
        <Text style={styles.titleStyle}>Organization Type</Text>
        <Text style={styles.textStyle}>
          {organization.OrganizationType || "Lorem Ipsum"}
        </Text>
      </View>
      <Button title={"BECOME A MEMBER"} onPress={handleJoinOrg} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
    marginTop: StatusBar.currentHeight,
  },
  imageStyle: {
    width: "50%",
    height: 150,
    resizeMode: "center",
    borderRadius: 15,
  },
  visionMissionContainer: {
    width: "80%",
    backgroundColor: "#89A744",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 30,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  titleStyle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textStyle: {
    color: "white",
    marginBottom: 20,
  },
  headerStyle: {
    fontWeight: "bold",
    fontSize: 24,
  },
  svgCurve: {
    position: "absolute",
    top: -40,
    left: -300,
    zIndex: -1,
  },
  bottomWavy: {
    position: "absolute",
    bottom: -115,
    left: -300,
    zIndex: -1,
  },
});

export default PartnerOverview;
