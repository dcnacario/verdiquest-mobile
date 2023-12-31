import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { theme } from "../../assets/style";
import Button from "../components/Button";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../navigation/AuthContext";
import { Path, Svg } from "react-native-svg";
import { Dimensions } from "react-native";

const Login = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Token
  // function generateAuthToken () {
  //     const randomString = Math.random().toString(36).substring(7);
  //     const timeStamp = Date.now();
  //     return `${randomString}-${timeStamp}`;
  // }
  // const authToken = generateAuthToken();

  // const storeAuthToken = async (authToken) => {
  //     try {
  //         await AsyncStorage.setItem(generateAuthToken(), authToken);
  //     }catch(error){
  //         console.log(error);
  //     }
  // };

  // const getAuthToken = async () => {
  //     try {
  //         const authToken = await AsyncStorage.getItem(authToken);
  //     } catch(error) {
  //         console.log(error);
  //     }
  // };

  // const authenticateUser = async () => {
  //     const authToken = await getAuthToken();
  //     if (authToken){
  //         return true;
  //     }
  //     else {
  //         return false;
  //     }
  // };

  // const handleLogin = () => {
  //     axios.post('http://192.168.1.6:3000/login', {
  //         email: email,
  //         password: password,
  //     })
  //     .then(response => {
  //         Alert.alert('Success', "Welcome to VerdiQuest");
  //         navigation.navigate('Home');
  //     })
  //     .catch(error => {
  //         console.error('Error during login:', error.response ? error.response.data : error.message);
  //         Alert.alert('Error', 'Failed to Login. Please try again.');
  //     });

  // };

  //Navigate to Register Screen
  const navigation = useNavigation();

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* SVG Header */}
      <Svg
        height={200}
        width={1440}
        viewBox="0 0 1440 320"
        style={styles.svgCurve}
      >
        <Path
          fill="#7B904B"
          d="M612.476 144.841L550.386 111.881C529.789 100.947 504.722 102.937 486.109 116.985L415.77 170.07C398.787 182.887 376.287 185.752 356.635 177.599L310.915 158.633C298.156 153.339 283.961 152.611 270.727 156.57L214.143 173.499C211.096 174.41 208.241 175.872 205.72 177.813C194.011 186.826 177.156 184.305 168.597 172.26L150.51 146.806C133.89 123.417 102.3 116.337 77.2875 130.397L0.635547 173.483L1.12709 99.8668C1.49588 44.6395 46.5654 0.167902 101.793 0.536689L681.203 4.40584C727.636 4.71591 765.026 42.6089 764.716 89.0422C764.538 115.693 743.66 137.608 717.049 139.075L612.476 144.841Z"
        />
      </Svg>

      <Image
        source={require("../../assets/img/verdiquestlogo-ver2.png")}
        style={styles.img}
      />
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={{ top: 8 }}>or</Text>
        <View style={styles.divider} />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: theme.colors.primary,
          marginVertical: 20,
        }}
      >
        Volunteer Login
      </Text>

      {/* Username */}
      <View style={{ justifyContent: "flex-start" }}>
        <Text style={styles.textInput}>Email</Text>
        <TextInput
          style={styles.inputStyle}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={{ justifyContent: "flex-start", marginBottom: 20 }}>
        <Text style={styles.textInput}>Password</Text>
        <TextInput
          style={styles.inputStyle}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={{ alignSelf: "flex-end" }}>
          <Text style={{ fontWeight: "bold", fontSize: 12, marginRight: 20 }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="LOGIN"
        onPress={() => login(email, password, navigation)}
      />

      <TouchableOpacity onPress={goToRegister}>
        <Text style={{ fontWeight: "bold", fontSize: 14, marginTop: 50 }}>
          Create a new account
        </Text>
      </TouchableOpacity>

      {/* Bottom Wavy SVG */}
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
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
  },
  img: {
    width: 180,
    height: 180,
    marginTop: 150,
    marginBottom: -20,
  },
  divider: {
    width: "30%",
    height: 1,
    backgroundColor: "#000000",
    margin: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignContent: "center",
  },
  inputStyle: {
    borderColor: "#44483E",
    borderWidth: 1,
    borderRadius: 12,
    width: 256,
    height: 45,
    marginTop: -15,
    margin: 10,
    padding: 10,
  },
  textInput: {
    marginLeft: 20,
    backgroundColor: theme.colors.background,
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#44483E",
    zIndex: 1,
    padding: 5,
  },
  svgCurve: {
    position: "absolute",
    top: -10,
    left: -300,
    zIndex: -1,
  },
  bottomWavy: {
    position: "absolute",
    bottom: -120,
    left: -300,
    zIndex: -1,
  },
});

export default Login;
