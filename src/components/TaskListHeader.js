import React from "react";
import {View, StyleSheet, Text} from 'react-native';

const TaskListHeader = ({title}) => {
    return (
        <View>
            <Text>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default TaskListHeader;