import React, { useState } from "react";
import { styles } from "../Styles";
import SearchField from "react-search-field";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { firebaseApp } from "../screens/Login";
import { database } from "../screens/Login";

import { View, TextInput, Text, TouchableOpacity } from "react-native";

//var serviceAccount = "service-account-file.json";

// initializeApp({
//   credential: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDW9xx4aZZ0Ukbu\nkei3Qg3YVi3NgeQzm63oAapKvHT2gDU5/MSuXTrtYuhvVWYmv/BsI+SbRsMWNkYR\n7k7t6BYoxQ7QtWlWnA/sVPR23JlHKUgsp4Nrn+Zl68UpZx79S1OKtyP/lOYjWmQN\nEPqKBFob58mlFstCH4y5qEFA6GeqA72BsfFKMBxPVkcugwtAWil5dCozgvYqEodk\nwzbKNfUqNZRt55oDvqoksByXFMGLsdGli+GAag11pxZfigSL7l03oeR+TlzzmZe/\nUwnuml+BH7bSAx2fgE62CM+joAaLMPJ6urUtTPh5T+dR2yUtmoOr9dXcg4DmbMRI\nb4jJlJc5AgMBAAECggEAVeZcSZ/D4AqqzpWevXBXUP4rAman1pmctkvIDWJeiMw1\nuMzRmW2m6QpvoGGrVsu3WrdDGGt/9KXOfUbR4o6uIC+SmoMLq3DkigduwvqnA4Ez\nFqj/wqecbVj4KfHLt+L8aL+DUpPhHPp3ZaNFwpY3ndQTR3Wi1nL+DIh4PuQ/3Hcz\neNZyUf370HE3aZ7XV6Dxv3q1WEOVyErDInAfVACCOwf6BQDVmP2xNqcfw5OooqLp\nCBZ6T8uJIwecEOxLSqiEgJ9N4V5gxrw0fMezSDzXbP8kJUxRgjmUwKNPKbITZ0vD\ndENSzxZwsCl8LiIc5nLbwQDhewKBMtIzKR1pjqskwwKBgQD1vc+hfkc4stlBVV8p\nMqeYAevmSWNum+eTHRBHcj3DV9YjFN9GDOoN4KptkM45le1uY+H/K5jTU0djqVbC\npWH84q4zRpA4WMYGVuL41YIqUoIAYUvhd2qofkczpBmacRut196X+j9H71ord6Uo\nxe6NJK63KO5qd1YOOxFEdxQmIwKBgQDf8GbGZ9AP0Nqw5xAFH2STzJAhmALvtRFu\ngh0RRb195IODWCJ3UrXf+wlhKtS4ZMeaJk1ws2UHsDN0SBQA9X3iA6cc14gpls3Y\n548ABC3bv+aKwVF2JeTe784BobgZaz2guBWJyz4PVW5Du4h+cKhW2vy0q4mXAUsx\n32Y1JnZM8wKBgQDg/LF2Z8kJTiW+vUzsySXL9CZoptRUVoUEmd1nrF6D1I2HfPqW\nhghcQE+JFMTa0Dubj/M/zkiTYnG/+zAl8YjvIRLge0BbdluHPlF8BO6xlOzVMD9q\n5AxQy5yg2SNf1SLEXRm9By6cy7VAisA5vk4UB3u20dDGxQ+S492BU4ytBQKBgFUp\nXDxZoGNTXsdlp8766EnYwns0DvHP3ygybRFzfyOQMn9RlhHgr2/VTPTZz/mrwcia\nhlq0rlglJvwyqQDQWyYHk5bBVHPUeMXjEZvE+xeVu/vKlssikA5EDgjK0nNAODiV\nqQM0+o3kREGX4MmM2EfnkbC3h2SYxlraBUlzLgwHAoGBAMnw6+ovAbzTb8iN9v8i\nmb0jSxUKOcUqwEeiQE6EvbLgnvRjaT1qecqB0BYEJczuZcKVmC89BEy9O0U7i67g\nRLZXc9imque3lajVetBb9iT9+Yo289/iJfZqVXG3fBSBp7hFVbZF25sIm4YB0u8V\nlGHbeygLU/8Q4Coq56mKtqTQ",
//   databaseURL: "https://sentinel-a6249-default-rtdb.firebaseio.com"
// });

function Friends({ navigation }) {
  const [email, setEmail] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  var [showResults, setShowResults] = useState(false);
  //var currentAuth = firebase.auth(firebaseApp);
  const getUser = () => {
    database
      .ref()
      .child("users")
      .child(email)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(email);
          setDisplayEmail(email);
          setShowResults(true);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    // currentAuth.getUserByEmail(email)
    //     .then((userRecord) => {
    //         setDisplayEmail(userRecord.getEmail());
    //         console.log("Successfully found user");
    //     })
    //     .catch((error) => {
    //         console.log("User does not exist")
    //     });
  };
  if (showResults == false) {
    return (
      <View style={styles.back}>
        <View style={styles.centeredcontainer}>
          <SearchField
            placeholder="Search for friends"
            onChange={(email) => setEmail(email)}
            onSearchClick={getUser}
          />
        </View>
        <View style={styles.middlecontainer}>
          <Text style={{ fontSize: 30 }}>No users match your search!</Text>
        </View>
        <View style={styles.middlecontainer}></View>
        <View style={styles.middlecontainer}></View>
      </View>
    );
  } else {
    return (
      <View style={styles.back}>
        <View style={styles.centeredcontainer}>
          <SearchField
            placeholder="Search for friends"
            onChange={(email) => setEmail(email)}
            onSearchClick={getUser}
          />
        </View>
        <View style={styles.middlecontainer}>
          <Text style={{ fontSize: 30 }}>
            We found your friend,{" "}
            <Text
              style={{
                color: "#3EB489",
                textTransform: "uppercase",
                fontSize: 30,
              }}
            >
              {displayEmail}
            </Text>
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text
              style={{
                color: "white",
                fontSize: 30,
                textTransform: "uppercase",
                fontFamily: "AppleSDGothicNeo-Bold",
              }}
            >
              Give Access
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text
              style={{
                color: "white",
                fontSize: 30,
                textTransform: "uppercase",
                fontFamily: "AppleSDGothicNeo-Bold",
              }}
            >
              Request Access
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.middlecontainer}></View>
        <View style={styles.middlecontainer}></View>
      </View>
    );
  }
}

export default Friends;
