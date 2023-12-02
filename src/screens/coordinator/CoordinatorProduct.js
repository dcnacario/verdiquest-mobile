import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import ProductCard from "../../components/ProductCard";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import { useIsFocused } from "@react-navigation/native";

const CoordinatorProduct = ({ route }) => {
  const navigation = useNavigation();
  const localhost = ipAddress;
  const { coordinator } = route.params;

  //Use States
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedProducts, setFetchProducts] = useState([]);
  const isFocused = useIsFocused();

  const goCreateProduct = () => {
    navigation.navigate("CoordinatorAddProduct", { coordinator: coordinator });
  };

  //FETCHING PRODUCT FROM DB
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${localhost}/coordinator/fetchProducts`,
        {
          organizationId: coordinator.OrganizationId,
        }
      );
      setFetchProducts(response.data.fetchTable);
    } catch (error) {
      console.error("Error fetching product table", error);
      return []; // Return an empty array in case of an error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchProducts();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Button title="+ Add" onPress={goCreateProduct} />
        </View>
        <Text style={styles.textStyle}>Rewards</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={styles.card}>
        <View>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} /> // Loading indicator)
          ) : fetchedProducts != null && fetchedProducts.length > 0 ? (
            <FlatList
              data={fetchedProducts}
              renderItem={({ item }) => (
                <ProductCard
                  title={item.ProductName}
                  imageUrl={item.ProductImage}
                  quantity={item.ProductQuantity}
                  onPress={() => goToMember(item)}
                />
              )}
              keyExtractor={(item) => item.ProductId}
              numColumns={2}
            />
          ) : (
            <Text>No members yet for this organization.</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: theme.colors.background,
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  cardRow: {
    flexDirection: "row", // Aligns children in a row
    justifyContent: "space-around", // Distributes children evenly with space around them
    padding: 10, // Space inside the row view
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
  },
  textStyle: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scrollView: {
    width: "90%", // Ensures ScrollView takes full width
  },
});

export default CoordinatorProduct;
