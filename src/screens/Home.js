import React from "react";
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import { theme } from "../../assets/style";
import PointCard from "../components/PointCard";

const Home = ({route, navigation}) => {
    const { user } = route.params;

    return (
        <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: theme.colors.background, flex: 1}}>
            <View style={{flex: 1,}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <PointCard />
                    <Image style={styles.img} source={require('../../assets/img/default-profile.png')}/>
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