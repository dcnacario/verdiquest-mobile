import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import ipAddress from "../../database/ipAddress";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import DeleteButton from "../../components/DeleteButton";

const CoordinatorViewProduct = ({ route }) => {
  const navigation = useNavigation();
  const { dataProduct } = route.params;
  const localhost = ipAddress;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [initial, setInitial] = useState(true);
  const imageSource = {
    uri: `${localhost}/img/product/${dataProduct.ProductImage}`,
  };
  const [imageUri, setImageUri] = useState(imageSource);

  const [updateData, setUpdateData] = useState({
    organizationId: dataProduct.OrganizationId,
    productName: dataProduct.ProductName,
    productDescription: dataProduct.ProductDescription,
    productSize: dataProduct.ProductSize,
    productQuantity: dataProduct.ProductQuantity.toString(),
    pointsRequired: dataProduct.PointsRequired.toString(),
    productId: dataProduct.ProductId,
  });

  const updateField = (field, value) => {
    setUpdateData({ ...updateData, [field]: value });
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
    formData.append("filePath", "/images/product");
    formData.append("productId", updateData.productId);
    formData.append("image", {
      uri: imageUri.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      const response = await axios.post(
        `${localhost}/coordinator/upload/updateProductImage`,
        formData
      );

      if (response.data.success && response.data.newImageUri) {
        setImageUri({
          uri: `${localhost}/img/product/${response.data.newImageUri}`,
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

  const handleEditSave = async () => {
    if (isEditing) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await updateImage();
        const response = await axios.post(
          `${localhost}/coordinator/updateProduct`,
          updateData
        );
        console.log("Update response:", response.data);
      } catch (error) {
        console.error("Error updating product:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
    setIsEditing(!isEditing);
    setInitial(!initial);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.imagePicker}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={pickImage}
            disabled={initial}
          >
            <Icon name="camera" size={24} color="black" />
          </TouchableOpacity>
          {/* If there's an imageUri, show the image */}
          {imageUri && <Image source={imageUri} style={styles.image} />}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateField("productName", text)}
            value={updateData.productName}
            placeholder="Enter product name"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            onChangeText={(text) => updateField("productDescription", text)}
            value={updateData.productDescription}
            placeholder="Enter product description"
            multiline
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Size (L x W x H)</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateField("productSize", text)}
            value={updateData.productSize}
            placeholder="Enter product size"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Quantity</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateField("productQuantity", text)}
            value={updateData.productQuantity}
            placeholder="Enter product quantity"
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>VerdiPoints</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateField("pointsRequired", text)}
            value={updateData.pointsRequired.toString()}
            placeholder="Enter VerdiPoints"
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>

        <View style={styles.buttonRow}>
          <DeleteButton title={"Delete"} color="#BA1A1A" textColor="#FFFFFF" />

          <Button
            title={isEditing ? "Save" : "Edit"}
            onPress={handleEditSave}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
    borderWidth: 1,
    borderColor: "#44483E",
    backgroundColor: "#e1e1e1",
    marginTop: 15,
    marginBottom: 15,
    alignSelf: "center", // Center the container
  },
  image: {
    width: 118, // Match the container width
    height: 118, // Match the container height
    borderRadius: 118 / 2, // Half of width/height to make it round
    resizeMode: "cover",
  },
  cameraButton: {
    position: "absolute",
    left: 70,
    bottom: 2.5,
    backgroundColor: "lightgrey",
    borderRadius: 15,
    padding: 8,
    zIndex: 1, // Ensure the camera button is always on top
  },
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 10,
    // Additional styles if needed
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    // Adjust width as needed, or remove for auto width
  },
  deleteButton: {
    backgroundColor: "#d9534f", // Red color for the delete button
    // Additional styles for the delete button
  },
  editButton: {
    backgroundColor: "#5cb85c", // Green color for the edit button
    // Additional styles for the edit button
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    // Additional text styles if needed
  },
});

export default CoordinatorViewProduct;
