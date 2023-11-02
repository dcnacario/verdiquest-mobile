import React from "react";
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { theme } from "../../assets/style";


const DeleteButton = ({onPress, title, img}) => {
    const hitSlop = {
        top: 10,
        left: 10,
        bottom: 10,
        right: 10,
    }
    return(
    <View>
        <TouchableOpacity onPress={onPress} hitSlop={hitSlop} style={styles.button }>
            {img ? <Image source={img} style={styles.img}/> : null}
            <Text style={styles.buttonText}> {title}</Text>
        </TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F2FA',
        borderColor: '#79747E',
        borderRadius: 100,
        paddingVertical: 5,
        borderWidth: 1.5,
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 16,
        color: theme.colors.primary,
        padding: 5,
    },
    img: {
        width: 24, 
        height: 24, 
        padding: 5,
    },
});

export default DeleteButton;