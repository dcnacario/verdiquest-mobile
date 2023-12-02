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
import { theme } from "../../../assets/style";
import * as ImagePicker from "expo-image-picker";
import ipAddress from "../../database/ipAddress";
import Button from "../../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const CoordinatorAddProduct = ({ route }) => {
  const localhost = ipAddress;
  const navigation = useNavigation();
  const [productUri, setProductUri] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { coordinator } = route.params;
  const imageSource = {
    uri: `${localhost}/img/product/${coordinator.ProductImage}`,
  };

  const [productData, setProductData] = useState({
    organizationId: coordinator.OrganizationId,
    productName: "",
    productDescription: "",
    productSize: "",
    productQuantity: "",
    pointsRequired: "",
  });

  const updateProductData = (field, value) => {
    setProductData({ ...productData, [field]: value });
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "You need to allow access to your photos to upload an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setProductUri({ uri: result.assets[0].uri });
    }
  };

  const uploadImage = async () => {
    let formData = new FormData();
    formData.append("filePath", "/images/product");
    for (const key in productData) {
      if (productData.hasOwnProperty(key)) {
        formData.append(key, productData[key]);
      }
    }
    formData.append("image", {
      uri: productUri.uri,
      type: "image/jpeg",
      name: "upload.jpg",
    });

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${localhost}/coordinator/upload/insertProduct`,
        formData
      );

      const result = await response.data;
      navigation.navigate("CoordinatorProduct", { coordinator: coordinator });
    } catch (error) {
      console.error("Error during image upload: ", error.message);
      return null;
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.imagePicker}>
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <Icon name="camera" size={24} color="black" />
          </TouchableOpacity>
          {/* If there's an imageUri, show the image */}
          {productUri && <Image source={productUri} style={styles.image} />}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateProductData("productName", text)}
            value={productData.productName}
            placeholder="Enter product name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            onChangeText={(text) =>
              updateProductData("productDescription", text)
            }
            value={productData.productDescription}
            placeholder="Enter product description"
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Size (L x W x H)</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateProductData("productSize", text)}
            value={productData.productSize}
            placeholder="Enter product size"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Quantity</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateProductData("productQuantity", text)}
            value={productData.productQuantity}
            placeholder="Enter product quantity"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Points Required</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateProductData("pointsRequired", text)}
            value={productData.pointsRequired}
            placeholder="Enter required VerdiPoints"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Save"
            onPress={uploadImage}
            color="#3D691B"
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
    backgroundColor: theme.colors.background,
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
    left: 60,
    bottom: 5,
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
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 25,
  },
});

export default CoordinatorAddProduct;
