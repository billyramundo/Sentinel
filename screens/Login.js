import React, { useState } from "react";
import { styles } from "../Styles";
import logo from "../assets/logo.png";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDp3DdsqNfYJeCXIveh-7dDvnJhmudgdeE",
  authDomain: "sentinel-a6249.firebaseapp.com",
  databaseURL: "https://sentinel-a6249-default-rtdb.firebaseio.com",
  projectId: "sentinel-a6249",
  storageBucket: "sentinel-a6249.appspot.com",
  messagingSenderId: "1069922297779",
  appId: "1:1069922297779:web:2f883ac3957053cb80cdc6",
  measurementId: "G-5WBYZYXC4J",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

import {
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";

let username = "";
let password = "";
function Login({ navigation }) {
  const [user, setUsername] = useState("");
  const [pass, setPassword] = useState("");
  const movePage = () => {
    if (user.length == 0 || pass.length == 0) {
      Alert.alert("Please enter a username and password.");
    } else if (pass.length < 6) {
      Alert.alert("Password must be at least 6 characters long");
    } else {
      username = user;
      password = pass;
      storeUser(username, password);
      navigation.navigate("Home");
    }
  };
  const storeUser = (username, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(username, password)
      .then(() => {
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }
        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }
        console.error(error);
      });
  };

  return (
    <View style={styles.back}>
      <View style={styles.centeredcontainer}>
        <Text
          style={{
            color: "#3EB489",
            fontSize: 60,
            textTransform: "uppercase",
            textShadowColor: "black",
            textShadowRadius: 5,
          }}
        >
          Sentinel
        </Text>
      </View>
      <View style={styles.middlecontainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(user) => setUsername(user)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(pass) => setPassword(pass)}
          secureTextEntry={true}
        />
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
      <View style={styles.middlecontainer}>
        <Image source={logo} style={{ width: 200, height: 200 }}></Image>
      </View>
    </View>
  );
}

export default Login;
export { username };
export { database };
