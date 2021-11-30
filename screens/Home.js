import React from "react";
import { auth, username, database } from "./Login";
import logo from "../assets/logo.png";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { sentinelLogo, sentinelTheme, sentinelThemeLight, sentinelThemeDark } from "./Login";

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
  HStack,
  Pressable,
  useColorMode
} from "native-base"

import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  "p4qcydmk3c": {
    name: "Front Door",
    locked: false,
    access: "owned"
  },
  "door2": {
    name: "Side Door",
    locked: false,
    access: "owned"
  },
  "door3": {
    name: "Bedroom Door",
    locked: false,
    access: "owned"
  },
  "door4": {
    name: "Sylvie's Apt.",
    locked: true,
    access: "shared"
  },
  "door5": {
    name: "Enoch's Front Door",
    locked: false,
    access: "shared"
  },
  "door6": {
    name: " Berkley's Suite",
    locked: false,
    access: "shared"
  },
  "door7": {
    name: " Billy's Front Door",
    locked: true,
    access: "shared"
  },
 });

function useDoorList() {
  return React.useState(doorListStore.get());
}

async function getRemoteDoorList() {
  let doorsOwned = await firebase.database().ref(`/users/access/${firebase.auth().currentUser.uid}/owned`).once("value").catch(error => {
    console.error(error);
  });
  let doorsShared = await firebase.database().ref(`/users/access/${firebase.auth().currentUser.uid}/shared`).once("value").then((snapshot) => {

  }).catch(error => {
    console.error(error);
  });
  console.log(doors);
  var updatedList = {};
  doors.forEach(function(doorSnapshot) {
    var code = doorSnapshot.key;
    updatedList[code] = {
      name: doorSnapshot.child('name').val(),
      locked: true,
      access: doorSnapshot.child('access').val()
    };
  });
  console.log(updatedList);
  return updatedList;
}

function Home({ navigation }) {
  const colorMode = useColorScheme();
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
      <Pressable
        key={doorCode}
        onPress={() => {navigation.navigate("Door Control", {doorCode: doorCode});}}
        w="85%"
        mt="5%"
        mx="auto"
        rounded="xl"
        borderColor={(doorList[doorCode].locked ? "locked" : "unlocked") + "." + (colorMode === 'dark' ? 'regular' : 'dark')}
        borderWidth="3"
        backgroundColor={(doorList[doorCode].locked ? "locked" : "unlocked") + "." + (colorMode === 'dark' ? 'background.dark' : 'regular')}
        style={{cursor: 'pointer'}}
        >
        <Box
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
          px="3"
          py="2"
          w="100%"
          >
          <Box w="80%" h="100%" justifyContent="center">
            <Text numberOfLines={1} fontSize="md" textAlign="left" bold="1" color={colorMode === 'dark' ? '#fff' : '#000'}>
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
                color={colorMode === 'dark' ? 'locked.regular' : 'locked.dark'}
                size="md"
              /> :
              <Icon
                as={FontAwesome}
                name="unlock-alt"
                color={colorMode === 'dark' ? 'unlocked.regular' : 'unlocked.dark'}
                size="md"
              />
            }
            </Text>
          </Box>
        </Box>
      </Pressable>
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
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
      <SafeAreaView flex={1} edges={['top', 'left', 'right']}>
      <ScrollView mx="auto" w="100%" maxW="500" showsVerticalScrollIndicator={false}>
        <Center mt="5">
          {sentinelLogo()}
        </Center>
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
              fontFamily="Avenir"
              fontWeight="bold"
              textAlign="left"
              ml="5"
              >
              Your Doors
            </Heading>
            {generateDoorButtons(doorList, "access", "owned")}
          </Box>
          <Box mt="0" mb="5">
            <Heading
                size="lg"
                fontWeight="600"
                fontFamily="Avenir"
                fontWeight="bold"
                textAlign="left"
                ml="5"
                >
                Shared Doors
              </Heading>
            {generateDoorButtons(doorList, "access", "shared")}
          </Box>
          {/* <Box mt="0" mb="5">
            <Heading
              size="lg"
              fontWeight="600"
              fontFamily="Avenir"
              fontWeight="bold"
              textAlign="left"
              mt="0"
              ml="5"
            >
              Your Friends
            </Heading>
            <Center>
              <Button mt="4" mx="auto" rounded="lg" onPress={() => {navigation.navigate("Friends");}} backgroundColor="brandPrimary.regular">
                <HStack>
                  <Box justifyContent="center">
                    <Text>
                      <Icon
                        as={FontAwesome5}
                        name="user-plus"
                        color="white"
                        size="xs"
                      />
                    </Text>
                  </Box>
                  <Box justifyContent="center">
                    <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                      Find Friends
                    </Text>
                  </Box>
                </HStack>
              </Button>
            </Center>
          </Box> */}
          <Box>
          <Heading
            size="lg"
            fontWeight="600"
            fontFamily="Avenir"
            fontWeight="bold"
            textAlign="left"
            mt="0"
            ml="5"
            >
              Settings
            </Heading>
            <Center>
              <Button mt="4" rounded="lg" onPress={() => {navigation.navigate("Register Door");}} backgroundColor="brandPrimary.regular">
                <HStack>
                  <Box justifyContent="center">
                    <Text>
                      <Icon
                        as={FontAwesome5}
                        name="plus"
                        color="white"
                        size="xs"
                      />
                    </Text>
                  </Box>
                  <Box justifyContent="center">
                    <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                      Register Door
                    </Text>
                  </Box>
                </HStack>
              </Button>
              <Button mt="4" rounded="lg" onPress={onSignout} backgroundColor="danger.600">
                <HStack>
                  <Box justifyContent="center">
                    <Text>
                      <Icon
                        as={FontAwesome}
                        name="sign-out"
                        color="white"
                        size="xs"
                      />
                    </Text>
                  </Box>
                  <Box justifyContent="center">
                    <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                      Sign Out
                    </Text>
                  </Box>
                </HStack>
              </Button>
            </Center>
          </Box>
        </VStack>
      </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

export default Home;
export { useDoorList };
