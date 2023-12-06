import React from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import Button from "../components/Button";
import { theme } from "../../assets/style";
import TaskCategoriesCard from "../components/TaskCategoriesCard";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";

const Task = ({ route }) => {
  const { user } = route.params;

  const screenHeight = Dimensions.get("window").height;
  const paddingBottom = screenHeight * 0.15;

  const navigation = useNavigation();

  const handleEnvironmentProtection = () => {
    navigation.navigate("TaskList", {
      user: user,
      title: `Environmental Protection`,
    });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.colors.background, flex: 1 }}
      contentContainerStyle={{ paddingBottom: paddingBottom }}
    >
      <View
        style={{ flex: 1, marginVertical: 10, marginHorizontal: 20, gap: 10 }}
      >
        <View
          style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
        >
          <View style={{ alignSelf: "flex-start" }}>
            <Button
              title="Back"
              color="#F4F4ED"
              icon="arrow-back"
              textColor="#3D691B"
            />
          </View>
          <Text style={styles.titleStyle}>Task</Text>
          <Text style={styles.titleStyle}>Categories</Text>
        </View>
        <View style={{ flex: 1, alignSelf: "flex-end" }}>
          <Button
            title="Events"
            color="#F4F4ED"
            icon="star"
            textColor="#3D691B"
          />
        </View>
        {/* Card */}
        <View style={styles.cardContainer}>
          <TaskCategoriesCard
            onPress={handleEnvironmentProtection}
            title="Environmental Protection"
          />
          <TaskCategoriesCard title="Renewable Energy" />
          <TaskCategoriesCard title="Sustainable Energy" />
          <TaskCategoriesCard title="Waste Reduction" />
          <TaskCategoriesCard title="Transportation" />
          <TaskCategoriesCard title="Conservation" />
        </View>
      </View>
      <Svg
        height={200}
        width="1440"
        viewBox="0 0 1440 320"
        style={styles.bottomWavy}
      >
        <Path
          fill="#7B904B"
          d="M161.5 41.4474L219.626 76.2389C241.673 89.435 269.675 87.1283 289.265 70.5023L323.5 41.4474L357.823 16.6873C375.519 3.92172 398.75 1.76916 418.49 11.0659L462.12 31.6136C475.56 37.9434 490.87 39.0619 505.088 34.7525L556.393 19.2018C562.151 17.4565 567.521 14.6238 572.213 10.857C583.853 1.51223 599.233 -1.76023 613.669 2.03681L718.763 29.68C745.125 36.6142 763.5 60.4475 763.5 87.7063V135.5H544H69.9837C31.3327 135.5 0 104.167 0 65.5163C0 39.7769 22.9464 20.0957 48.3856 24.016L161.5 41.4474Z"
        />
      </Svg>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 36,
    color: theme.colors.primary,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default Task;
