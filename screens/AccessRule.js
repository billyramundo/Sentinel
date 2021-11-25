import React, { useState } from "react";
import logo from "../assets/logo.png";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { sentinelLogo, sentinelTheme, sentinelThemeLight, sentinelThemeDark } from "./Login";

import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  Icon,
  extendTheme,
  Spinner,
  useColorMode
} from "native-base"

import { Alert, useColorScheme, Appearance, Platform } from "react-native"
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

function AccessRule({ navigation }) {
  
  var [formData, setData] = useState({});
  var [formErrors, setErrors] = useState({});
  const [attemptingSubmit, setAttemptingSubmit] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    let [hours, minutes] = [date.getUTCHours(), date.getUTCMinutes()];
    console.warn(hours);
    console.warn(minutes);
    hideDatePicker();
  };


  async function validate() {
    formErrors = {};
  
    let username_stylized = 'username' in formData ? formData.username : undefined;
    let username_lower = 'username' in formData ? formData.username.toLowerCase() : undefined;

    if (!('username' in formData) || username_lower.length === 0) {
      setErrors({
        ...formErrors,
        username: 'Username is required',
      });
      return false;
    } else if (username_lower.length < 3) {
      setErrors({
        ...formErrors,
        username: 'Username is too short',
      });
      return false;
    } else if (username_lower !== undefined){
      let snapshot = await firebase.database().ref(`usernames/${username_lower}`).once("value").catch(error => {
        console.error(error);
      });
      if(snapshot.exists()) {
        setErrors({
          ...formErrors,
          username: 'Username is already taken',
        });
        return false;
      }
    }

    if (!('email' in formData) || formData.email.length === 0) {
      setErrors({
        ...formErrors,
        email: 'Email address is required',
      });
      return false;
    }

    if (!('password' in formData) || formData.password.length === 0) {
      setErrors({
        ...formErrors,
        password: 'Password is required',
      });
      return false;
    } else if (formData.password.length < 6) {
      setErrors({
        ...formErrors,
        password: 'Password is too short',
      });
      return false;
    }
  
    // Attempt to create user
    setAttemptingSubmit(true);
    let auth = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({
          ...formErrors,
          email: 'Email address already in use',
        });
        return false;
      }
      if (error.code === 'auth/invalid-email') {
        setErrors({
          ...formErrors,
          email: 'Email address invalid',
        });
        return false;
      }
      console.error(error.code);
      console.error(error);
  
      // Do not validate
      return false;
    });

    if(auth === undefined || auth === false) {
      console.error("Encountered unhandled error when creating new user.");
      return false;
    }
    
    console.log('User account created & signed in!');

    // Put user's stylized name in Firebase auth
    await auth.user.updateProfile({displayName: formData.username}).catch((error) => {
      console.error(error);
    });

    // Add user to private
    firebase.database().ref(`users/private/${auth.user.uid}`).set({
      "username": username_lower
    });
    // Point user's uid in public to user's username
    firebase.database().ref(`users/public/${auth.user.uid}`).set({
      "username": username_lower
    });
    // Point username to user; store stylized version, too
    firebase.database().ref(`usernames/${username_lower}`).set({
      "owner": auth.user.uid,
      "case-stylized": formData.username
    });
    return true;
  };

  async function onSubmit(){
    let validated = await validate();
    if(!validated) {
      console.log('Validation Failed');
      setAttemptingSubmit(false);
      return;
    }
    console.log('Information validated & user created successfully');
    // Go home AND reset nav stack
    navigation.reset({
      routes: [{ name: 'Home' }]
    });
  };

  const { colorMode, toggleColorMode } = useColorMode();
  Appearance.addChangeListener(toggleColorMode, colorMode);
  toggleColorMode(colorMode);

  return (    
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
    </NativeBaseProvider>
  );
}

export default AccessRule;
