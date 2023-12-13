import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import ProductCard from "../../components/ProductCard";
import axios from "axios";
import ipAddress from "../../database/ipAddress";
import { Path, Svg } from "react-native-svg";
const CoordinatorProduct = ({ route }) => {
  const navigation = useNavigation();
  const localhost = ipAddress;
  const { coordinator } = route.params;

  //Use States
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedProducts, setFetchProducts] = useState([]);
  const isFocused = useIsFocused();
  const [numberOfRewards, setNumberOfRewards] = useState(0);

  const goCreateProduct = () => {
    navigation.navigate("CoordinatorAddProduct", { coordinator: coordinator });
  };
  const goToView = (item) => {
    navigation.navigate("CoordinatorViewProduct", {
      dataProduct: item,
      coordinator: coordinator,
    });
  };

  const canCreateReward = (status, numOfProducts) => {
    if (status === "Inactive" && numOfProducts >= 2) return true;
    else if (status === "Active" && numOfProducts >= 6) return true;
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
      setNumberOfRewards(fetchProducts.length);
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
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Button
            title="+ Add"
            onPress={goCreateProduct}
            disabled={canCreateReward(
              coordinator.SubscriptionStatus,
              numberOfRewards
            )}
          />
        </View>
        <Text style={styles.textStyle}>Rewards</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={styles.divider}></View>
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
                  onPress={() => goToView(item)}
                />
              )}
              keyExtractor={(item) => item.ProductId}
              numColumns={2}
            />
          ) : (
            <Text>No products yet for this organization.</Text>
          )}
        </View>
      </View>
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
    paddingVertical: 50,
    backgroundColor: theme.colors.background,
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    paddingTop: StatusBar.currentHeight + 80,
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
    zIndex: 1,
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#161616",
    marginTop: -10,
  },
});

export default CoordinatorProduct;
