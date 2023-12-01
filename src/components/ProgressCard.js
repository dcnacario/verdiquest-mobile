import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import defaultImage from '../../assets/img/default-image.png';
import { theme } from "../../assets/style";

const ProgressCard = ({img, title, difficulty, description}) => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {img != null ? (
                    <Image source={{ uri: img }} style={styles.imageStyle} />
                ) : (
                    <Image source={defaultImage} style={styles.imageStyle} />
                )}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDifficulty}>{difficulty}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        gap: 10,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textContainer: {
        flex: 2,
        alignSelf: 'flex-start',
        paddingLeft: 10, 
    },
    imageStyle: {   
        width: 100,
        height: 80,
        resizeMode: 'cover',
        alignSelf: 'flex-start',
        borderRadius: 15,
        padding: 10,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    cardDifficulty: {
        fontSize: 16,
        color: '#4CAF50', 
    },
    cardDescription: {
        fontSize: 12,
        color: '#646464',
    },
});


export default ProgressCard;