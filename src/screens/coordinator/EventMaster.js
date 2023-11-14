import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import CoordEventCard from "../../components/CoordEventCard";

const EventMaster = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Button title="+ Create" />
        </View>
        <Text style={styles.textStyle}>Events</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <ScrollView style={styles.scrollView}>
        <CoordEventCard
          participants={14}
          done={2}
          title="10 km walk"
          description={"well-being"}
        />
        <CoordEventCard
          participants={20}
          done={30}
          title="Collect Plastic Bottles"
          description={"Recycling"}
        />
        <CoordEventCard
          participants={100}
          done={82}
          title="Collect Scrap Metals"
          description={"Recycling"}
        />
        <CoordEventCard
          participants={100}
          done={82}
          title="Collect Scrap Metals"
          description={"Recycling"}
        />
      </ScrollView>
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

export default EventMaster;
