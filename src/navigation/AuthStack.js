import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';

const Stack = createStackNavigator();

const AuthStack = () => {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen 
            name= 'Login'
            component={Login}
            options={{
              headerShown:false
            }}
          />
          <Stack.Screen 
            name= 'Register'
            component={Register}
            options={{
              headerShown:false
            }}
          />
          <Stack.Screen 
            name= 'Home'
            component={Home}
            options={{
              headerShown:false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default AuthStack;