import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { theme } from "../../assets/style";
import defaultImage from "../../assets/img/default-image.png";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import ipAddress from "../database/ipAddress";

const SuccessJoin = ({ img, route }) => {
  const navigation = useNavigation();
  const localhost = ipAddress;
  const { user, organization } = route.params;

  const handleProceed = () => {
    navigation.navigate("OrgHome", { user: user, organization: organization });
  };

  return (
    <View style={styles.container}>
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
      <View style={{ marginBottom: 40 }}>
        <Text style={styles.titleStyle}>Congratulations!</Text>
        <Text style={styles.textStyle}>You are now part of!</Text>
        <Text style={styles.textStyle}>{organization.OrganizationName}</Text>
      </View>
      <Button title={"PROCEED"} onPress={handleProceed} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 40,
    gap: 60,
  },
  imageStyle: {
    width: "70%",
    height: 180,
    resizeMode: "center",
    borderRadius: 15,
  },
  titleStyle: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  textStyle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default SuccessJoin;
