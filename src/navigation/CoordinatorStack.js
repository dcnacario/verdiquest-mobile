import { createStackNavigator } from "@react-navigation/stack";
import CoordinatorLogin from "../screens/coordinator/CoordinatorLogin";
import CoordinatorRegistration from "../screens/coordinator/CoordinatorRegistration";
import OrgProfile from "../screens/coordinator/OrgProfile";
import { theme } from "../../assets/style";
import CoordInterface from "../screens/coordinator/CoordInterface";
import CoordinatorDashboard from "../screens/coordinator/CoordinatorDashboard";
import CoordinatorMaster from "../screens/coordinator/CoordinatorMaster";
import TaskMaster from "../screens/coordinator/TaskMaster";
import EventMaster from "../screens/coordinator/EventMaster";
import AddCoordinator from "../screens/coordinator/AddCoordinator";
import CoordinatorAddEvent from "../screens/coordinator/CoordinatorAddEvent";
import CreateTaskDashboard from "../screens/coordinator/CreateTaskDashboard";
import UpdateTaskDashboard from "../screens/coordinator/UpdateTaskDashboard";
import ViewSubmission from "../screens/coordinator/ViewSubmission";

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
      <AppCoordinatorStack.Screen
        name="TaskMaster"
        component={TaskMaster}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="EventMaster"
        component={EventMaster}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="AddCoordinator"
        component={AddCoordinator}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="CoordinatorAddEvent"
        component={CoordinatorAddEvent}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="CreateTaskDashboard"
        component={CreateTaskDashboard}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="UpdateTaskDashboard"
        component={UpdateTaskDashboard}
        options={{
          headerShown: false,
        }}
      />
      <AppCoordinatorStack.Screen
        name="ViewSubmission"
        component={ViewSubmission}
        options={{
          headerShown: false,
        }}
      />
    </AppCoordinatorStack.Navigator>
  );
};

export default CoordinatorStack;
