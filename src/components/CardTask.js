import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import defaultImage from "../../assets/img/default-image.png";
import axios from "axios";
import ipAddress from "../database/ipAddress";

const CardTask = ({
  title,
  difficulty,
  img,
  description,
  onPress,
  organizationId,
  userId,
  difficultyId,
}) => {
  const localhost = ipAddress;
  const [difficultyLimits, setDifficultyLimits] = useState({});
  const [taskCounts, setTaskCounts] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    fetchLimits(organizationId, userId, difficultyId);
  }, [organizationId, userId, difficultyId]);

  const fetchLimits = async (organizationId, userId, difficultyId) => {
    try {
      const response = await axios.post(`${localhost}/user/fetchLimits`, {
        organizationId: organizationId,
        userId: userId,
        difficultyId: difficultyId,
      });

      const fetchedLimits = response.data.fetchTable[0];
      console.log(fetchedLimits);
      const newDifficultyLimits = {};
      const newTaskCounts = {};

      // Extract and store limits and task counts for each difficulty
      ["Easy", "Moderate", "Hard", "Challenging", "Expert"].forEach(
        (difficulty) => {
          const limitKey = `${difficulty}Limit`;
          const countKey = `${difficulty}TasksCount`;

          newDifficultyLimits[limitKey] = fetchedLimits[limitKey] || 0;
          newTaskCounts[difficulty] = fetchedLimits[countKey] || 0;
        }
      );

      setDifficultyLimits(newDifficultyLimits);
      setTaskCounts(newTaskCounts);

      const currentDifficultyLimit =
        newDifficultyLimits[`${difficulty}Limit`] || 0;
      const currentTaskCount = newTaskCounts[difficulty] || 0;

      console.log(currentDifficultyLimit);
      console.log(currentTaskCount);

      setIsButtonDisabled(currentTaskCount >= currentDifficultyLimit);
    } catch (error) {
      console.log("Error fetching limits:", error);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageAlignment}>
        {img != null ? (
          <Image source={{ uri: img }} style={styles.imageStyle} />
        ) : (
          <Image source={defaultImage} style={styles.imageStyle} />
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDifficulty}>{difficulty}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
        <TouchableOpacity
          style={[styles.viewButton, isButtonDisabled && styles.disabledButton]}
          onPress={onPress}
          disabled={isButtonDisabled}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#F7F2FA",
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    overflow: "hidden",
    width: "90%",
  },
  imageAlignment: {
    alignItems: "center",
  },
  imageStyle: {
    width: 260,
    height: 150,
    resizeMode: "cover",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDifficulty: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#646464",
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: "#3D691B",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  viewButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
});

export default CardTask;
