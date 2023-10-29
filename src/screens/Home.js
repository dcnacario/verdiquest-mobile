import React, { useState } from "react";
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import { theme } from "../../assets/style";
import PointCard from "../components/PointCard";
import Button from "../components/Button";

const Home = ({route, navigation}) => {
    const { user } = route.params;

    const [userPoint, setUserPoints] = useState(0);

    return (
        <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: theme.colors.background, flex: 1}}>
            <View style={{flex: 1,}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Image style={styles.img} source={require('../../assets/img/default-profile.png')}/>
                    <PointCard points={userPoint}/>
                    <Button />
                    <Text>Daily Tasks</Text>
                    
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: theme.colors.background,     
    },
    img: {
        height: 100,
        width: 100,
    },
});

export default Home;