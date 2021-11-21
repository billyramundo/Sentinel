import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Systrace
} from "react-native";
import { styles } from "../Styles";
import { auth, username } from "../screens/Login";
import logo from "../assets/logo.png";
import axios from "axios";
import {database} from "../screens/Login";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const goHome = (navigation) => {
  navigation.reset({
    routes: [{ name: 'Home' }]
  });
}

function Home({ navigation }) {
  const getDate = () => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return date;
  };
  const getTime = () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  };
  const [lockstate, setLockstate] = useState(false);
  const password = "password";
  const movePage = () => {
    navigation.navigate("Friends");
  }
  const changeLockState = () => {
    if (lockstate == true) {
      setLockstate(false);
      setLockStateText("unlock");
      var date = getDate();
      const userID = firebase.auth().currentUser.uid;
      database.ref('users/' + userID + '/entrances/' + date ).set({
        door: "door id",
        time: getTime()
      });

      axios
        .post("https://p4qcydmk3c.tunnel.kundu.io/command/lock", {
          username: username,
          password: password,
        })
        .then(function (response) {
          console.log(response);
        });
    }
    if (lockstate == false) {
      setLockstate(true);
      setLockStateText("lock");
      axios
        .post("https://p4qcydmk3c.tunnel.kundu.io/command/unlock", {
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
      <View style={styles.centeredcontainer} accessibilityLabel="Welcome Message">
        <Text style={styles.text}>Welcome, {username}</Text>
      </View>
      <View style={styles.middlecontainer} accessibilityLabel="Lock and Unlock Button">
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
      <View style={styles.middlecontainer} accessibilityLabel="Sentinel Logo">
        <Image source={logo} style={{ width: 200, height: 200 }}></Image>
      </View>
    </View>
  );
}

export default Home;
export { goHome };
