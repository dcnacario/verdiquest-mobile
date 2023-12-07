import React, { useState, useEffect } from "react";
import RewardCard from '../components/RewardCard';
import PointCard from '../components/PointCard'; 
import { theme } from "../../assets/style";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ipAddress from "../database/ipAddress";
import { useIsFocused } from '@react-navigation/native';
import { Path, Svg } from "react-native-svg";
import axios from "axios";

const ProductDetails = ({ route }) => {

    const localhost = ipAddress;
    const { product, user } = route.params;
    const [userPoint, setUserPoints] = useState('0');
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const fetchVerdiPoints = async () => {
        try {
        const response = await axios.get(`${localhost}/user/fetchVerdiPoints/${user.UserId}`);
        if (response.data.success) {
            setUserPoints(response.data.verdiPoints.toString());
        } else {
            console.log("Failed to fetch VerdiPoints");
        }
        } catch (error) {
        console.error("Error fetching VerdiPoints:", error);
        }
    };

    const formatPoints = (points) => {
        return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    useEffect(() => {
        if (isFocused && user && user.UserId) {
            fetchVerdiPoints();
        }
    }, [isFocused, user]);

    const handleRedeemPress = () => {
        navigation.navigate('ProductRedeem', { product: product, user: user }); 

    };

    console.log(product.ProductImage)
    const userPointsNumber = userPoint ? Number(userPoint.replace(/,/g, '')) : 0;
    const hasEnoughPoints = userPointsNumber >= product.PointsRequired;

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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.pointCardContainer}>
                <PointCard points={formatPoints(userPoint)} />
            </View>
            <View style={styles.rewardCardContainer}>
                <RewardCard
                    imageUrl={`${localhost}/img/product/${product.ProductImage}`}
                    productName={product.ProductName}
                    requiredPoints={product.PointsRequired}
                    userPoints={userPointsNumber}
                />
            </View>
            <Text style={styles.descriptionTitle}>Product Description</Text>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                    {product.ProductDescription}
                </Text>
            </View>
            {
                hasEnoughPoints ? (
                    <View style={styles.redeemContainer}>
                    <TouchableOpacity style={styles.earnPointsButton} onPress={handleRedeemPress}>
                        <Text style={styles.earnPointsButtonText}>REDEEM</Text>
                    </TouchableOpacity>
                    <View style={styles.eligibleTextContainer}>
                        <Text style={styles.sufficientBalanceText}>You are now eligible to redeem this {product.ProductName}</Text>
                    </View>
                    </View>
                ) : (
                    <Text style={styles.insufficientBalanceText}>Ineligible to redeem, insufficient balance</Text>
                )
            }
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
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        paddingVertical: 20,
    },
    pointCardContainer: {
        flexDirection: 'row',
        width: 200,
        height: 100,
        alignItems: 'center',
        margin: 10,
        borderRadius: 15,
    },
    rewardCardContainer: {
        width: 750,
        alignItems: 'center',
        marginBottom: 20,
    },
    descriptionContainer: {
        backgroundColor: '#E9EFC0',
        borderRadius: 10,
        padding: 16,
        width: '80%', 
        marginBottom: 10,
    },
    descriptionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333', 
        alignSelf: 'flex-start', 
        marginLeft: 40, 
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 14, 
    },
    
    redeemContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    earnPointsButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        maxWidth: 250,
    },
    earnPointsButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    eligibleTextContainer: {
        width: 250,
        alignItems: 'center',
        marginTop: 10,
    },
    sufficientBalanceText: {
        color: 'green',
        fontSize: 12,
        textAlign: 'center', 
    },
    insufficientBalanceText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 20,
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
        bottom: -30,
        zIndex: 0,
      },
});

export default ProductDetails;