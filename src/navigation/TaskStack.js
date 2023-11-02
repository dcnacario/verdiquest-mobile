import { createStackNavigator } from "@react-navigation/stack";
import TaskList from "../screens/TaskList";

const Stack = createStackNavigator();


const TaskStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="TaskList" component={TaskList}/>
        </Stack.Navigator>
    );
};


export default TaskStack;