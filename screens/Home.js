import React, { useState, useEffect } from "react";

import {
  Box,
  Heading,
  VStack,
  Button,
  Center,
  NativeBaseProvider,
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
import { Entypo } from "@expo/vector-icons"

// Witchcraft from https://stackoverflow.com/a/62002044
function makeObservable(target) {
  let listeners = [];
  let value = target;
  function get() { return value; }
  function set(newValue) { if (value === newValue) return; value = newValue; listeners.forEach((l) => l(value)); }
  function subscribe(listenerFunc) { listeners.push(listenerFunc); return () => unsubscribe(listenerFunc); }
  function unsubscribe(listenerFunc) { listeners = listeners.filter((l) => l !== listenerFunc); }
  return { get, set, subscribe };
}

const doorListStore = makeObservable({
  "Door1": {
    name: "Door 1",
    locked: false,
  },
  "Door2": {
    name: "Door 2",
    locked: false,
  },
  "Door3": {
    name: "Door 3",
    locked: false,
  },
  "Door4": {
    name: "Door 4",
    locked: true,
  },
  "Door5": {
    name: "Door 5",
    locked: false,
  },
  "Door6": {
    name: "Door 6",
    locked: false,
  },
  "Door7": {
    name: "Door 7",
    locked: true,
  },
 });

function useDoorList() {
  return React.useState(doorListStore.get());
}

// async function getRemoteDoorList() {
//   let doors = await firebase.database().ref(`access-sharing/${firebase.auth().currentUser.uid}`).once("value").catch(error => {
//     console.error(error);
//   });
//   console.log(doors);
//   var updatedList = {};
//   doors.forEach(function(doorSnapshot) {
//     var code = doorSnapshot.key;
//     updatedList[code] = {
//       name: doorSnapshot.child('name').val(),
//       locked: true,
//       access: doorSnapshot.child('access').val()
//     };
//   });
//   console.log(updatedList);
//   return updatedList;
// }

function Home({ navigation }) {
  const [doorList, setDoorList] = useDoorList();

  // let remoteDoorList = getRemoteDoorList();
  // setDoorList(remoteDoorList});
  
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
    navigation.navigate("Door Control", {doorCode: doorCode});
  }
  const openDoorRegistration = () => {
    navigation.navigate("Register Door");
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const doorData = {...doorList};
      const dataCopy = doorData;
      setDoorList(dataCopy);
      //updateDoorList();
    });

    return unsubscribe;
  }, [navigation]);

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
            {Object.entries(doorList).map(([doorCode, doorData])=>(
              <Box key={doorCode}
              w="80%"
              mt="5%"
              margin="auto"
              rounded="xl"
              borderColor={doorData.locked ? "red.700": "green.900"}
              borderWidth="2"
              _dark={{
                borderColor: "coolGray.600",
                backgroundColor: "gray.700",
              }}
              _light={{
                backgroundColor: doorData.locked ? "red.400": "green.500",
              }}
              >
                <Box style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <Text ml="0" w="60%" px="4" py="4" onPress={() => openDoorControl(doorCode)} maxW="350" bold="1">
                    {doorData.name}
                  </Text>
                  <Text mr="0" w="40%" px="4" py="4" onPress={() => openDoorControl(doorCode)} maxW="350" textAlign="right">
                    {doorData.locked ? "Locked" : "Unlocked"}
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
              <Button mt="4" px="3" py="3" colorScheme="lightBlue" onPress={openDoorRegistration} maxW="350" rounded="lg">
                Register Door
              </Button>
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
export { useDoorList };
