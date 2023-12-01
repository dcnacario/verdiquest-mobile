import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import ProductCard from "../../components/ProductCard";

const CoordinatorProduct = () => {
    const navigation = useNavigation();

    const goCreateProduct = () => {
        navigation.navigate("CoordinatorAddProduct");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                    <Button title="+ Add" onPress={goCreateProduct} />
                </View>
                <Text style={styles.textStyle}>Rewards</Text>
                <View style={{ flex: 1 }}></View>
            </View>
            <View style={styles.card}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.cardRow}>
                        <ProductCard
                            imageUrl={'../../../assets/img/verdiquestlogo-ver2.png'}
                            title="Assault Cuirass"
                            quantity={20}
                        />
                        <ProductCard
                            imageUrl={'../../../assets/img/verdiquestlogo-ver2.png'}
                            title="Eclipse"
                            quantity={40}
                        />
                    </View>
                    <View style={styles.cardRow}>
                        <ProductCard
                            imageUrl={'../../../assets/img/verdiquestlogo-ver2.png'}
                            title="Assault Cuirass"
                            quantity={20}
                        />
                        <ProductCard
                            imageUrl={'../../../assets/img/verdiquestlogo-ver2.png'}
                            title="Enchanted Book of Bilat Eclipse"
                            quantity={40}
                        />
                    </View>
                    <View style={styles.cardRow}>
                        <ProductCard
                            imageUrl={'../../../assets/img/verdiquestlogo-ver2.png'}
                            title="Enchanted Book of Oten Cuirass"
                            quantity={20}
                        />
                        <ProductCard
                            imageUrl={'../../../assets/img/verdiquestlogo-ver2.png'}
                            title="Enchanted Book of Bolbol"
                            quantity={40}
                        />

                    </View>
                    <View style={styles.cardRow}>
                        <ProductCard
                            imageUrl={'../../../assets/img/verdiquestlogo-ver2.png'}
                            title="Assault Betlog ni Lester"
                            quantity={20}
                        />
                        <ProductCard
                            imageUrl={'../../../assets/img/verdiquestlogo-ver2.png'}
                            title="Eclipse bugan ni Danmar"
                            quantity={40}
                        />

                    </View>

                </ScrollView>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 50,
        backgroundColor: theme.colors.background,
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
    },
    cardRow: {
        flexDirection: 'row', // Aligns children in a row
        justifyContent: 'space-around', // Distributes children evenly with space around them
        padding: 10, // Space inside the row view
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 8,
        color: '#000',
    },
    quantity: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    textStyle: {
        fontSize: 16,
        paddingVertical: 10,
        fontWeight: "bold",
        textAlign: "center",
    },
    header: {
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    scrollView: {
        width: "90%", // Ensures ScrollView takes full width
    },
});

export default CoordinatorProduct;
