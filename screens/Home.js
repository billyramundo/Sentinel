import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { styles } from "../Styles";
import { username } from "../screens/Login";
function Home(props) {
  return (
    <View style={styles.back}>
      <View style={styles.centeredcontainer}>
        <Text style={styles.text}>Welcome Home, {username}</Text>
      </View>
      <View style={styles.middlecontainer}>
        <TouchableOpacity style={styles.lockButton}>
          <Text
            style={{
              color: "white",
              fontSize: 42,
              textTransform: "uppercase",
              fontFamily: "AppleSDGothicNeo-Bold",
            }}
          >
            Lock
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}></View>
    </View>
  );
}

export default Home;
