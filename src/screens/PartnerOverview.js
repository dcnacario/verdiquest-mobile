import React from "react";
import {View, StyleSheet, Text, Image} from 'react-native';
import defaultImage from '../../assets/img/default-image.png';
import { theme } from "../../assets/style";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";



const PartnerOverview = ({img,route}) => {
    const navigation = useNavigation();

    const {user} = route.params;

    const handleJoinOrg = () => {
        navigation.navigate('SuccessJoin',{user:user});
    };

    return (
        <View style={styles.container}>
            {img ? <Image defaultSource={defaultImage} source={img} style={styles.imageStyle}/>: <Image source={defaultImage} style={styles.imageStyle}/>}
            <Text style={styles.headerStyle}>Organization Name</Text>
            <View style={styles.visionMissionContainer}>
                <Text style={styles.titleStyle}>About us</Text>
                <Text style={styles.textStyle}>Lorem Ipsum</Text>
                <Text style={styles.titleStyle}>Our Vision</Text>
                <Text style={styles.textStyle}>Lorem Ipsum</Text>
                <Text style={styles.titleStyle}>Our Mission</Text>
                <Text style={styles.textStyle}>Lorem Ipsum</Text>
            </View>
            <Button title={'BECOME A MEMBER'} onPress={handleJoinOrg}/>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 20
    },
    imageStyle: {
        width: '50%',
        height: 150,
        resizeMode: 'center',
        borderRadius: 15,
    },
    visionMissionContainer: {
        width: '80%',
        backgroundColor: '#89A744',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 30,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    textStyle: {
        color: 'white',
        marginBottom: 20,
    },
    headerStyle: {
        fontWeight: 'bold',
        fontSize: 24,
    }
});


export default PartnerOverview;