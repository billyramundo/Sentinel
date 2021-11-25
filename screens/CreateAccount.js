import React, { useState } from "react";
import logo from "../assets/logo.png";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

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
  KeyboardAvoidingView,
  Icon,
  extendTheme,
  Spinner,
  useColorMode
} from "native-base"

import { Alert, useColorScheme, Appearance, Platform } from "react-native"
import { sentinelLogo, sentinelTheme, sentinelThemeLight, sentinelThemeDark } from "./Login";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

function CreateAccount({ navigation }) {
  const colorMode = useColorScheme();
  var [formData, setData] = useState({});
  var [formErrors, setErrors] = useState({});
  const [attemptingSubmit, setAttemptingSubmit] = useState(false);

  async function validate() {
    setErrors({});

    let username_stylized = 'username' in formData ? formData.username : undefined;
    let username_lower = 'username' in formData ? formData.username.toLowerCase() : undefined;

    if (!('username' in formData) || username_lower.length === 0) {
      setErrors({
        username: 'Username is required',
      });
      return false;
    } else if (username_lower.length < 3) {
      setErrors({
        username: 'Username is too short',
      });
      return false;
    } else if (username_lower !== undefined){
      let snapshot = await firebase.database().ref(`usernames/${username_lower}`).once("value").catch(error => {
        console.error(error);
      });
      if(snapshot.exists()) {
        setErrors({
          username: 'Username is already taken',
        });
        return false;
      }
    }

    if (!('email' in formData) || formData.email.length === 0) {
      setErrors({
        email: 'Email address is required',
      });
      return false;
    }

    if (!('password' in formData) || formData.password.length === 0) {
      setErrors({
        password: 'Password is required',
      });
      return false;
    } else if (formData.password.length < 6) {
      setErrors({
        password: 'Password is too short',
      });
      return false;
    }
  
    // Attempt to create user
    setAttemptingSubmit(true);
    let shouldReturnFalse = false;
    let auth = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({
          email: 'Email address already in use',
        });
        shouldReturnFalse = true;
        return false;
      }
      if (error.code === 'auth/invalid-email') {
        setErrors({
          email: 'Email address invalid',
        });
        shouldReturnFalse = true;
        return false;
      }
      console.error(error.code);
      console.error(error);
  
      // Do not validate
      shouldReturnFalse = true;
      return false;
    });
    if(shouldReturnFalse) {
      return false;
    }

    if(auth === undefined || auth === false) {
      console.error("Encountered unhandled error when creating new user.");
      return false;
    }
    
    console.log('User account created & signed in!');

    // Put user's username in Firebase auth db
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

  const moveLogin = () => {
    navigation.pop()
  }

  return (    
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
      <KeyboardAvoidingView
        h="auto"
        w="100%"
        maxW="400"
        justifyContent="flex-end"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS !== 'web' ? 
          Platform.select({
              ios: () => 70,
              android: () => 200
          })() : 0
        }
      >
        <Box safeArea px="3" py="8" w="90%" mx="auto" h="100%" justifyContent="center">
          <Center>
            {sentinelLogo()}
          </Center>

          <VStack space={3} mt="6">
            <FormControl isRequired isInvalid={'username' in formErrors}>
            <FormControl.Label _text={{color: sentinelTheme.colors.grayLabelText[colorMode]}}>Username</FormControl.Label>
              <Input
                placeholder="Username"
                onChangeText={(value) => setData({ ...formData, username: value })}
                _focus={{borderColor: sentinelTheme.colors.brandPrimary.regular}}
                _hover={{backgroundColor: "transparent"}}
                autoCapitalize="none"
              />
              <FormControl.HelperText>Username must contain at least 3 characters.</FormControl.HelperText>
              <FormControl.ErrorMessage>{formErrors.username}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={'email' in formErrors}>
              <FormControl.Label _text={{color: sentinelTheme.colors.grayLabelText[colorMode]}}>Email Address</FormControl.Label>
              <Input
                placeholder="Email"
                onChangeText={(value) => setData({ ...formData, email: value })}
                _focus={{borderColor: sentinelTheme.colors.brandPrimary.regular}}
                _hover={{backgroundColor: "transparent"}}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormControl.ErrorMessage>{formErrors.email}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={'password' in formErrors}>
            <FormControl.Label _text={{color: sentinelTheme.colors.grayLabelText[colorMode]}}>Password</FormControl.Label>
              <Input
                type="password"
                placeholder="Password"
                onChangeText={(value) => setData({ ...formData, password: value })}
                _focus={{borderColor: sentinelTheme.colors.brandPrimary.regular}}
                _hover={{backgroundColor: "transparent"}}
                enablesReturnKeyAutomatically={true}
                returnKeyType="go"
                onSubmitEditing={onSubmit}
              />
              <FormControl.HelperText>Password must contain at least 6 characters.</FormControl.HelperText>
              <FormControl.ErrorMessage>{formErrors.password}</FormControl.ErrorMessage>
            </FormControl>
            <Center>
              <Button mt="7" w="70%" mx="auto" rounded="lg" onPress={onSubmit} backgroundColor="brandPrimary.regular">
                <HStack display="flex" flexDirection="row" h="7">
                  {
                    attemptingSubmit ?
                    (<Spinner accessibilityLabel="Loading posts" color="white" display="None" />) :
                    (<>
                      <Box justifyContent="center">
                        <Text textAlign="right">
                          <Icon
                            as={FontAwesome5}
                            name="id-card"
                            color="white"
                            size="xs" />
                        </Text>
                      </Box>
                      <Box justifyContent="center">
                        <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                          Create Account
                        </Text>
                      </Box>
                    </>)
                  }
                </HStack>
              </Button>
            </Center>
            <HStack mt="0" justifyContent="center">
              <Text
                fontSize="sm"
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
              >
                Already registered?{" "}
              <Link
                _text={{
                  color: "brandPrimary.regular",
                  fontWeight: "medium",
                  fontSize: "sm",
                }}
                onPress={moveLogin}
                >
                Sign in
              </Link>
              </Text>
            </HStack>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}

export default CreateAccount;
