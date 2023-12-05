import React, { useState, useEffect } from "react";
import RewardCard from '../components/RewardCard';
import PointCard from '../components/PointCard'; 
import { theme } from "../../assets/style";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ipAddress from "../database/ipAddress";
import { useIsFocused } from '@react-navigation/native';

import axios from "axios";

const ProductDetails = ({ route }) => {

    const localhost = ipAddress;
    const { product, user } = route.params;
    const [userPoint, setUserPoints] = useState('0');
    const isFocused = useIsFocused();
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

    // Format points
    const formatPoints = (points) => {
        return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Effect hook
    useEffect(() => {
        if (isFocused && user && user.UserId) {
            fetchVerdiPoints();
        }
    }, [isFocused, user]);

    const userPointsNumber = userPoint ? Number(userPoint.replace(/,/g, '')) : 0;
    const hasEnoughPoints = userPointsNumber >= product.PointsRequired;

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <PointCard points={formatPoints(userPoint)} />
        <RewardCard
            imageUrl={`${localhost}/img/product/${product.ProductImage}`}
            productName={product.ProductName}
            productDescription={product.ProductDescription}
            requiredPoints={product.PointsRequired}
            userPoints={userPointsNumber}
        />
        {hasEnoughPoints ? (
            <TouchableOpacity style={styles.earnPointsButton}>
            <Text style={styles.earnPointsButtonText}>REDEEM</Text>
            </TouchableOpacity>
        ) : (
            <Text style={styles.insufficientBalanceText}>
            Ineligible to redeem, insufficient balance
            </Text>
        )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'center',
    },
});

export default ProductDetails;
