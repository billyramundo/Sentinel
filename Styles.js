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
  back: {
    flex: 1,
    backgroundColor: "#5E9CF7",
  },
  button: {
    backgroundColor: "gray",
    width: "50%",
    height: "20%",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontFamily: "Arial",
    fontSize: 30,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "white",
    width: "50%",
    height: "15%",
    borderRadius: 8,
    marginBottom: 5,
  },
});

export { styles };
