import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login';
import Register from '../screens/Register';
import { theme } from '../../assets/style';
import AppTabNav from './AppTabNav';
import LoginIntro from '../screens/LoginIntro';
import CoordinatorLogin from '../screens/CoordinatorLogin';
import CoordinatorRegistration from '../screens/CoordinatorRegistration';
import OrgProfile from '../screens/OrgProfile';

const Stack = createStackNavigator();

const AuthStack = () => {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName='LoginIntro'
        >
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
          <Stack.Screen 
            name= 'LoginIntro'
            component={LoginIntro}
            options={{
              headerShown:false
            }}
          />
          <Stack.Screen 
            name= 'CoordinatorLogin'
            component={CoordinatorLogin}
            options={{
              headerShown: true,
              headerLeft: false,
              headerTitle: '',
              headerStyle: {
                backgroundColor: theme.colors.lightSecondary,
              },
            }}
          />
          <Stack.Screen 
            name= 'CoordinatorRegistration'
            component={CoordinatorRegistration}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name= 'OrgProfile'
            component={OrgProfile}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default AuthStack;