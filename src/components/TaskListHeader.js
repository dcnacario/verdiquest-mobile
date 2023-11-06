import React from "react";
import {View, StyleSheet, Text, FlatList} from 'react-native';
import { theme } from "../../assets/style";
import DeleteButton from "./DeleteButton";
import CardTask from "./CardTask";
import { useNavigation } from "@react-navigation/native";

const TaskListHeader = ({title, route}) => {
    const navigation = useNavigation();



    const {user, routeTitle} = route;

    const onPressEnvironmentProtection = () => {
        navigation.navigate('TaskDetails', { user: user, title:'Environmental Protection'});
    }

    const data = [
        {id: '1', title: 'All'},
        {id: '2', title: 'Easy'},
        {id: '3', title: 'Medium'},
        {id: '4', title: 'Hard'},
    ];

    const renderItem = ({item}) => {
        return (
            <View>
                <DeleteButton title={item.title}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>{title}</Text>
            <FlatList 
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal={true}
                contentContainerStyle={styles.flatListContainer}
                showsHorizontalScrollIndicator={false}
            />
            <CardTask title="Environmental Protection" difficulty='Easy' description='Join us for a Beach cleanup on May 7th!' onPress={onPressEnvironmentProtection}/>
            <CardTask title="Environmental Cleaning" difficulty='Medium' description='Join us for a Beach cleanup on May 7th!'/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 36,
        color: theme.colors.primary,
        textAlign: 'center',
    },
    flatListContainer: {
        marginTop: 20,
        gap: 5,
        justifyContent: 'center',
        alignContent: 'center',
    },
});

export default TaskListHeader;