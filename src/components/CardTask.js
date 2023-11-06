import React from "react";
import {View, StyleSheet, Text, Image} from 'react-native';
import Button from "./Button";
import defaultImage from '../../assets/img/default-image.png';



const CardTask = ({title, difficulty, img, description, onPress}) => {
    return (
        <View style={styles.container}>
            <View>
                <Image />
                <Text style={styles.textStyle}>{title}</Text>
                <Text>{difficulty}</Text>
            </View>
            <View style={{flex: 1}}>
            {img ? <Image defaultSource={defaultImage} source={img} style={styles.imageStyle}/> : <Image source={defaultImage} style={styles.imageStyle}/>}
                <Text>{description}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', gap: 10, marginTop: 20}}>
                <Button title="View" onPress={onPress}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F7F2FA',
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
        marginVertical: 20,
    },
    imageStyle: {
        width: '100%',
        height: 280,  
        resizeMode: 'center',
        marginVertical: 10,
        borderRadius: 10,
    },
    textStyle: {
        fontWeight: 'bold',
    },
});


export default CardTask;