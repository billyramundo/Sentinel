import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Systrace,
} from "react-native";
import { styles } from "../Styles";
import { username } from "../screens/Login";
import logo from "../assets/logo.png";
import axios from "axios";

function Home({ navigation }) {
  const [lockstate, setLockstate] = useState(false);
  const password = "password";
  const movePage = () => {
    navigation.navigate("Friends");
  }
  const changeLockState = () => {
    if (lockstate == false) {
      setLockstate(true);
      setLockStateText("lock");
      axios
        .post("https://p4qcydmk3c.tunnel.kundu.io/command/lock", {
          username: username,
          password: password,
        })
        .then(function (response) {
          console.log(response);
        });
    }
    if (lockstate == true) {
      setLockstate(false);
      setLockStateText("unlock");
      axios
        .post("https://p4qcydmk3c.tunnel.kundu.io/command/lock", {
          username: username,
          password: password,
        })
        .then(function (response) {
          console.log(response);
        });
    }
  };
  const [lockstateText, setLockStateText] = useState("unlock");
  return (
    <View style={styles.back}>
      <View style={styles.centeredcontainer}>
        <Text style={styles.text}>Welcome Home, {username}</Text>
      </View>
      <View style={styles.middlecontainer}>
        <TouchableOpacity style={styles.lockButton} onPress={changeLockState}>
          <Text
            style={{
              color: "white",
              fontSize: 42,
              textTransform: "uppercase",
              fontFamily: "AppleSDGothicNeo-Bold",
            }}
          >
            {lockstateText}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.middlecontainer}>
        <TouchableOpacity style={styles.button} onPress={movePage}>
          <Text
            style={{
              color: "white",
              fontSize: 25,
              textTransform: "uppercase",
              fontFamily: "AppleSDGothicNeo-Bold",
            }}
          >
            Find Friends
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.middlecontainer}>
        <Image source={logo} style={{ width: 200, height: 200 }}></Image>
      </View>
    </View>
  );
}

export default Home;
