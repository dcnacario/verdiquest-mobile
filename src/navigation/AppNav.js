import {View, Text, ActivityIndicator} from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppTabNav';
import Home from '../screens/Home';


const AppNav = () => {
    const {isLoading, userToken} = useContext(AuthContext);


    if(isLoading) {
        <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size={'large'}/>
        </View>
    }
    return (
        <NavigationContainer>
            {userToken !== null ? <Home/> : <AuthStack/>}
        </NavigationContainer>
    );
}

export default AppNav;