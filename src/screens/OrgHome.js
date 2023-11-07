import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import defaultImage from '../../assets/img/default-image.png';
import { theme } from "../../assets/style";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import DeleteButton from "../components/DeleteButton";
import CardTask from "../components/CardTask";

const OrgHome = ({img, route}) => {

    const screenHeight = Dimensions.get('window').height;
    const paddingBottom = screenHeight * 0.15;

    const data = [
        {id: '1', title: 'Tasks'},
        {id: '2', title: 'Events'},
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
        <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor: theme.colors.background, flex: 1,}} contentContainerStyle
        ={{paddingBottom: paddingBottom}} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {img ? <Image defaultSource={defaultImage} source={img} style={styles.imageStyle}/> : <Image source={defaultImage} style={styles.imageStyle}/>}
                <View style={{alignSelf: 'center', flex: 1,}}>
                    <FlatList 
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        horizontal={true}
                        contentContainerStyle={styles.flatListContainer}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <CardTask title={'Event Category'} eventName={'Event Name'} description={'Lorem ipsum'}/>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    imageStyle: {
        width: '90%',
        height: 150,
        resizeMode: 'center',
        borderRadius: 10,
        alignSelf: 'center',
    },
    flatListContainer: {
        marginTop: 20,
        gap: 30,
        justifyContent: 'center',
        alignContent: 'center',
    },
});


export default OrgHome;