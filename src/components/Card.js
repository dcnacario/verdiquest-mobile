import React from "react";
import {View, StyleSheet, Text, Image} from 'react-native';
import Button from "./Button";
import { Title } from "react-native-paper";



const Card = ({title, difficulty, img, description}) => {
    return (
        <View style={styles.container}>
            <View>
                <Image />
                <Text>{title}</Text>
                <Text>{difficulty}</Text>
            </View>
            <View>
                <Image />
                <Text>{description}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', gap: 10, marginTop: 20}}>
                <Button title="Remove" color="white"/>
                <Button title="View"/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 15,
    },
});


export default Card;