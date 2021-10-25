import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { styles } from "../Styles";
import { username } from "../screens/Login";
import logo from "../assets/logo.png";
function Home(props) {
  const [lockstate, setLockstate] = useState(false);
  const changeLockState = () => {
    if (lockstate == false) {
      setLockstate(true);
      setLockStateText("lock");
    }
    if (lockstate == true) {
      setLockstate(false);
      setLockStateText("unlock");
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
