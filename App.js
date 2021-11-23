import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screens/Login";
import CreateAccount from "./screens/CreateAccount";
import Home from "./screens/Home";
import DoorControl from "./screens/DoorControl";
import Friends from "./screens/Friends";
import RegisterDoor from "./screens/RegisterDoor"

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Sign In" component={Login} options={{gestureDirection: 'horizontal-inverted'}}/>
        <Stack.Screen name="Create Account" component={CreateAccount} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Door Control" component={DoorControl} />
        <Stack.Screen name="Friends" component={Friends} />
        <Stack.Screen name="Register Door" component={RegisterDoor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
