import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/Profile";
import EditProfileUser from "../screens/EditProfileUser";

const AppProfileStack = createStackNavigator();

const ProfileStack = ({ route, navigation }) => {
  const { user, title } = route.params;
  return (
    <AppProfileStack.Navigator initialRouteName="ProfileScreen">
      <AppProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        initialParams={{ user: user, title: title }}
        options={{
          headerShown: false,
        }}
      />
      <AppProfileStack.Screen
        name="EditProfileUser"
        component={EditProfileUser}
        initialParams={{ user: user }}
        options={{
          headerShown: false,
        }}
      />
    </AppProfileStack.Navigator>
  );
};

export default ProfileStack;
