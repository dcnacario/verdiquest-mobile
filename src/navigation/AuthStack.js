import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';
import { theme } from '../../assets/style';
import AppTabNav from './AppTabNav';

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
            name= 'AppTabNav'
            component={AppTabNav}
            options={{
              headerStyle: {
                backgroundColor: theme.colors.lightSecondary,
              },
              headerTintColor: theme.colors.secondary,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: false,
              headerTitleAlign: 'center',
              headerTitle: '',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default AuthStack;