import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { theme } from "../../../assets/style";
import Button from "../../components/Button";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const CoordInterface = ({ route }) => {
  const { coordinator } = route.params;
  const navigation = useNavigation();

  const gotoTasks = () => {
    navigation.navigate("TaskMaster");
  };
  const gotoEvents = () => {
    navigation.navigate("EventMaster");
  };

  const gotoCoordinators = () => {
    navigation.navigate("CoordinatorMaster", {});
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background, flex: 1 }}
    >
      <View style={styles.container}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <Image
            source={require("../../../assets/img/default-image.png")}
            style={styles.profileAvatar}
          />
          <View style={styles.userNameWithIcon}>
            <Text
              style={styles.userName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Danmar Nacario
            </Text>
            <TouchableOpacity onPress={gotoCoordinators}>
              <Icon name="pencil" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={styles.role}>Head Coordinator</Text>
        </View>

        {/* Ongoing Events Section */}
        <View style={styles.ongoingEventsContainer}>
          <Text style={styles.ongoingEventsTitle}>Ongoing Events</Text>
          {/* Insert other components representing the event details here */}
        </View>

        <View style={styles.row}>
          <View style={styles.leftButton}>
            <Button title="Tasks" onPress={gotoTasks} />
          </View>
          <View style={styles.rightButton}>
            <Button title="Coordinators" onPress={gotoCoordinators} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.leftButton}>
            <Button title="Events" onPress={gotoEvents} />
          </View>
          <View style={styles.rightButton}>
            <Button title="Report" onPress={gotoTasks} />
          </View>
        </View>
        <View style={styles.logoutButtonContainer}>
          <Button title="Logout" onPress={gotoTasks} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "flex-start",
    padding: 10,
    marginTop: 75,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  leftButton: {
    flex: 1,
    marginRight: 5,
  },
  rightButton: {
    flex: 1,
    marginLeft: 5,
  },
  logoutButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  subtextCoordinator: {
    textAlign: "center",
    color: "#000000",
  },
  mainTextCoordinator: {
    textAlign: "center",
    color: "#000000",
  },
  scrollView: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  userNameWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flexShrink: 1,
    marginRight: 8,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  role: {
    fontSize: 16,
    color: "#000",
  },
  ongoingEventsContainer: {
    height: 200, // Set your desired height
    backgroundColor: "#D9EAD3",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  ongoingEventsTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
  },
});

export default CoordInterface;
