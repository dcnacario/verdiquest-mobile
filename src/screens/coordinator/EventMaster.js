import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import CoordEventCard from "../../components/CoordEventCard";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const EventMaster = ({ route }) => {
  const navigation = useNavigation();

  const [fetchedEvents, setFetchedEvents] = useState([]);
  const { coordinator } = route.params;

  const goCreateEvent = (coordinator, onFetchEvent) => {
    navigation.navigate("CoordinatorAddEvent", {
      coordinator: coordinator,
      onFetchEvent: onFetchEvent,
    });
  };

  const goToView = (coordinator, onFetchEvent, item) => {
    navigation.navigate("ViewEvent", {
      item: item,
      coordinator: coordinator,
      onFetchEvent: onFetchEvent,
    });
  };

  //fetching Events
  const fetchEvent = async () => {
    try {
      const response = await axios.post(
        "http://192.168.1.14:3000/coordinator/fetchEvents",
        {
          coordinatorId: coordinator.CoordinatorId,
        }
      );
      setFetchedEvents(response.data.fetchTable);
    } catch (error) {
      console.error("Error fetching tasks table", error);
      return []; // Return an empty array in case of an error
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [coordinator.CoordinatorId]);

  //------------------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Button
            title="+ Create"
            onPress={() => goCreateEvent(coordinator, fetchEvent)}
          />
        </View>
        <Text style={styles.textStyle}>Events</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <ScrollView style={styles.scrollView}>
        {fetchedEvents != null ? (
          fetchedEvents.map((item) => (
            <CoordEventCard
              key={item.EventId}
              participants={0}
              done={0}
              title={item.EventName}
              description={item.EventDescription}
              onPress={() => goToView(coordinator, fetchEvent, item)}
            />
          ))
        ) : (
          <Text>No event/s available for this coordinator.</Text>
        )}
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
    textAlign: "justify",
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
