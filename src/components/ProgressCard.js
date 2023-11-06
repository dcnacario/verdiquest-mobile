import React from "react";
import { StyleSheet, View } from "react-native";
import * as Progress from 'react-native-progress';

const ProgressCard = () => {
    return (
        <View>
            <Progress.Circle size={40} endAngle={2} showsText={true} formatText={()=>{20}}/>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {

    },
});


export default ProgressCard;