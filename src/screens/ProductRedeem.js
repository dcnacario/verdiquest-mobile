import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Image, Text, Alert, TouchableOpacity } from "react-native";
import ipAddress from "../database/ipAddress";
import defaultImage from '../../assets/img/default-image.png';
import axios from "axios";

const ProductRedeem = ({ route }) => {
    const localhost = ipAddress;
    const { product, user } = route.params;
    const [productSize, setProductSize] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isAlreadyRedeemed, setIsAlreadyRedeemed] = useState(false);

    useEffect(() => {
        checkIfAlreadyRedeemed();
    }, []);

    const checkIfAlreadyRedeemed = async () => {
        try {
            const response = await axios.get(`${localhost}/checkRedeemStatus/${user.UserId}/${product.ProductId}`);
            if (response.data.success && response.data.isRedeemed) {
                setIsAlreadyRedeemed(true);
                Alert.alert("Notice", "This product has already been redeemed.");
            }
        } catch (error) {
            console.error("Error checking redeem status:", error);
        }
    };

    const handleRedeem = async () => {
      if (isAlreadyRedeemed) {
          Alert.alert("Notice", "This product has already been redeemed.");
          return;
      }
      if (!productSize.trim()) {
          Alert.alert("Validation Error", "Product size is required");
          return;
      }
      if (!contactNumber.trim()) {
          Alert.alert("Validation Error", "Contact number is required");
          return;
      }
      if (!deliveryAddress.trim()) {
          Alert.alert("Validation Error", "Delivery address is required");
          return;
      }

      try {
          const response = await axios.post(`${localhost}/user/redeemProduct`, {
              userId: user.UserId,
              productId: product.ProductId,
              productSize,
              contactNumber,
              deliveryAddress
          });

          if (response.data.success) {
              Alert.alert("Success", "Product redeemed successfully");
          } else {
              Alert.alert("Error", response.data.message);
          }
      } catch (error) {
          console.error("Axios error:", error.response.data);
          Alert.alert("Error", "An error occurred while redeeming the product");
      }
  };

    return (
        <View style={styles.background}>
            <Image source={product.ProductImage ? { uri: `${localhost}/img/product/${product.ProductImage}` } : defaultImage} style={styles.imageStyle} />
            <View style={styles.eventDetailsContainer}>
                <Text style={styles.headerText}>Delivery Details</Text>

                <Text style={styles.label}>Product Size</Text>
                <TextInput
                    style={styles.inputStyle}
                    value={productSize}
                    onChangeText={setProductSize}
                    placeholder="Enter product size"
                />

                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                    style={styles.inputStyle}
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    placeholder="Enter contact number"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Delivery Address</Text>
                <TextInput
                    style={styles.inputStyle}
                    value={deliveryAddress}
                    onChangeText={setDeliveryAddress}
                    placeholder="Enter delivery address"
                />

                <TouchableOpacity style={styles.confirmButton} onPress={handleRedeem}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f5f5f5', 
  },
  eventDetailsContainer: {
    backgroundColor: "rgba(123, 144, 75, 0.25);",
    padding: 30,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  imageStyle: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 100 / 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    alignSelf: "center",
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: 'bold',
    color: "#44483E",
    marginTop: 10,
  },
  inputStyle: {
    alignSelf: "stretch",
    borderColor: "#44483E",
    borderWidth: 1,
    borderRadius: 12,
    height: 45,
    marginBottom: 10,
    padding: 10,
    fontSize: 14,
    color: "#444",
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    width: "100%",
  },
  confirmButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },
});

export default ProductRedeem;