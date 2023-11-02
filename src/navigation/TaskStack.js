import { createStackNavigator } from "@react-navigation/stack";
import TaskList from "../screens/TaskList";
import Task from '../screens/Task';
import Home from '../screens/Home';

const AppTaskStack = createStackNavigator();


const TaskStack = ({route,navigation}) => {
    const {user} = route.params;
    return (
        <AppTaskStack.Navigator initialRouteName='Task'>
            <AppTaskStack.Screen name="TaskList" component={TaskList}
            initialParams={{user: user}}
            options={{
                headerShown:false
            }}
            />
            <AppTaskStack.Screen name="Task" component={Task}
            initialParams={{user: user}}
            options={{
                headerShown:false
            }}
            />
        </AppTaskStack.Navigator>
    );
};


export default TaskStack;