import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useState, useEffect} from 'react';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);

    const login = async (email, password, navigation) => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://192.168.1.16:3000/login', {
                email: email,
                password: password,
            });
    
            const token = response.data.token;
            const user = response.data.user;
            
            await AsyncStorage.setItem('userToken', token);
            setUserToken(token);
    
            navigation.navigate('AppTabNav', { user: user });
            
        } catch(error) {
            console.error('Error during login:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'Failed to Login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        setIsLoading(true);
        // Note: You may also want to invalidate the token on the server side
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
        setIsLoading(false);
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            setUserToken(token);
        } catch(e) {
            console.log(`isLogged is error ${e}`);
        } finally {
            setIsLoading(false);
        }
    }

    // const getProtectedData = async () => {
    //     // Get the JWT token from AsyncStorage
    //     const token = await AsyncStorage.getItem('userToken');
      
    //     // Make a GET request to the protected endpoint, passing in the JWT token in the Authorization header
    //     const response = await axios.get('http://192.168.1.12:3000/protected', {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    // }

    useEffect(() => {
        isLoggedIn()
        // getProtectedData();
    }, []);

    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    ); 
}
