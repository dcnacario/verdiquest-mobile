import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import { theme } from "../../assets/style";



const PointCard = ({points}) => {
    return (
        <View>
            <View style={styles.container}>
                <Text>{points} VP</Text>
                <Text>Available Points</Text>
                <Text>October 29, 2023</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        height: 100,
        width: 150,
        backgroundColor: theme.colors.pointCardBackground,
        borderRadius: 10,
    },
});


export default PointCard;