import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import ipAddress from "../database/ipAddress";
import { theme } from "../../assets/style";
import defaultProfile from "../../assets/img/verdiquestlogo-ver2.png";
import axios from "axios";

const EditProfileUser = ({ route }) => {
  const { user, personDetails } = route.params;
  const localhost = ipAddress;
  const [isEditing, setIsEditing] = useState(false);
  const [initial, setInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [userData, setUserData] = useState({
    email: user.Email,
    password: "",
    firstName: personDetails.FirstName,
    middleInitial: personDetails.Initial,
    lastName: personDetails.LastName,
    personId: personDetails.PersonId,
    userId: user.UserId,
    phoneNumber: personDetails.PhoneNumber,
  });
  const imageSource = {
    uri: `${localhost}/img/profilepicture/${user.ProfilePicture}`,
  };

  const [imageUri, setImageUri] = useState(imageSource);

  const [passwordError, setPasswordError] = useState(""); // State to store password error message

  const handleInputChange = (name, text) => {
    if (name === "password") {
      // Add password validation logic here
      if (text.length === 0) {
        setPasswordError("Password cannot be empty.");
      } else if (text.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
      } else {
        setPasswordError(""); // Clear the error message if the password is valid
      }
    }

    setUserData((prev) => ({ ...prev, [name]: text }));
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Request Change Denied!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (pickerResult.canceled) {
      return;
    }

    if (!pickerResult.canceled && pickerResult.assets) {
      const imageUri = pickerResult.assets[0].uri;
      // Validate the URI
      if (imageUri) {
        setImageUri({ uri: imageUri });
      } else {
        // Handle the case where the URI is not valid
        console.error("Selected image URI is invalid.");
      }
    }
  };

  const updateImage = async () => {
    if (!imageUri.uri) {
      console.error("Image URI is not valid for upload.");
      return null;
    }

    setIsUploading(true); // Start loading
    setIsSubmitting(true);

    let formData = new FormData();
    formData.append("filePath", "/images/profilepicture");
    formData.append("userId", userData.userId);
    formData.append("image", {
      uri: imageUri.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      const response = await axios.post(
        `${localhost}/coordinator/upload/updateProfilePicture`,
        formData
      );
      console.log("Image upload response:", response.data);
      if (response.data.success && response.data.newImageUri) {
        setImageUri({
          uri: `${localhost}/img/profilepicture/${response.data.newImageUri}`,
        });
      }
    } catch (error) {
      console.log("Error during image upload: ", error.message);
    } finally {
      await delay(3000);
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const handleEditSave = async () => {
    if (isEditing) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await updateImage();
        const response = await axios.post(
          `${localhost}/user/updatePerson`,
          userData
        );
        console.log("Update response:", response.data);
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
    setIsEditing(!isEditing);
    setInitial(!initial);
  };

  // Adjust styles and functionalities as per your needs
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="settings" size={24} color="green" />
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <Image
          source={
            userData.ProfilePicture == null && userData.ProfilePicture === ""
              ? defaultProfile
              : imageUri
          }
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.inputStyle}
        value={userData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        placeholder="example@gmail.com"
        editable={isEditing}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.inputStyle}
        value={userData.password}
        onChangeText={(text) => handleInputChange("password", text)}
        placeholder="Password"
        editable={isEditing}
        secureTextEntry={true}
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.inputStyle}
        value={userData.firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
        placeholder="First Name"
        editable={isEditing}
      />

      <Text style={styles.label}>Middle Initial</Text>
      <TextInput
        style={styles.inputStyle}
        value={userData.middleInitial}
        onChangeText={(text) => handleInputChange("middleInitial", text)}
        placeholder="Middle Initial"
        editable={isEditing}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.inputStyle}
        value={userData.lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
        placeholder="Last Name"
        editable={isEditing}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.inputStyle}
        value={userData.phoneNumber}
        onChangeText={(text) => handleInputChange("phoneNumber", text)}
        placeholder="ex. 09123456789"
        editable={isEditing}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleEditSave}>
        <Text style={styles.saveButtonText}>
          {isEditing ? "Save Changes" : "Edit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginLeft: 8,
  },
  profileImageContainer: {
    alignItems: "center",
    marginTop: 16,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    left: 40,
    bottom: 10,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    color: "#44483E",
    marginTop: 5,
  },
  inputStyle: {
    borderColor: "#44483E",
    borderWidth: 1,
    height: 45,
    marginBottom: 5,
    padding: 10,
    fontSize: 14,
    color: "#444",
  },
  saveButton: {
    backgroundColor: theme.colors.primary, // Use the color scheme from the image
    borderRadius: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
    alignSelf: "center",
    marginBottom: 5,
    width: "30%",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default EditProfileUser;
