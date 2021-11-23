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
  Icon,
  extendTheme,
  useColorMode
} from "native-base"

import { auth, username, database } from "./Login";
import logo from "../assets/logo.png";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

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
    access: "owner"
  },
  "Door2": {
    name: "Door 2",
    locked: false,
    access: "shared"
  },
  "Door3": {
    name: "Door 3",
    locked: false,
    access: "owner"
  },
  "Door4": {
    name: "Door 4",
    locked: true,
    access: "shared"
  },
  "Door5": {
    name: "Door 5",
    locked: false,
    access: "owner"
  },
  "Door6": {
    name: "Door 6",
    locked: false,
    access: "owner"
  },
  "Door7": {
    name: "Door 7",
    locked: true,
    access: "owner"
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

const sentinelTheme = {
  locked: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};

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
  function generateDoorButtons(doorList, filterKey, filterVal) {
    return Object.keys(doorList).filter(doorCode => doorList[doorCode][filterKey] === filterVal).map(doorCode => 
      <Button
        key={doorCode}
        w="85%"
        mt="5%"
        margin="auto"
        rounded="xl"
        borderColor={doorList[doorCode].locked ? "red.800": "green.900"}
        borderWidth="3"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _light={{
          backgroundColor: doorList[doorCode].locked ? "red.400": "green.500",
        }}
        onPress={() => openDoorControl(doorCode)}
        >
          <Box
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'row',
          }}
          px="3"
          py="2"
          >
          <Box w="80%" h="100%" justifyContent="center">
            <Text fontSize="md" textAlign="left" bold="1">
              {doorList[doorCode].name}
            </Text>
          </Box>
          <Box w="20%" h="100%" justifyContent="center">
            <Text textAlign="right">
            {
              doorList[doorCode].locked ?
              <Icon
                as={FontAwesome}
                name="lock"
                color="coolGray.900"
                _dark={{
                  color: "warmGray.50",
                }}
                size="md"
              /> :
              <Icon
                as={FontAwesome}
                name="unlock-alt"
                color="green.900"
                _dark={{
                  color: "warmGray.50",
                }}
                size="md"
              />
            }
            </Text>
          </Box>
        </Box>
      </Button>
    )
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
    <NativeBaseProvider theme={extendTheme({colors: sentinelTheme})}>
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
            {generateDoorButtons(doorList, "access", "owner")}
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
                ml="5"
              >
                Shared Doors
              </Heading>
            {generateDoorButtons(doorList, "access", "shared")}
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
            <Button mt="4" rounded="lg" onPress={openDoorRegistration} backgroundColor="lightBlue.500">
                <Box
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  >
                  <Box h="100%" justifyContent="center">
                    <Text textAlign="right">
                      <Icon
                        as={FontAwesome5}
                        name="user-plus"
                        color="white"
                        size="xs"
                      />
                    </Text>
                  </Box>
                  <Box ml="2" h="100%" justifyContent="center">
                    <Text fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                      Find Friends
                    </Text>
                  </Box>
                </Box>
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
              <Button mt="4" rounded="lg" onPress={openDoorRegistration} backgroundColor="lightBlue.500">
                <Box
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  >
                  <Box h="100%" justifyContent="center">
                    <Text textAlign="right">
                      <Icon
                        as={FontAwesome5}
                        name="map-marker-alt"
                        color="white"
                        size="xs"
                      />
                    </Text>
                  </Box>
                  <Box ml="2" h="100%" justifyContent="center">
                    <Text fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                      Register Door
                    </Text>
                  </Box>
                </Box>
              </Button>
              <Button mt="4" rounded="lg" onPress={onSignout} backgroundColor="danger.600">
                <Box
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                  >
                  <Box h="100%" justifyContent="center">
                    <Text textAlign="right">
                      <Icon
                        as={FontAwesome}
                        name="sign-out"
                        color="white"
                        size="sm"
                      />
                    </Text>
                  </Box>
                  <Box ml="2" h="100%" justifyContent="center">
                    <Text fontSize="sm" textAlign="left" fontWeight="bold" color="white">
                      Sign Out
                    </Text>
                  </Box>
                </Box>
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
