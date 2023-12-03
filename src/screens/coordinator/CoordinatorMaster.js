import React from "react";
import { StyleSheet, View, Text, SafeAreaView, Image } from "react-native";
import { theme } from "../../../assets/style";
import CoordinatorCard from "../../components/CoordinatorCard";
import { useNavigation } from "@react-navigation/native";
import defaultImage from "../../../assets/img/default-image.png";
import ipAddress from "../../database/ipAddress";

const CoordinatorMaster = ({ route }) => {
  const navigation = useNavigation();
  const { coordinator } = route.params;
  const localhost = ipAddress;
  const imageSource = {
    uri: `${localhost}/img/organization/${coordinator.OrganizationImage}`,
  };

  const handleImageError = (error) => {
    console.log("Image load error:", error.nativeEvent.error);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
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
          <CoordinatorCard name="Danmar Nacario" />
        </View>
      </View>
    </SafeAreaView>
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
    marginTop: 20,
  },
  divider: {
    borderWidth: 0.5,
    width: "70%",
    marginTop: -20,
    marginBottom: 10,
    backgroundColor: "#161616",
  },
});

export default CoordinatorMaster;
