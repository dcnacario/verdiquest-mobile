import React from 'react'
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";

const EventMaster = () => {
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.textStyle}>Events</Text>
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Button title="+ Create" />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "flex-start",
      padding: 10,
      marginTop: 40,
    },
    textStyle: {
      fontSize: 18,
      paddingVertical: 10,
      fontWeight: "bold",
      textAlign: "center",
    }
  });

export default EventMaster;