import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { HStack, Box, Text, Icon, extendTheme } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import Login from "./screens/Login";
import CreateAccount from "./screens/CreateAccount";
import Home from "./screens/Home";
import DoorControl from "./screens/DoorControl";
import Friends from "./screens/Friends";
import RegisterDoor from "./screens/RegisterDoor"
import AccessRule from "./screens/AccessRule";
import { sentinelTheme } from "./screens/Login";

const Stack = createStackNavigator();

const sentinelNavThemeDark = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: sentinelTheme.colors.brandPrimary,
    background: "#000",
    card: "#000",
    text: "#fff",
    border: "#333",
    notification: "#fff"
  }
}

export default function App() {
  const colorMode = useColorScheme();
  return (
    <NavigationContainer theme={colorMode === 'dark' ? sentinelNavThemeDark : DefaultTheme}>
      <Stack.Navigator options={{headerStyle: {
    borderBottomWidth: 0,
}}}>
        <Stack.Screen name="Sign In" component={Login} options={{gestureDirection: 'horizontal-inverted', headerShadowVisible: false}} />
        <Stack.Screen name="Create Account" component={CreateAccount} options={{headerShadowVisible: false, headerTintColor: colorMode === 'dark' ? '#fff' : "#000",}}/>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <Stack.Screen name="Door Control" component={DoorControl} options={{headerShown: false}} />
        <Stack.Screen name="Friends" component={Friends} />
        <Stack.Screen name="Register Door" component={RegisterDoor} />
        <Stack.Screen name="Access Rule" component={AccessRule} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
