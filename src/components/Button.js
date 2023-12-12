import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../../assets/style";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const Button = ({
  onPress,
  title,
  img,
  color = theme.colors.primary,
  icon,
  textColor = theme.colors.secondary,
  route,
  disabled,
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
        style={[
          styles.button,
          styles.shadow,
          { backgroundColor: disabled ? "grey" : color },
        ]}
        disabled={disabled}
      >
        {icon ? <MaterialIcon name={icon} size={16} color={textColor} /> : null}
        <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    padding: 5,
  },
  img: {
    width: 24,
    height: 24,
    padding: 5,
  },
});

export default Button;
