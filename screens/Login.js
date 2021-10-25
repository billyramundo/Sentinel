import React, { useState } from "react";
import { styles } from "../Styles";
import { Text, View, Button, TouchableOpacity, TextInput } from "react-native";
let username = "";
function Login({ navigation }) {
  const [user, setUsername] = useState("");
  const movePage = () => {
    username = user;
    navigation.navigate("Home");
  };

  return (
    <View style={styles.back}>
      <View style={styles.container}></View>
      <View style={styles.middlecontainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(user) => setUsername(user)}
        />
        <TextInput style={styles.input} placeholder="Password" />
        <TouchableOpacity style={styles.button} onPress={movePage}>
          <Text
            style={{
              color: "white",
              fontSize: 30,
              textTransform: "uppercase",
              fontFamily: "AppleSDGothicNeo-Bold",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}></View>
    </View>
  );
}

export default Login;
export { username };
