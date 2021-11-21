import React, { useState } from "react";

import {
  Box,
  Heading,
  VStack,
  Button,
  Center,
  NativeBaseProvider,
  useColorMode
} from "native-base"

import { auth, username, database } from "./Login";
import logo from "../assets/logo.png";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

function Home({ navigation }) {
  const getDate = () => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return date;
  };
  const getTime = () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  };

  const findFriends = () => {
    navigation.navigate("Friends");
  }
  const openDoorControl = (doorCode) => {
    navigation.navigate("DoorControl", {"doorCode": doorCode});
  }

  return (
    <NativeBaseProvider>
      <Box safeArea mx="auto" mt="2" p="2" py="8" w="100%" maxW="500">
        <Center>
          <Heading
            size="xl"
            fontWeight="600"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
            fontFamily="Avenir"
            fontWeight="bold"
            textAlign="center"
          >
            Welcome home, {username}!
          </Heading>
        </Center>

        <VStack space={3} mt="6">
          <Center>
            <Button mt="6" px="3" py="3" colorScheme="lightBlue" onPress={findFriends} maxW="350">
              Find Friends
            </Button>
          </Center>
          <Center>
            <Button mt="6" px="3" py="3" colorScheme="lightBlue" onPress={() => openDoorControl(`${"doorCode1"}`)} maxW="350">
              Open door page
            </Button>
          </Center>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}

export default Home;
