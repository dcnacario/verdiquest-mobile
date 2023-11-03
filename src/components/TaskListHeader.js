import React from "react";
import {View, StyleSheet, Text, FlatList} from 'react-native';
import { theme } from "../../assets/style";
import DeleteButton from "./DeleteButton";

const TaskListHeader = ({title}) => {
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
            <Text style={styles.textStyle} numberOfLines={2}>{title}</Text>
            <FlatList 
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal={true}
                contentContainerStyle={styles.flatListContainer}
                showsHorizontalScrollIndicator={false}
            />
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