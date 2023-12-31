import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Image, Text, Alert,TouchableOpacity, } from "react-native";
import Modal from "react-native-modal";
import ipAddress from "../database/ipAddress";
import defaultImage from "../../assets/img/default-image.png";
import axios from "axios";

const ProductRedeem = ({ route }) => {
    const localhost = ipAddress;
    const { product, user } = route.params;
    const [productSize, setProductSize] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isOutOfStockModalVisible, setOutOfStockModalVisible] = useState(false);

    const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(
        false
    );

    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

    const handleRedeemConfirmation = () => {
        setConfirmationModalVisible(true);
    };

    const handleConfirmRedeem = async () => {
        if (!productSize.trim() || !contactNumber.trim() || !deliveryAddress.trim()) {
            Alert.alert("Validation Error", "Please fill in all required fields");
            return;
        }
    
        try {
            const response = await axios.post(`${localhost}/user/redeemProduct`, {
                userId: user.UserId,
                productId: product.ProductId,
                productSize,
                contactNumber,
                deliveryAddress,
            });
            
            console.log(response.data)
    
            if (response.data.success) {
                setSuccessModalVisible(true);
            } else {
                if (response.data.message === "Product is out of stock") {
                    setOutOfStockModalVisible(true);
                } else {
                    Alert.alert("Error", response.data.message || "An error occurred while redeeming the product");
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === "Product is out of stock") {
                setOutOfStockModalVisible(true);
              } else {
                console.error("Axios error:", error.response ? error.response.data : error.message);
                Alert.alert("Error", "An error occurred while redeeming the product");
              }
            
        } finally {
            setConfirmationModalVisible(false);
        }
    };
    
    const toggleConfirmationModal = () => {
        setConfirmationModalVisible(!isConfirmationModalVisible);
    };

    const toggleSuccessModal = () => {
        setSuccessModalVisible(!isSuccessModalVisible);
    };

    const toggleOutOfStockModal = () => {
        setOutOfStockModalVisible(!isOutOfStockModalVisible);
    };

    return (
        <View style={styles.background}>
        <Image
            source={
            product.ProductImage
                ? { uri: `${localhost}/img/product/${product.ProductImage}` }
                : defaultImage
            }
            style={styles.imageStyle}
        />
            <View style={styles.productDetailsContainer}>
                <Text style={styles.headerText}>Delivery Details</Text>

                <Text style={styles.label}>Product Size</Text>
                <TextInput style={styles.inputStyle} value={productSize} onChangeText={setProductSize} placeholder="Enter product size"/>

                <Text style={styles.label}>Contact Number</Text>
                <TextInput style={styles.inputStyle} value={contactNumber} onChangeText={setContactNumber} placeholder="Enter contact number" keyboardType="phone-pad"/>

                <Text style={styles.label}>Delivery Address</Text>
                <TextInput style={styles.inputStyle} value={deliveryAddress} onChangeText={setDeliveryAddress} placeholder="Enter delivery address"/>

                <TouchableOpacity style={styles.confirmButton} onPress={handleRedeemConfirmation}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
            <Modal isVisible={isConfirmationModalVisible} onBackdropPress={toggleConfirmationModal}>
                <View style={styles.confirmationModal}>
                    <Text style={styles.confirmationText}>
                        Are you sure you want to redeem {product.ProductName}?
                    </Text>
                    <View style={styles.confirmationButtons}>
                        <TouchableOpacity style={styles.confirmButtonModal} onPress={handleConfirmRedeem}>
                            <Text style={styles.confirmButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={toggleConfirmationModal}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={isSuccessModalVisible} onBackdropPress={toggleSuccessModal}>
                <View style={styles.successModal}>
                <Text style={styles.successText}>
                    Product redeemed successfully!
                </Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={toggleSuccessModal}
                >
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                </View>
            </Modal>
            <Modal isVisible={isOutOfStockModalVisible} onBackdropPress={toggleOutOfStockModal}>
                <View style={styles.outOfStockModal}>
                    <Text style={styles.outOfStockText}>
                        Sorry, this product is currently out of stock.
                    </Text>
                    <TouchableOpacity style={styles.closeButton} onPress={toggleOutOfStockModal}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    productDetailsContainer: {
        backgroundColor: "rgba(123, 144, 75, 0.25)",
        padding: 30,
        width: "100%",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 20,
    },
    imageStyle: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        borderRadius: 100 / 2,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 2,
        alignSelf: "center",
    },
    label: {
        alignSelf: "flex-start",
        fontSize: 16,
        fontWeight: "bold",
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
        backgroundColor: "#3D691B",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 20,
        width: "100%",
    },
    confirmButtonModal: {
        backgroundColor: "#3D691B",
        alignItems: "center",
        width: "25%",
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    confirmationModal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    confirmationText: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
    },
    confirmationButtons: {
        flexDirection: "row",
        justifyContent: "center",
    },
    cancelButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 10,
        margin: 10,
        alignItems: "center",
        width: "25%",
    },
    cancelButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    successModal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    successText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    closeButton: {
        backgroundColor: "#3D691B",
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    outOfStockModal: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    outOfStockText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
});

export default ProductRedeem;
