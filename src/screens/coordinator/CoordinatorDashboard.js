import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { theme } from "../../../assets/style";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";

const CoordinatorDashboard = ({ route }) => {
  const { item } = route.params;

  const navigation = useNavigation();

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.background}>
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
        {/* Profile Picture */}
        <Image
          source={require("../../../assets/img/default-profile.png")}
          style={styles.profileImg}
        />
        <Text style={styles.coordinatorLabel}>Coordinator</Text>
        {/* Coordinator's Username */}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Username</Text>
          <TextInput
            style={styles.inputStyle}
            value={item.Username}
            editable={false}
          />
        </View>
        {/* Coordinator's First Name*/}
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>First Name</Text>
          <TextInput
            style={styles.inputStyle}
            value={item.FirstName}
            editable={false}
          />
        </View>
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Middle Initial</Text>
          <TextInput
            style={styles.inputStyle}
            value={item.Initial}
            editable={false}
          />
        </View>
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Last Name</Text>
          <TextInput
            style={styles.inputStyle}
            value={item.LastName}
            editable={false}
          />
        </View>
        <View style={{ justifyContent: "flex-start" }}>
          <Text style={styles.textInput}>Address</Text>
          <TextInput
            style={styles.inputStyle}
            value={item.City + "," + item.Province}
            editable={false}
          />
        </View>
        {/* <TouchableOpacity onPress={goToRegister}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              marginTop: 30,
              left: 110,
              color: "#BA1A1A",
            }}
          >
            Remove
          </Text>
        </TouchableOpacity> */}
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
  inputStyle: {
    borderColor: "#44483E",
    borderWidth: 1,
    borderRadius: 12,
    width: 256,
    height: 45,
    marginTop: -15,
    margin: 10,
    padding: 10,
  },
  textInput: {
    marginLeft: 20,
    backgroundColor: theme.colors.background,
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#44483E",
    zIndex: 1,
    padding: 5,
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 80,
    alignSelf: "center",
  },
  coordinatorLabel: {
    fontSize: 18,
    color: "#44483E",
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 10,
  },
  svgCurve: {
    position: "absolute",
    top: -20,
    left: -316,
    zIndex: 1,
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

export default CoordinatorDashboard;
