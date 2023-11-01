import React from "react";
import {View, StyleSheet, Text, Image} from 'react-native';
import Button from "./Button";
import { Title } from "react-native-paper";
import DeleteButton from "./DeleteButton";



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
                <DeleteButton title="Remove"/>
                <Button title="View"/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F7F2FA',
        flex: 1,
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
});


export default Card;