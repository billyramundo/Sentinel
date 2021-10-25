import React, { useState } from "react";
import { styles } from "../Styles";
import logo from "../assets/logo.png";
import { getDatabase, ref, onValue } from 'firebase/database';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp3DdsqNfYJeCXIveh-7dDvnJhmudgdeE",
  authDomain: "sentinel-a6249.firebaseapp.com",
  databaseURL: "https://sentinel-a6249-default-rtdb.firebaseio.com",
  projectId: "sentinel-a6249",
  storageBucket: "sentinel-a6249.appspot.com",
  messagingSenderId: "1069922297779",
  appId: "1:1069922297779:web:2f883ac3957053cb80cdc6",
  measurementId: "G-5WBYZYXC4J"
};

// Initialize Firebase
const db = getDatabase(app);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

let username = "";
function Login({ navigation }) {
  const [user, setUsername] = useState("");
  const movePage = () => {
    username = user;
    navigation.navigate("Home");
  };
  const storeUser = (userName) => {
    //const db = getDatabase();
    const reference = ref(db, 'users/' + userName);
    set(ref(db, 'users/' + username), {
      password: "password",
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
        <TextInput style={styles.input} placeholder="Password" />
        <TouchableOpacity style={styles.button} onPress={movePage, storeUser(username)}>
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
