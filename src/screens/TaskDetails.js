import React,{useState} from "react";
import {View, StyleSheet, Image, Text,Modal,TouchableOpacity} from 'react-native';
import Details from "../components/Details";
import Button from "../components/Button";
import defaultImage from '../../assets/img/default-image.png';
import { useNavigation } from "@react-navigation/native";



const TaskDetails = ({route, img}) => {
    const navigation = useNavigation();
    const [isAccepted, setIsAccepted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const onPressAccept = () => {
        setIsAccepted(true);
        setShowModal(true);

    };

    const onPressOngoingTask = () => {
        navigation.navigate('MyPoints', {user: user})
    };

    const onPressCancelTask = () => {
        setIsAccepted(false);
    };
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
            <View style={{ alignSelf: 'center', flexDirection: 'row' }}>
            {isAccepted ? (
                <>
                    <Button title='Ongoing' onPress={onPressOngoingTask} />
                    <View style={{ width: 50 }} />
                    <Button title='Cancel' onPress={onPressCancelTask} />
                </>
            ) : (
                <Button title='ACCEPT' onPress={onPressAccept} />
            )}
            <Modal
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onPress={() => setShowModal(false)}
                >
                    <View style={{ backgroundColor: '#7b904b', padding: 50, borderRadius: 10 }}>
                        <Text style={styles.textStyle}>Mission Accepted!</Text>
                    </View>
                </TouchableOpacity>
            </Modal>
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