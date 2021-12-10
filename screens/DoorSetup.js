import React, { useState } from "react";
import logo from "../assets/logo.png";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { sentinelLogo, sentinelTheme, sentinelThemeLight, sentinelThemeDark, useDoorList, showToast } from "./Login";
import { FontAwesome5 } from "@expo/vector-icons";
import 'react-native-get-random-values';
import axios from "axios";

import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  KeyboardAvoidingView,
  Spinner,
  Icon,
  extendTheme,
  useColorMode
} from "native-base"

import { Alert, useColorScheme, Appearance, Platform } from "react-native"

function DoorSetup({ navigation, route }) {
  const colorMode = useColorScheme();
  const [doorList, setDoorList] = useDoorList();
  const doorCode = route.params.doorCode;
  var [formData, setData] = useState({});
  var [formErrors, setErrors] = useState({});
  const [attemptingSubmit, setAttemptingSubmit] = useState(false);

  async function validate() {
    if (!('email' in formData) || formData.email.length === 0) {
      setErrors({email: 'Email address is required'});
      return false;
    }
    if (!('password' in formData) || formData.password.length === 0) {
      setErrors({password: 'Password is required'});
      return false;
    }

    try {
      let response = await axios.post(`https://${doorCode}.tunnel.kundu.io/auth/setup`, {email: formData.email, password: formData.password});
    } catch(error) {
      console.error(error);
      showToast("Failed to set up door!", "error");
      return false;
    }
    return true;
  };

  async function onSubmit(){
    let validated = await validate();
    if(!validated) {
      console.log('Validation Failed');
      setAttemptingSubmit(false);
      return;
    }
    showToast("Successfully set up door", "success");
    setAttemptingSubmit(false);
  };

  const moveLogin = () => {
    navigation.pop()
  }

  return (    
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
      <Center flex={1} px="3" mt="0">
        <KeyboardAvoidingView
          h="auto"
          w="80%"
          maxW="400"
          justifyContent="flex-end"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS !== 'web' ? 
            Platform.select({
               ios: () => 100,
               android: () => 200
            })() : 0
          }
          >
          <Box safeArea p="2" py="8" w="100%" maxW="800">
            <Center>
              <HStack>
                <Box justifyContent="center">
                  <Text
                    fontSize={25}
                    fontWeight="600"
                    color="brandPrimary.regular"
                    fontFamily="Avenir"
                    fontWeight="black"
                    >
                    Door Setup
                  </Text>
                </Box>
                <Box ml="4" justifyContent="center" textAlign="center">
                  <Text>
                    <Icon
                      as={FontAwesome5}
                      name="tools"
                      color="brandPrimary.regular"
                      size={7}
                    />
                  </Text>
                </Box>
              </HStack>
            </Center>
            <VStack space={3} mt="8" mb="8">
              <Box justifyContent="center" mb={6}>
                <Text
                  fontSize={12}
                  color={colorMode === "dark" ? "gray.300" : "gray.700"}
                  fontFamily="Avenir"
                  textAlign="center"
                  >
                  Please enter the authentication details (usually, your own) that you'd like your door to use.
                </Text>
              </Box>
              <FormControl isRequired isInvalid={'email' in formErrors}>
                <Input
                  placeholder="Email address"
                  autoCapitalize="none"
                  onChangeText={(value) => setData({ ...formData, email: value })}
                  _focus={{borderColor: sentinelTheme.colors.brandPrimary.regular}}
                  _hover={{backgroundColor: "transparent"}}
                />
                <FormControl.HelperText>Sentinel Account Email</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.email}</FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'password' in formErrors}>
                <Input
                  placeholder="Password"
                  autoCapitalize="none"
                  onChangeText={(value) => setData({ ...formData, password: value })}
                  _focus={{borderColor: sentinelTheme.colors.brandPrimary.regular}}
                  _hover={{backgroundColor: "transparent"}}
                  enablesReturnKeyAutomatically={true}
                  returnKeyType="go"
                  onSubmitEditing={onSubmit}
                />
                <FormControl.HelperText>Sentinel Account Password</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.password}</FormControl.ErrorMessage>
              </FormControl>
              <Center>
                <Button mt="7" w="70%" mx="auto" rounded="lg" onPress={onSubmit} backgroundColor="brandPrimary.regular">
                  <HStack display="flex" flexDirection="row" h="7">
                  {
                    attemptingSubmit ?
                    (<Spinner accessibilityLabel="Updating door..." color="white" display="None" />) :
                    (<>
                      <Box justifyContent="center">
                        <Text textAlign="right">
                          <Icon
                            as={FontAwesome5}
                            name="wrench"
                            color="white"
                            size="xs" />
                        </Text>
                      </Box>
                      <Box justifyContent="center">
                        <Text ml="2" fontSize="sm" fontWeight="medium" color="white">
                          Update Door
                        </Text>
                      </Box>
                    </>)
                  }
                  </HStack>
                </Button>
              </Center>
            </VStack>
          </Box>
        </KeyboardAvoidingView>
      </Center>
    </NativeBaseProvider>
  );
}

export default DoorSetup;
