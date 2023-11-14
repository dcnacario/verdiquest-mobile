import { createStackNavigator } from "@react-navigation/stack";
import CoordinatorLogin from "../screens/coordinator/CoordinatorLogin";
import CoordinatorRegistration from "../screens/coordinator/CoordinatorRegistration";
import OrgProfile from "../screens/coordinator/OrgProfile";
import { theme } from "../../assets/style";
import CoordInterface from "../screens/coordinator/CoordInterface";
import CoordinatorDashboard from "../screens/coordinator/CoordinatorDashboard";
import CoordinatorMaster from "../screens/coordinator/CoordinatorMaster";

const AppCoordinatorStack = createStackNavigator();

const CoordinatorStack = ({ route }) => {
  return (
    <AppCoordinatorStack.Navigator initialRouteName="CoordinatorLogin">
      <AppCoordinatorStack.Screen
        name="CoordinatorLogin"
        component={CoordinatorLogin}
        options={{
          headerShown: true,
          headerLeft: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: theme.colors.lightSecondary,
          },
        }}
      />
      <AppCoordinatorStack.Screen
        name="CoordinatorRegistration"
        component={CoordinatorRegistration}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="OrgProfile"
        component={OrgProfile}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="CoordInterface"
        component={CoordInterface}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="CoordinatorDashboard"
        component={CoordinatorDashboard}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="CoordinatorMaster"
        component={CoordinatorMaster}
        options={{
          headerShown: false,
        }}
      />
    </AppCoordinatorStack.Navigator>
  );
};

export default CoordinatorStack;
