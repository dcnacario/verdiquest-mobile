import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../../assets/style";
import CoordinatorCard from "../../components/CoordinatorCard";
import { useNavigation } from "@react-navigation/native";
import defaultImage from "../../../assets/img/default-image.png";
import ipAddress from "../../database/ipAddress";
import axios from "axios";
import { Path, Svg } from "react-native-svg";
const CoordinatorMaster = ({ route }) => {
  const navigation = useNavigation();
  const { coordinator } = route.params;
  const localhost = ipAddress;
  const imageSource = {
    uri: `${localhost}/img/organization/${coordinator.OrganizationImage}`,
  };
  const [isLoading, setIsLoading] = useState(false);

  const [fetchCoordinatorData, setFetchCoordinators] = useState([]);

  const handleImageError = (error) => {
    console.log("Image load error:", error.nativeEvent.error);
  };

  const goToCoordinatorDashboard = (item) => {
    navigation.navigate("CoordinatorDashboard", { item: item });
  };

  const fetchCoordinators = async () => {
    try {
      const response = await axios.post(
        `${localhost}/coordinator/fetchCoordinators`,
        {
          organizationId: coordinator.OrganizationId,
        }
      );
      setFetchCoordinators(response.data.fetchTable);
    } catch (error) {
      console.log("Error fetching coordinator data:", error);
    }
  };

  useEffect(() => {
    fetchCoordinators();
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
        {coordinator.OrganizationImage != null &&
        coordinator.OrganizationImage != "" ? (
          <View style={{ alignSelf: "flex-end", width: 100 }}>
            <Image
              source={imageSource}
              style={styles.profileStyle}
              onError={handleImageError}
            />
          </View>
        ) : (
          <View style={{ alignSelf: "flex-end", width: 100 }}>
            <Image
              source={defaultImage}
              style={styles.profileStyle}
              onError={handleImageError}
            />
          </View>
        )}
        <View style={styles.header}>
          <View style={{ flex: 1 }}></View>
          <Text style={styles.textStyle}>Coordinators</Text>
          <View style={{ flex: 1 }}></View>
        </View>
        <View style={styles.divider}></View>
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} /> // Loading indicator)
          ) : fetchCoordinatorData != null &&
            fetchCoordinatorData.length > 0 ? (
            <FlatList
              data={fetchCoordinatorData}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <CoordinatorCard
                    name={item.Username}
                    item={item}
                    onPress={() => goToCoordinatorDashboard(item)}
                  />
                </View>
              )}
              keyExtractor={(item) => item.CoordinatorId}
              numColumns={2}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <Text>No members yet for this organization.</Text>
          )}
        </View>
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
    flex: 1,
    paddingVertical: 30,
    backgroundColor: theme.colors.background,
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  textStyle: {
    fontSize: 18,
    paddingVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -40,
  },
  profileStyle: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 100 / 2,
    marginTop: 50,
    left: -5,
  },
  divider: {
    borderWidth: 0.5,
    width: "70%",
    marginTop: -20,
    marginBottom: 10,
    backgroundColor: "#161616",
  },
  listItem: {
    margin: 10,
  },
  listContent: {
    paddingHorizontal: 20,
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

export default CoordinatorMaster;
