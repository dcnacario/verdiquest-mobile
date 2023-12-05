import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "../screens/Profile";
import Subscription from "../screens/Subscription";
import Home from "../screens/Home";
import { Text, View } from "react-native";
import ProfileStack from "./ProfileStack";

const Drawer = createDrawerNavigator();

const HomeDrawNav = ({ route }) => {
  const { user } = route.params;
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveBackgroundColor: "#DAE7C9",
        drawerActiveTintColor: "#141E0C",
        drawerStyle: {
          borderRadius: 20,
          height: "80%",
        },
        drawerItemStyle: {
          borderRadius: 30,
          padding: 10,
        },
      }}
    >
      <Drawer.Screen
        name="Home Page"
        component={Home}
        initialParams={{ user: user }}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        initialParams={{ user: user }}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Subscription"
        component={Subscription}
        initialParams={{ user: user }}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default HomeDrawNav;
