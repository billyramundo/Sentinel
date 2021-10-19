import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { styles } from "../Styles";
import { username } from "../screens/Login";
function Home(props) {
  return (
    <View style={styles.back}>
      <View style={styles.middlecontainer}>
        <Text style={styles.text}>Welcome, {username}</Text>
      </View>
      <View style={styles.container}></View>
      <View style={styles.container}></View>
    </View>
  );
}

export default Home;
