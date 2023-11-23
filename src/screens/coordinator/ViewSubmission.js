import React, { useState } from "react";
import {Text, View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { theme } from "../../assets/style";
import SubmitCard from "../components/SubmitCard";


const ViewSubmission = () => {
    const screenHeight = Dimensions.get('window').height;
    const paddingBottom = screenHeight * 0.15;
    return (
        <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: theme.colors.background, flex: 1}} contentContainerStyle={{paddingBottom: paddingBottom}}>
            <View style={{flex: 1,}}>
                <View style={{flex: 1, marginTop: 100}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginHorizontal: 20}}>
                            <Text style={styles.taskLabel}>Task Name</Text>
                            <View style={styles.divider} />
                    </View>
                </View>
                <View style={styles.submissionContainer}>
                    <SubmitCard/>
                </View>
            </View> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    introContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 10,
    },
    taskContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    taskLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        width: "100%",
        height: 0.75,
        backgroundColor: "#000000",
        marginVertical: 5, 
    },
    submissionContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});

export default ViewSubmission;