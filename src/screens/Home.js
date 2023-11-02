import React, { useState } from "react";
import {Text, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { theme } from "../../assets/style";
import PointCard from "../components/PointCard";
import { TouchableOpacity } from "react-native-gesture-handler";
import Card from "../components/Card";

const Home = ({route, navigation}) => {
    const { user } = route.params;

    const [userPoint, setUserPoints] = useState(0);

    const screenHeight = Dimensions.get('window').height;
    const paddingBottom = screenHeight * 0.15;

    return (
        <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: theme.colors.background, flex: 1}} contentContainerStyle
        ={{paddingBottom: paddingBottom}}>
            <View style={{flex: 1,}}>
                <View style={{flex: 1, marginTop: 10}}>
                    <View style={{flex: 1, flexDirection: 'row', gap: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20,}}>
                        <View style={styles.profileContainer}>
                        </View>
                        <PointCard points={userPoint}/>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttonStyle}>
                            <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Ongoing Tasks</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 24, color: theme.colors.primary, fontWeight: 'bold',  marginVertical: 20,}}>Daily Tasks</Text>         
                    </View>
                    <View style={{flex: 1, flexDirection: 'column', gap: 30}}>
                        <Card title="Environment Cleaning" difficulty="Easy" description="lorem ipsum"></Card>   
                        <Card title="Environment Damage" difficulty="Very Easy" description="lorem ipsum"></Card>
                        <Card title="Environment Damage" difficulty="Very Easy" description="lorem ipsum"></Card>
                    </View>          
                </View>
            </View>
        </ScrollView>
        
    );
}

const styles = StyleSheet.create({
    img: {
        height: 120,
        width: 120,
    },
    profileContainer: {
        height: 100,
        width: 100,
        borderRadius: 100/2,
        backgroundColor: theme.colors.primary,
    },
    buttonStyle: {
        flex: 1,
        marginHorizontal: 30,
        backgroundColor: '#3D691B',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
});

export default Home;