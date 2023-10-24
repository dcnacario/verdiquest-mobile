import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useState, useEffect} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://192.168.1.6:3000/login', {
                email: email,
                password: password,
            });
            
            const token = response.data.token;  // assuming token is returned in the 'token' field
            await AsyncStorage.setItem('userToken', token);
            setUserToken(token);
            
        } catch(error) {
            console.error('Error during login:', error.response ? error.response.data : error.message);
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

    const getProtectedData = async () => {
        // Get the JWT token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
      
        // Make a GET request to the protected endpoint, passing in the JWT token in the Authorization header
        const response = await axios.get('http://192.168.1.6:3000/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    }

    useEffect(() => {
        isLoggedIn();
        getProtectedData();
    }, []);

    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken, getProtectedData}}>
            {children}
        </AuthContext.Provider>
    ); 
}
