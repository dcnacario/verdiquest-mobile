import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import ipAddress from "../../database/ipAddress";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import DeleteButton from "../../components/DeleteButton";
import { theme } from "../../../assets/style";
import { Path, Svg } from "react-native-svg";
const CoordinatorViewProduct = ({ route }) => {
  const navigation = useNavigation();
  const { dataProduct, coordinator } = route.params;
  const localhost = ipAddress;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [initial, setInitial] = useState(true);
  const imageSource = {
    uri: `${localhost}/img/product/${dataProduct.ProductImage}`,
  };
  const [imageUri, setImageUri] = useState(imageSource);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

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

  //CREATING A CONFIRMATION MODAL FOR DELETING
  const ConfirmModal = ({ isVisible, onConfirm, onCancel, title }) => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={isVisible}
        onRequestClose={onCancel}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure to delete this Product?
            </Text>
            <Text style={styles.modalText}>{title}</Text>
            <View
              style={{ flexDirection: "row", alignSelf: "flex-end", gap: 10 }}
            >
              <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
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

  const deleteProduct = async () => {
    if (currentProductId) {
      try {
        const response = await axios.post(
          `${localhost}/coordinator/deleteProduct`,
          {
            productId: currentProductId,
          }
        );
        // Reset the current task ID after deletion
        setCurrentProductId(null);
        setModalVisible(false);
        navigation.navigate("CoordinatorProduct", { coordinator: coordinator });
      } catch (error) {
        console.error("Error deleting task!", error);
      }
    }
  };

  const promptdeleteProduct = (productId) => {
    setCurrentProductId(productId); // Set the current task ID
    setModalVisible(true); // Show the modal
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
      <ScrollView>
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
        <ConfirmModal
          isVisible={modalVisible}
          message="Are you sure you want to delete this item?"
          onConfirm={deleteProduct}
          onCancel={() => setModalVisible(false)}
        />

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
          <DeleteButton
            title={"Delete"}
            color="#BA1A1A"
            textColor="#FFFFFF"
            onPress={() => promptdeleteProduct(dataProduct.ProductId)}
          />

          <Button
            title={isEditing ? "Save" : "Edit"}
            onPress={handleEditSave}
            disabled={isSubmitting}
          />
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim the background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 10,
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
      bottom: -25,
      zIndex: -1,
    },
});

export default CoordinatorViewProduct;
