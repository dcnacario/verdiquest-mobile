import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../../assets/style";


const Button = ({onPress, title, img}) => {
    const hitSlop = {
        top: 10,
        left: 10,
        bottom: 10,
        right: 10,
    }
    
    return (
        <View style={styles.shadow}>
            <TouchableOpacity onPress={onPress} hitSlop={hitSlop} style={styles.button }>
                {img ? <Image source={img} style={styles.img}/> : null}
                <Text style={styles.buttonText}> {title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 100,
        paddingVertical: 5,
        paddingHorizontal: 30,
    },
    buttonText: {
        fontSize: 16,
        color: theme.colors.secondary,
        padding: 5,
    },
    img: {
        width: 24, 
        height: 24, 
        padding: 5,
    },
});

export default Button;