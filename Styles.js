import { StyleSheet, Text, View } from "react-native";
import React from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  middlecontainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  centeredcontainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#3EB489",
    width: "50%",
    height: "20%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  lockButton: {
    backgroundColor: "#3EB489",
    width: "50%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  text: {
    color: "#3EB489",
    fontFamily: "AppleSDGothicNeo-Bold",
    fontSize: 30,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "white",
    width: "50%",
    height: "15%",
    borderRadius: 8,
    marginBottom: 5,
    borderColor: "#3EB489",
    borderWidth: 3,
  },
});

export { styles };
