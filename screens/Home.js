import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { styles } from "../Styles";
import { username } from "../screens/Login";
function Home(props) {
  const [lockstate, setLockstate] = useState(false);
  const changeLockState = () => {
    if (lockstate == false) {
      setLockstate(true);
      setLockStateText("unlock");
    }
    if (lockstate == true) {
      setLockstate(false);
      setLockStateText("lock");
    }
  };
  const [lockstateText, setLockStateText] = useState("lock");
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
      <View style={styles.container}></View>
    </View>
  );
}

export default Home;
