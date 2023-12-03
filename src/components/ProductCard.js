import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ipAddress from "../database/ipAddress";
// Item card component
const ProductCard = ({ imageUrl, title, quantity, onPress }) => {
  const localhost = ipAddress;
  const uri = `${localhost}/img/product/${imageUrl}`;
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: uri }} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.quantity}>Qty: {quantity}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10, // Adjust the width as needed
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    color: "#000",
  },
  quantity: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
});

export default ProductCard;
