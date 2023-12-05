import { createStackNavigator } from "@react-navigation/stack";
import Redeem from "../screens/Redeem";
import ProductDetails from "../screens/ProductDetails";

const AppProductStack = createStackNavigator();

const ProductStack = ({ route, navigation }) => {
    const { user, title } = route.params;
    return (
    <AppProductStack.Navigator initialRouteName="Redeems">
        <AppProductStack.Screen
            name="Redeem"
            component={Redeem}
            initialParams={{ user: user, title: title }}
            options={{
                headerShown: false,
            }}
        />
        <AppProductStack.Screen
            name="ProductDetails"
            component={ProductDetails}
            initialParams={{ user: user }}
            options={{
                headerShown: false,
            }}
        />
        </AppProductStack.Navigator>
    );
};

export default ProductStack;
