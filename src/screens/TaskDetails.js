import React from "react";
import {View, StyleSheet, Image, Text} from 'react-native';
import Details from "../components/Details";
import Button from "../components/Button";
import defaultImage from '../../assets/img/default-image.png';


const TaskDetails = ({route, img}) => {
    const {user, title} = route.params;
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <View style={{position:'absolute', right: 100, left: 100, bottom: 100, top: 100, elevation: 2,}}>
                    <Button title="Back" color="#F4F4ED" icon='arrow-back' textColor='#3D691B'/>
                </View>
                {img ? <Image defaultSource={defaultImage} source={img} style={styles.imageStyle}/> : <Image source={defaultImage} style={styles.imageStyle}/>}
            </View>
            <Text style={styles.textStyle}>{title}</Text>
            <Details timeCompleted='' />
            <View style={{alignSelf: 'center'}}>
                <Button title='ACCEPT' />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    imageStyle: {
        width: '100%',
        height: 250,
        resizeMode: 'center',
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
    },
    imageContainer: {
        margin: 20,
    },
    textStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 28,
    },
});

export default TaskDetails;