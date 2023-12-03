import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { theme } from "../../assets/style";

const DeleteButton = ({
  onPress,
  title,
  img,
  color = "#FAFAF2",
  textColor = "#44483E",
}) => {
  const hitSlop = {
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  };
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        hitSlop={hitSlop}
        style={[styles.button, { backgroundColor: color }]}
      >
        {img ? <Image source={img} style={styles.img} /> : null}
        <Text style={[styles.buttonText, { color: textColor }]}> {title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#79747E",
    borderRadius: 100,
    paddingVertical: 5,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonText: {
    fontSize: 11,
    padding: 5,
  },
  img: {
    width: 24,
    height: 24,
    padding: 5,
  },
});

export default DeleteButton;
