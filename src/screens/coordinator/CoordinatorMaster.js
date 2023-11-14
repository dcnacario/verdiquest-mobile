import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import CoordinatorCard from "../../components/CoordinatorCard";

const CoordinatorMaster = () => {
  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.textStyle}>Coordinator</Text>
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Button title="+ Add" />
          </View>
        </View>
      </View>
      <View>
        <CoordinatorCard name="Danmar Nacario" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    gap: 20,
  },
  textStyle: {
    fontSize: 18,
    paddingVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CoordinatorMaster;
