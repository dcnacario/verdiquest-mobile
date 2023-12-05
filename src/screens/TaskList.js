import React from "react";
import {View, StyleSheet, } from 'react-native';
import TaskListHeader from "../components/TaskListHeader";
import { theme } from "../../assets/style";
import { ScrollView } from "react-native-gesture-handler";
import Card from '../components/Card';


const TaskList = ({route}) => {
    const {user, title} = route.params;

    return(
        <ScrollView style={styles.background}>
                <Svg
                  height={200}
                width={1440}
                viewBox="0 0 1440 320"
                style={styles.svgCurve}
            >
                <Path
                    fill="#7B904B"
                    d='M612.476 144.841L550.386 111.881C529.789 100.947 504.722 102.937 486.109 116.985L415.77 170.07C398.787 182.887 376.287 185.752 356.635 177.599L310.915 158.633C298.156 153.339 283.961 152.611 270.727 156.57L214.143 173.499C211.096 174.41 208.241 175.872 205.72 177.813C194.011 186.826 177.156 184.305 168.597 172.26L150.51 146.806C133.89 123.417 102.3 116.337 77.2875 130.397L0.635547 173.483L1.12709 99.8668C1.49588 44.6395 46.5654 0.167902 101.793 0.536689L681.203 4.40584C727.636 4.71591 765.026 42.6089 764.716 89.0422C764.538 115.693 743.66 137.608 717.049 139.075L612.476 144.841Z'
                />
            </Svg>
            <View style={{flex: 1}}>
                <TaskListHeader title={title} route={route.params}/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: theme.colors.background,
    },
    svgCurve: {
        position: 'absolute',
        top: -141,
        left: -300,
        zIndex: -1,
    },
    bottomWavy: {
        position: 'absolute',
        bottom: -120,
        left: -300,
        zIndex: -1,
    },
});

export default TaskList;