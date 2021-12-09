import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import Login from "./screens/Login";
import CreateAccount from "./screens/CreateAccount";
import Home from "./screens/Home";
import DoorControl from "./screens/DoorControl";
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
      <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator options={{headerStyle: {
          borderBottomWidth: 0,
        }}}
        >
        <Stack.Screen name="Sign In" component={Login} options={{gestureDirection: 'horizontal-inverted', headerShadowVisible: false, headerTintColor: colorMode === 'dark' ? '#fff' : "#000"}} />
        <Stack.Screen name="Create Account" component={CreateAccount} options={{headerShadowVisible: false, headerTintColor: colorMode === 'dark' ? '#fff' : "#000"}} />
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <Stack.Screen name="Door Control" component={DoorControl} options={{title: null, headerShadowVisible: false, headerBackTitleVisible: false, headerTransparent: true, headerTintColor: colorMode === 'dark' ? '#fff' : "#000"}} />
        <Stack.Screen name="Register Door" component={RegisterDoor} options={{headerShadowVisible: false, headerTintColor: colorMode === 'dark' ? '#fff' : "#000"}} />
        <Stack.Screen name="Door Sharing" component={AccessRule} options={{headerShadowVisible: false, headerBackTitleVisible: false, headerTintColor: colorMode === 'dark' ? '#fff' : "#000"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
