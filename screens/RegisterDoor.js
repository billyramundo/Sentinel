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
  useColorMode
} from "native-base"

import { Alert, useColorScheme, Appearance, Platform } from "react-native"

function RegisterDoor({ navigation }) {
  
  var [formData, setData] = useState({});
  var [formErrors, setErrors] = useState({});

  async function validate() {
    formErrors = {};

    if (!('code' in formData) || formData.code.length === 0) {
      setErrors({
        ...formErrors,
        code: 'Code is required',
      });
      return false;
    } else if (formData.code.length < 10) {
      setErrors({
        ...formErrors,
        code: 'Code must be 10 digits',
      });
      return false;
    }

    if (!('name' in formData) || formData.name.length === 0) {
      setErrors({
        ...formErrors,
        name: 'A door name is required',
      });
      return false;
    }

    let code = formData.code.toLowerCase();
  
    // Attempt to create door
    let uid = firebase.auth().currentUser.uid;
    let data = {};
    data[uid] = true;
    await firebase.database().ref(`doors/${code}/owners`).set(data).catch(error => {
      if (error.code.toUpperCase() === 'PERMISSION_DENIED') {
        setErrors({
          ...formErrors,
          code: 'An error occurred',
        });
        return false;
      }
      console.error(error.code);
      console.error(error);
  
      // Do not validate
      return false;
    });

    // Add user as owner under access-sharing
    await firebase.database().ref(`access-sharing/${uid}/${code}`).update({access: "owner"}).catch(error => {
      if (error.code.toUpperCase() === 'PERMISSION_DENIED') {
        setErrors({
          ...formErrors,
          code: 'An error occurred',
        });
        return false;
      }
      console.error(error.code);
      console.error(error);
  
      // Do not validate
      return false;
    });

    // Add nickname for door
    await firebase.database().ref(`access-sharing/${uid}/${code}`).update({name: formData.name}).catch(error => {
      if (error.code.toUpperCase() === 'PERMISSION_DENIED') {
        setErrors({
          ...formErrors,
          code: 'An error occurred',
        });
        return false;
      }
      console.error(error.code);
      console.error(error);
  
      // Do not validate
      return false;
    });
    return true;
  };

  async function onSubmit(){
    let validated = await validate();
    if(!validated) {
      console.log('Validation Failed');
      return;
    }
    console.log('Information validated & door registered successfully');
    // Go home
    navigation.pop();
  };

  const moveLogin = () => {
    navigation.pop()
  }

  const { colorMode, toggleColorMode } = useColorMode();
  Appearance.addChangeListener(toggleColorMode, colorMode);
  toggleColorMode(colorMode);

  return (    
    <NativeBaseProvider>
      <Center flex={1} px="3" mt="0">
        <KeyboardAvoidingView
          h="auto"
          w="80%"
          maxW="400"
          justifyContent="flex-end"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.select({
               ios: () => 100,
               android: () => 200
            })()
          }
        >
          <Box safeArea p="2" py="8" w="100%" maxW="800">
            <Center>
              <Heading
                size="xl"
                fontWeight="600"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
                fontFamily="Avenir"
                fontWeight="black"
              >
                Register Door
              </Heading>
            </Center>

            <VStack space={3} mt="8" mb="8">
              <FormControl isRequired isInvalid={'code' in formErrors}>
                <Input
                  placeholder="10-digit code"
                  maxLength={10}
                  autoCapitalize="characters"
                  onChangeText={(value) => setData({ ...formData, code: value })}
                />
                <FormControl.HelperText>The 10-digit code of the Sentinel Device</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.code}</FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'name' in formErrors}>
                <Input
                  placeholder="Door name"
                  autoCapitalize="words"
                  onChangeText={(value) => setData({ ...formData, name: value })}
                />
                <FormControl.HelperText>A name for this door, e.g. "Front Door"</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.name}</FormControl.ErrorMessage>
              </FormControl>
              <Center>
                <Button mt="10" colorScheme="lightBlue" onPress={onSubmit}>
                  Register
                </Button>
              </Center>
            </VStack>
          </Box>
        </KeyboardAvoidingView>
      </Center>
    </NativeBaseProvider>
  );
}

export default RegisterDoor;
