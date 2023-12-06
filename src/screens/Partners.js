import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { theme } from "../../assets/style";
import TaskCategoriesCard from "../components/TaskCategoriesCard";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ipAddress from "../database/ipAddress";
import { Path, Svg } from "react-native-svg";

const Partners = ({ route }) => {
  const { user } = route.params;
  const [organizations, setOrganizations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const localhost = ipAddress;

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${localhost}/user/organizations`);
      if (response.data && response.data.success) {
        setOrganizations(response.data.organizations);
      } else {
        throw new Error("Failed to fetch organizations");
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOrganizationView = async (organization) => {
    try {
      const response = await axios.get(`${localhost}/user/isMember`, {
        params: {
          userId: user.UserId,
          organizationId: organization.OrganizationId,
        },
      });

      if (response.data && response.data.isMember) {
        navigation.navigate("OrgHome", {
          user: user,
          organization: organization,
        });
      } else {
        navigation.navigate("PartnerOverview", {
          user: user,
          organization: organization,
        });
      }
    } catch (error) {
      console.error("Error checking membership:", error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchOrganizations();
    } catch (error) {
      console.error("Error fetching organizations on refresh:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        marginTop: StatusBar.currentHeight,
      }}
    >
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <Text style={styles.titleStyle}>Organization Partners</Text>
          <View style={styles.cardContainer}>
            {organizations.map((organization) => (
              <TaskCategoriesCard
                key={organization.OrganizationId}
                img={`${localhost}/img/organization/${organization.OrganizationImage}`}
                title={organization.OrganizationName}
                onPress={() => handleOrganizationView(organization)}
              />
            ))}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  titleStyle: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginTop: 60,
  },
  cardContainer: {
    marginTop: 30,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "space-around",
  },
  svgCurve: {
    position: "absolute",
    top: -50,
    left: -300,
    zIndex: 0,
  },
  row: {
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: -45,
    left: -23,
  },
});

export default Partners;
