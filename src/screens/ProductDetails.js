import React, { useState, useEffect } from "react";
import RewardCard from '../components/RewardCard';
import PointCard from '../components/PointCard'; 
import { theme } from "../../assets/style";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ipAddress from "../database/ipAddress";
import { useIsFocused, useNavigation } from '@react-navigation/native';

import axios from "axios";

const ProductDetails = ({ route }) => {

    const localhost = ipAddress;
    const { product, user } = route.params;
    const [userPoint, setUserPoints] = useState('0');
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    console.log("User:", user);
    console.log("Product:", product);

    // Fetch user points
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

    const userPointsNumber = userPoint ? Number(userPoint.replace(/,/g, '')) : 0;
    const hasEnoughPoints = userPointsNumber >= product.PointsRequired;

    return (
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
});

export default ProductDetails;
