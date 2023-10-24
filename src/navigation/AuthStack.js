import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppStack = () => {
    return(
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
    );
}

export default AuthStack;