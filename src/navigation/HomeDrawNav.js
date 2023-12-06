import React,{useContext} from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Profile from "../screens/Profile";
import Subscription from "../screens/Subscription";
import Home from "../screens/Home";
import { Text, View } from "react-native";
import ProfileStack from "./ProfileStack";
import { AuthContext } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

function LogoutButton() {
  const navigation = useNavigation();
  const {logout} = useContext(AuthContext)


  return (
    <TouchableOpacity onPress={()=>logout(navigation)}><Text style={{fontWeight: "bold", marginRight: 50, color:"#BA1A1A"}}><MaterialIcons name="logout"/>Logout</Text></TouchableOpacity>
  );
}

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ padding: 20 }}>
        <LogoutButton />
      </View>
    </DrawerContentScrollView>
  );
};

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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
