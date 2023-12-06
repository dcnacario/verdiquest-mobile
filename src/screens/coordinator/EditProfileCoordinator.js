import React, { useEffect, useState } from "react";
import { View, TextInput, Image, StyleSheet, Text } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import ipAddress from "../../database/ipAddress";
import axios from "axios";
import { RadioButton } from "react-native-paper";
import Birthday from "../../components/Birthday";
import { ScrollView } from "react-native-gesture-handler";
import { Path, Svg } from "react-native-svg";

const EditProfileCoordinator = ({ route }) => {
  const { coordinator } = route.params;
  const localhost = ipAddress;
  const [isEditing, setIsEditing] = useState(false);
  const [initial, setInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedValue, setSelectedValue] = useState("male");
  const [coordinatorData, setCoordinatorData] = useState({
    userName: coordinator.Username,
    newPassword: "",
    confirmNewPassword: "",
    firstName: coordinator.FirstName,
    middleInitial: coordinator.Initial,
    lastName: coordinator.LastName,
    personId: coordinator.PersonId,
    coordinatorId: coordinator.CoordinatorId,
    phoneNumber: coordinator.PhoneNumber,
    birthDate: "",
    gender: coordinator.Gender,
    street: coordinator.Street,
    barangay: coordinator.Barangay,
    city: coordinator.City,
    province: coordinator.Province,
  });

  const validatePasswords = () => {
    let isValid = true;
    let newErrors = { newPasswordError: "", confirmNewPasswordError: "" };

    // Check if newPassword is empty
    if (!coordinatorData.newPassword) {
      newErrors.newPasswordError = "New password cannot be empty";
      isValid = false;
    } else if (coordinatorData.newPassword.length < 8) {
      newErrors.newPasswordError =
        "Password must be at least 8 characters long";
      isValid = false;
    }

    // Check if confirmNewPassword is empty
    if (!coordinatorData.confirmNewPassword) {
      newErrors.confirmNewPasswordError =
        "Confirm new password cannot be empty";
      isValid = false;
    } else if (
      coordinatorData.newPassword !== coordinatorData.confirmNewPassword
    ) {
      newErrors.confirmNewPasswordError = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const [passwordErrors, setPasswordErrors] = useState({
    newPasswordError: "",
    confirmNewPasswordError: "",
  });

  const handleInputChange = (name, text) => {
    setCoordinatorData((prev) => ({ ...prev, [name]: text }));
  };

  const handleBirthDateChange = (date) => {
    setCoordinatorData((prev) => ({
      ...prev,
      birthDate: date.toISOString().slice(0, 10),
    }));
  };

  const handleEditProfile = async () => {
    if (isEditing) {
      if (coordinatorData.newPassword && !validatePasswords()) return;
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          `${localhost}/coordinator/updateCoordinator`,
          coordinatorData
        );
      } catch (error) {
        console.log("Error! updating the profile!", error);
      } finally {
        setIsSubmitting(false);
      }
    }
    setIsEditing(!isEditing);
    setInitial(!initial);
  };

  const updateCoordinator = (field, text) => {
    setCoordinatorData({ ...coordinatorData, [field]: text });
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
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Icon name="gear" size={22} color={theme.colors.primary} />
          <Text style={styles.textProfile}>Edit Profile</Text>
        </View>
        <Image
          source={require("../../../assets/img/default-profile.png")}
          style={styles.imageProfile}
        />
        
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingBottom: 50,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text style={styles.textStyle}>Username</Text>
            <TextInput
              style={styles.textInputStyle}
              value={coordinatorData.userName}
              onChangeText={(text) => updateCoordinator("userName", text)}
              editable={isEditing}
            />
          </View>
          <View>
            <Text style={styles.textStyle}>New Password</Text>
            <TextInput
              style={styles.textInputStyle}
              value={coordinatorData.newPassword}
              secureTextEntry={true}
              onChangeText={(text) => updateCoordinator("newPassword", text)}
              placeholder="New password"
              editable={isEditing}
            />
            {!!passwordErrors.newPasswordError && (
              <Text style={styles.errorText}>
                {passwordErrors.newPasswordError}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.textStyle}>Confirm New Password</Text>
            <TextInput
              style={styles.textInputStyle}
              value={coordinatorData.confirmNewPassword}
              onChangeText={(text) =>
                updateCoordinator("confirmNewPassword", text)
              }
              secureTextEntry={true}
              placeholder="Confirm new password"
              editable={isEditing}
            />
            {!!passwordErrors.confirmNewPasswordError && (
              <Text style={styles.errorText}>
                {passwordErrors.confirmNewPasswordError}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.textStyle}>First Name</Text>
            <TextInput
              style={styles.textInputStyle}
              value={coordinatorData.firstName}
              onChangeText={(text) => updateCoordinator("firstName", text)}
              editable={isEditing}
            />
          </View>
          <View>
            <Text style={styles.textStyle}>Middle Initial</Text>
            <TextInput
              style={styles.textInputStyle}
              value={coordinatorData.middleInitial}
              onChangeText={(text) => updateCoordinator("middleInitial", text)}
              editable={isEditing}
            />
          </View>
          <View>
            <Text style={styles.textStyle}>Last Name</Text>
            <TextInput
              style={styles.textInputStyle}
              value={coordinatorData.lastName}
              onChangeText={(text) => updateCoordinator("lastName", text)}
              editable={isEditing}
            />
          </View>
          <View>
            <Text>Gender:</Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setSelectedValue(value);
                handleInputChange("gender", value);
              }}
              value={selectedValue}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
                  <RadioButton
                    value="male"
                    color={`${theme.colors.primary}`}
                    uncheckedColor={`${theme.colors.primary}`}
                    disabled={initial}
                  />
                  <Text style={styles.labelText}>Male</Text>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
                  <RadioButton
                    value="female"
                    color={`${theme.colors.primary}`}
                    uncheckedColor={`${theme.colors.primary}`}
                    disabled={initial}
                  />
                  <Text style={styles.labelText}>Female</Text>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
                  <RadioButton
                    value="others"
                    color={`${theme.colors.primary}`}
                    uncheckedColor={`${theme.colors.primary}`}
                    disabled={initial}
                  />
                  <Text style={styles.labelText}>Others</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <Birthday onValueChange={handleBirthDateChange} disabled={initial} />
          <View style={{ flex: 1, marginHorizontal: 20, alignSelf: "stretch" }}>
            <Text style={styles.textStyle}>Phone Number</Text>
            <TextInput
              style={styles.textInputStyle}
              keyboardType="numeric"
              value={coordinatorData.phoneNumber}
              onChangeText={(text) => handleInputChange("phoneNumber", text)}
              editable={isEditing}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 5,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.textStyle}>Street</Text>
              <TextInput
                style={styles.textInputStyleRow}
                value={coordinatorData.street}
                onChangeText={(text) => handleInputChange("street", text)}
                editable={isEditing}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.textStyle}>Barangay</Text>
              <TextInput
                style={styles.textInputStyleRow}
                value={coordinatorData.barangay}
                onChangeText={(text) => handleInputChange("barangay", text)}
                editable={isEditing}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              paddingBottom: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.textStyle}>City</Text>
              <TextInput
                style={styles.textInputStyleRow}
                value={coordinatorData.city}
                onChangeText={(text) => handleInputChange("city", text)}
                editable={isEditing}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.textStyle}>Province</Text>
              <TextInput
                style={styles.textInputStyleRow}
                value={coordinatorData.province}
                onChangeText={(text) => handleInputChange("province", text)}
                editable={isEditing}
              />
            </View>
          </View>
          <Button
            title={isEditing ? "Save Changes" : "Edit"}
            onPress={handleEditProfile}
          />
        </ScrollView>
        </View>
        
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "15%",
    gap: 15,
  },
  textProfile: {
    fontSize: 20,
    fontWeight: "bold",
  },
  imageProfile: {
    height: 100,
    width: 100,
  },
  textInputStyle: {
    zIndex: -1,
    borderColor: "#44483E",
    borderBottomWidth: 2,
    backgroundColor: "#F1F1EA",
    height: 45,
    marginTop: -15,
    margin: 10,
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "500",
    width: 300,
  },
  textInputStyleRow: {
    zIndex: -1,
    borderColor: "#44483E",
    borderBottomWidth: 2,
    backgroundColor: "#F1F1EA",
    height: 45,
    marginTop: -15,
    margin: 10,
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "500",
    width: 150,
  },
  textStyle: {
    marginLeft: 15,
    paddingTop: 10,
    fontSize: 12,
    color: "#44483E",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 15,
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
    bottom: -30,
    zIndex: -1,
  },
  bottomWavy: {
    position: "absolute",
    bottom: -120,
    left: -300,
    zIndex: -1,
  },
 
});

export default EditProfileCoordinator;
