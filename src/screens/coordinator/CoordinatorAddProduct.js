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
import { Path, Svg } from "react-native-svg";
const CoordinatorAddProduct = ({ route }) => {
  const localhost = ipAddress;
  const { coordinator } = route.params;
  const navigation = useNavigation();
  const imageSource = {
    uri: `${localhost}/img/product/${coordinator.ProductImage}`,
  };
  const [productUri, setProductUri] = useState(imageSource);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <ScrollView
       >
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
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 25,
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

export default CoordinatorAddProduct;
