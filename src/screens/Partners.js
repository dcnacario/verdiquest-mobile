import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import { theme } from "../../assets/style";
import TaskCategoriesCard from "../components/TaskCategoriesCard";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";


const Partners = ({route}) => {

    const {user} = route.params;

    const navigation = useNavigation();


    const handleOrganizationView = () => {
        navigation.navigate('PartnerOverview', { user: user , title:`Environmental Protection`});
    };

    return(
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.titleStyle}>Organization Partners</Text>
                <View style={styles.cardContainer}>
                    <TaskCategoriesCard title='Organization Name' onPress={handleOrganizationView}/>
                    <TaskCategoriesCard title='Organization Name'/>
                    <TaskCategoriesCard title='Organization Name'/>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    titleStyle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginTop: 20,
    },
    cardContainer: {
        marginTop: 30,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});

export default Partners;