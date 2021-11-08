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
import {database} from "../screens/Login";

function Home(props) {
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
  const changeLockState = () => {
    if (lockstate == false) {
      setLockstate(true);
      setLockStateText("lock");
      var date = getDate();
      database.ref('users/' + username + '/entrances/' + date ).set({
        door: "door code",
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
        <Image source={logo} style={{ width: 200, height: 200 }}></Image>
      </View>
    </View>
  );
}

export default Home;
