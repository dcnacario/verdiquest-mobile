import { createStackNavigator } from "@react-navigation/stack";
import CoordinatorLogin from "../screens/CoordinatorLogin";
import CoordinatorRegistration from "../screens/CoordinatorRegistration";
import OrgProfile from "../screens/OrgProfile";
import { theme } from "../../assets/style";

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
    </AppCoordinatorStack.Navigator>
  );
};

export default CoordinatorStack;
