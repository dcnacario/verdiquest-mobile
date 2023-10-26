import React from "react";
import {Text, View, StyleSheet} from 'react-native';

const Home = ({route, navigation}) => {
    const { user } = route.params;

    return (
        <View>
             <Text>Welcome, {user.Email}!</Text>
        </View>
    );
}

const styles = StyleSheet.create({});

export default Home;