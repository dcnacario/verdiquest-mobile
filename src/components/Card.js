import React from "react";
import {View, StyleSheet, Text, Image} from 'react-native';
import Button from "./Button";



const Card = () => {
    return (
        <View>
            <View>
                <Image />
                <Text>Environmental Cleaning</Text>
                <Text>Easy</Text>
            </View>
            <View>
                <Image />
                <Text>Description:</Text>
            </View>
            <View>
                <Button />
                <Button />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

});


export default Card;