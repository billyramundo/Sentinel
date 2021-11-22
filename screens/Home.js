import React, { useState } from "react";

import {
  Box,
  Heading,
  VStack,
  Button,
  Center,
  NativeBaseProvider,
  Container,
  Content,
  Text,
  ScrollView,
  useColorMode
} from "native-base"

import { auth, username, database } from "./Login";
import logo from "../assets/logo.png";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

let doors = [
  {
    name: "Door 1",
    locked: false,
  },
  {
    name: "Door 2",
    locked: true,
  },
  {
    name: "Door 3",
    locked: true,
  },
  {
    name: "Door 4",
    locked: false,
  },
  {
    name: "Door 5",
    locked: true,
  },
  {
    name: "Door 6",
    locked: false,
  },
  {
    name: "Door 7",
    locked: true,
  },
];

function doorListContent(){
  return doors.map((door, index) => (
  <Box>
    <Center>
      <Button px="3" py="3" colorScheme="lightGreen" onPress={() => openDoorControl(door.name)} maxW="350">
        {door.name}
      </Button>
    </Center>
  </Box>
  ));
}

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
  const openDoorControl = (door) => {
    navigation.navigate("Door Control", {door: door});
  }
  const onSignout = () => {
    firebase.auth().signOut().then(() => {
      // Go to Login screen and reset nav stack
      navigation.reset({
        routes: [{ name: "Sign In" }]
      });
      console.log(`Signed out: currentUser (should be null) = ${firebase.auth().currentUser}`);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <NativeBaseProvider>
      <ScrollView safeArea mx="auto" w="100%" maxW="500">
        <VStack space={3} mt="8" mb="8">
          {/* <Center>
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
              mt="5"
              mb="7"
            >
              Welcome, {firebase.auth().currentUser.displayName}!
            </Heading>
          </Center> */}
          <Box mt="0" mb="5">
            <Heading
                size="lg"
                fontWeight="600"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
                fontFamily="Avenir"
                fontWeight="bold"
                textAlign="left"
                ml="5"
              >
                Your Doors
              </Heading>
            {/* Door list */}
            {doors.map((door, index)=>(
              <Box key={door.name}
              w="80%"
              mt="5%"
              margin="auto"
              rounded="xl"
              borderColor="coolGray.200"
              borderWidth="1"
              _dark={{
                borderColor: "coolGray.600",
                backgroundColor: "gray.700",
              }}
              _light={{
                backgroundColor: door.locked ? "red.400": "green.500",
              }}
              >
                <Box style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text ml="0" w="60%" px="4" py="4" onPress={() => openDoorControl(door)} maxW="350">
                    {door.name}
                  </Text>
                  <Text mr="0" w="40%" px="4" py="4" onPress={() => openDoorControl(door)} maxW="350" textAlign="right">
                    {door.locked ? "Locked" : "Unlocked"}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
          <Box mt="0" mb="5">
            <Heading
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              fontFamily="Avenir"
              fontWeight="bold"
              textAlign="left"
              mt="0"
              ml="5"
            >
              Your Friends
            </Heading>
            <Center>
              <Button mt="4" px="3" py="3" colorScheme="lightBlue" onPress={findFriends} maxW="350" rounded="lg">
                Find Friends
              </Button>
            </Center>
          </Box>
          <Box>
          <Heading
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              fontFamily="Avenir"
              fontWeight="bold"
              textAlign="left"
              mt="0"
              ml="5"
            >
              Settings
            </Heading>
            <Center>
              <Button mt="4" px="3" py="3" colorScheme="red" onPress={onSignout} maxW="350" rounded="lg">
                Sign Out
              </Button>
            </Center>
          </Box>
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
}

export default Home;
export { doors };
