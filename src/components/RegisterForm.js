import React, { useState } from "react";
import { Text, StyleSheet, View, Alert } from "react-native";
import { theme } from "../../assets/style";
import { TextInput } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";
import Birthday from "./Birthday";
import Button from "./Button";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import ipAddress from "../database/ipAddress";

const RegisterForm = ({ onRegister }) => {
  const navigation = useNavigation();

  const localhost = ipAddress;

  const handleBirthDateChange = (date) => {
    setUserData((prev) => ({
      ...prev,
      birthDate: date.toISOString().slice(0, 10),
    }));
  };

  const [selectedValue, setSelectedValue] = useState("male");
  const [userData, setUserData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (name, text) => {
    setUserData((prev) => ({ ...prev, [name]: text }));
  };

  const handleSubmit = () => {
    // Check for empty fields
    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "gender",
      "street",
      "barangay",
      "city",
      "province",
      "email",
      "password",
      "confirmPassword",
    ];
    for (let field of requiredFields) {
      if (!userData[field] || userData[field].trim() === "") {
        Alert.alert(
          "Error",
          `Please enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`
        );
        return;
      }
    }

    // Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    // Proceed with API call
    axios
      .post(`${localhost}/user/register`, userData)
      .then((response) => {
        Alert.alert("Success", response.data.message);
        navigation.navigate("Login");
      })
      .catch((error) => {
        // Handle the specific 'email already registered' error
        if (
          error.response &&
          error.response.data &&
          error.response.data.error === "Email already registered"
        ) {
          Alert.alert(
            "Registration Error",
            "This email is already registered. Please use a different email."
          );
        } else {
          // Handle other types of errors
          console.error(error);
          Alert.alert("Error", "Failed to register. Please try again.");
        }
      });
  };

  return (
    <View style={styles.background}>
      <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 20 }}>
        <View style={{ flex: 3 }}>
          <Text style={styles.textInput}>First Name</Text>
          <TextInput
            style={styles.inputStyle}
            value={userData.firstName}
            onChangeText={(text) => handleInputChange("firstName", text)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.textInput}>M.I.</Text>
          <TextInput
            style={styles.inputStyle}
            value={userData.middleInitial}
            onChangeText={(text) => handleInputChange("middleInitial", text)}
          />
        </View>
      </View>
      <View style={{ flex: 1, marginHorizontal: 20, alignSelf: "stretch" }}>
        <Text style={styles.textInput}>Last Name</Text>
        <TextInput
          style={styles.inputStyle}
          value={userData.lastName}
          onChangeText={(text) => handleInputChange("lastName", text)}
        />
      </View>
      <View>
        <Text>Gender:</Text>
        <RadioButton.Group
          onValueChange={(value) => {
            setSelectedValue(value);
            handleInputChange("gender", selectedValue);
          }}
          value={selectedValue}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
              <RadioButton
                value="male"
                color={`${theme.colors.primary}`}
                uncheckedColor={`${theme.colors.primary}`}
              />
              <Text style={styles.labelText}>Male</Text>
            </View>
            <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
              <RadioButton
                value="female"
                color={`${theme.colors.primary}`}
                uncheckedColor={`${theme.colors.primary}`}
              />
              <Text style={styles.labelText}>Female</Text>
            </View>
            <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
              <RadioButton
                value="others"
                color={`${theme.colors.primary}`}
                uncheckedColor={`${theme.colors.primary}`}
              />
              <Text style={styles.labelText}>Others</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>
      <Birthday onValueChange={handleBirthDateChange} />
      <View style={{ flex: 1, marginHorizontal: 20, alignSelf: "stretch" }}>
        <Text style={styles.textInput}>Phone Number</Text>
        <TextInput
          style={styles.inputStyle}
          keyboardType="numeric"
          value={userData.phoneNumber}
          onChangeText={(text) => handleInputChange("phoneNumber", text)}
        />
      </View>
      <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.textInput}>Street</Text>
          <TextInput
            style={styles.inputStyle}
            value={userData.street}
            onChangeText={(text) => handleInputChange("street", text)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.textInput}>Barangay</Text>
          <TextInput
            style={styles.inputStyle}
            value={userData.barangay}
            onChangeText={(text) => handleInputChange("barangay", text)}
          />
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.textInput}>City</Text>
          <TextInput
            style={styles.inputStyle}
            value={userData.city}
            onChangeText={(text) => handleInputChange("city", text)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.textInput}>Province</Text>
          <TextInput
            style={styles.inputStyle}
            value={userData.province}
            onChangeText={(text) => handleInputChange("province", text)}
          />
        </View>
      </View>
      <View style={{ flex: 1, marginHorizontal: 20, alignSelf: "stretch" }}>
        <Text style={styles.textInput}>Email</Text>
        <TextInput
          style={styles.inputStyle}
          keyboardType="email-address"
          value={userData.email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
      </View>
      <View style={{ flex: 1, marginHorizontal: 20, alignSelf: "stretch" }}>
        <Text style={styles.textInput}>Password</Text>
        <TextInput
          style={styles.inputStyle}
          value={userData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={true}
        />
      </View>
      <View style={{ flex: 1, marginHorizontal: 20, alignSelf: "stretch" }}>
        <Text style={styles.textInput}>Confirm Password</Text>
        <TextInput
          style={styles.inputStyle}
          value={userData.confirmPassword}
          onChangeText={(text) => handleInputChange("confirmPassword", text)}
          secureTextEntry={true}
        />
      </View>
      <Button title="Register" onPress={handleSubmit} />
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
  labelText: {
    backgroundColor: theme.colors.background,
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#44483E",
    marginVertical: 5,
  },
});

export default RegisterForm;
