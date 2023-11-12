import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { theme } from "../../assets/style";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";

const LoginIntro = () => {
  //Navigate to Register Screen
  const navigation = useNavigation();

  const goToVolunteerLogin = () => {
    navigation.navigate("Login");
  };

  const goToCoordinatorLogin = () => {
    navigation.navigate("CoordinatorStack");
  };

  // const goToCoordinatorOrganization = () => {
  //     navigation.navigate("OrgProfile");
  // };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background, flex: 1 }}
    >
      <View style={styles.background}>
        <Image
          source={require("../../assets/img/verdiquestlogo-ver2.png")}
          style={styles.img}
        />
        <View style={{ justifyContent: "flex-start", marginBottom: 50 }}>
          <Text style={styles.textInput}>Login as:</Text>
        </View>
        {/* {/ Volunteer/} */}
        <View style={{ marginBottom: 10 }}>
          <Button title="Volunteer" onPress={goToVolunteerLogin} />
        </View>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={{ top: 8 }}>or</Text>
          <View style={styles.divider} />
        </View>
        {/* {/ Coordinator/} */}
        <View style={{ marginTop: 10 }}>
          <Button title="Coordinator" onPress={goToCoordinatorLogin} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  img: {
    width: 180,
    height: 180,
    marginTop: 150,
    marginBottom: -20,
  },
  divider: {
    width: "30%",
    height: 1,
    backgroundColor: "#000000",
    margin: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignContent: "center",
  },
  button: {
    marginTop: 10,
  },
});

export default LoginIntro;
