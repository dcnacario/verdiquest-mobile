import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { theme } from "../../../assets/style";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import defaultImage from "../../../assets/img/default-image.png";
import { AuthContext } from "../../navigation/AuthContext";
import { useNavigation } from "@react-navigation/native";

const ViewOrganization = ({ route }) => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const localhost = ipAddress;
  const { coordinator } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [initial, setIsInitial] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const imageSource = {
    uri: `${localhost}/img/organization/${coordinator.OrganizationImage}`,
  };
  const [logo, setLogo] = useState(imageSource);

  const canEdit = coordinator.Rank === 1 ? true : false;

  const [editData, setEditData] = useState({
    orgImage: coordinator.OrganizationImage,
    orgName: coordinator.OrganizationName,
    orgAddress: coordinator.OrganizationAddress,
    orgType: coordinator.OrganizationType,
    orgId: coordinator.OrganizationId,
  });

  const updateOrganization = (field, text) => {
    setEditData({ ...editData, [field]: text });
  };

  //DELETION OF ORG ------------------------------------
  const deleteOrg = async (orgId) => {
    try {
      const response = await axios.post(`${localhost}/coordinator/deleteOrg`, {
        orgId: orgId,
      });
      await logout(navigation);
      return response.data;
    } catch (error) {
      console.error("Error deleting the org!", error);
    }
  };
  //---------------------------------------------------------

  const handleDeletePress = () => {
    setShowConfirmDelete(!showConfirmDelete);
  };

  const handleConfirmDelete = async () => {
    if (
      deleteConfirmationText.toUpperCase() ===
      coordinator.OrganizationName.toUpperCase()
    ) {
      await deleteOrg(editData.orgId);
      setShowConfirmDelete(false);
    } else {
      alert("Please type DELETE to confirm.");
    }
  };

  const handleEditPress = async () => {
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

    setLogo({ uri: pickerResult.assets[0].uri });
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateImage = async () => {
    if (!logo.uri) {
      console.error("Image URI is not valid for upload.");
      return null;
    }

    setIsUploading(true); // Start loading
    setIsSubmitting(true);

    let formData = new FormData();
    formData.append("filePath", "/images/organization");
    formData.append("organizationId", editData.orgId);
    formData.append("image", {
      uri: logo.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    try {
      const response = await axios.post(
        `${localhost}/coordinator/upload/imageUpload`,
        formData
      );

      if (response.data.success && response.data.newImageUri) {
        setLogo({
          uri: `${localhost}/img/organization/${response.data.newImageUri}`,
        });
      }
    } catch (error) {
      console.error("Error during image upload: ", error.message);
    } finally {
      await delay(3000);
      setIsUploading(false); // End loading
      setIsSubmitting(false);
    }
  };

  const handleEditOrganization = async () => {
    if (isEditing) {
      if (isSubmitting) return;
      setIsSubmitting(true);

      setIsInitial(false);

      try {
        // If the logo has been changed, upload it first
        let imagePath = null;
        if (logo.uri && logo.uri.startsWith("file:")) {
          imagePath = await updateImage();
          if (!imagePath) {
            throw new Error("Failed to upload image.");
          }
          editData.orgImage = imagePath;
        }

        const response = await axios.post(
          `${localhost}/coordinator/updateOrganization`,
          editData
        );
        console.log(response.data);
      } catch (error) {
        console.log("Error! updating the profile!", error);
      } finally {
        setIsSubmitting(false);
      }
    }
    setIsEditing(!isEditing);
    setIsInitial(!initial);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Organization Profile</Text>

      <View style={styles.logoContainer}>
        {coordinator.OrganizationImage != null ||
        coordinator.OrganizationImage ? (
          <Image source={logo} style={styles.logo} />
        ) : (
          <Image source={defaultImage} style={styles.logo} />
        )}
        <TouchableOpacity
          onPress={handleEditPress}
          style={styles.editIcon}
          disabled={initial}
        >
          <MaterialIcons name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ justifyContent: "flex-start" }}>
        <Text style={styles.textInput}>Organization Name</Text>
        <TextInput
          style={styles.inputStyle}
          value={editData.orgName}
          onChangeText={(text) => updateOrganization("orgName", text)}
          editable={isEditing}
        />
      </View>
      <View style={{ justifyContent: "flex-start" }}>
        <Text style={styles.textInput}>Orgnization Address</Text>
        <TextInput
          style={styles.inputStyle}
          value={editData.orgAddress}
          onChangeText={(text) => updateOrganization("orgAddress", text)}
          editable={isEditing}
        />
      </View>
      <View style={{ justifyContent: "flex-start" }}>
        <Text style={styles.textInput}>Organization Type</Text>
        <TextInput
          style={styles.inputStyle}
          value={editData.orgType}
          onChangeText={(text) => updateOrganization("orgType", text)}
          editable={isEditing}
        />
      </View>
      {canEdit && (
        <TouchableOpacity
          onPress={handleEditOrganization}
          style={styles.editButton}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isEditing ? "Save changes" : "Edit info"}
          </Text>
        </TouchableOpacity>
      )}
      <View style={{ marginVertical: 50 }}>
        {/* <Button
          title={"Delete"}
          color={"#BA1A1A"}
          onPress={() => confirmDeletion(coordinator.OrganizationId)}
        /> */}
        {showConfirmDelete ? (
          <View>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                Input Organization Name to Delete
              </Text>
            </View>
            <TextInput
              style={styles.inputStyle}
              value={deleteConfirmationText}
              onChangeText={setDeleteConfirmationText}
              placeholder="Type here in UPPERCASE"
            />
            <View>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Confirm Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          canEdit && (
            <TouchableOpacity onPress={handleDeletePress}>
              <Text style={{ color: "#BA1A1A", fontWeight: "bold" }}>
                Delete Organization
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 100 / 2,
  },
  editIcon: {
    position: "absolute",
    right: -10,
    bottom: -10,
  },

  editButton: {
    backgroundColor: "#3D691B", // Adjust background color accordingly
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
  },
  confirmationLabel: {
    fontSize: 12,
    backgroundColor: theme.colors.background,
  },
  deleteButton: {
    // A contrasting color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: "center", // Center the button in its container
  },
  deleteButtonText: {
    color: "#BA1A1A",
    fontSize: 14,
    fontWeight: "bold",
  },
  labelContainer: {
    position: "absolute",
    top: -23,
    left: 21,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  label: {
    fontSize: 12,
    color: "#496900", // color of the text
  },
});

export default ViewOrganization;
