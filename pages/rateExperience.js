import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Modal_ from "../components/Modal";
import Botao from "../components/Button";
import RatingInputWithLabel from "../components/input/RatingInputWithLabel";
import { firebase } from "../util/config";
import { Picker } from "@react-native-picker/picker";

export default function rateExperience({ navigation }) {
  const [loading, isLoading] = useState(false);
  const [text, setText] = useState("");
  const [stars1, setStars1] = useState(0);
  const [stars2, setStars2] = useState(0);
  const [stars3, setStars3] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState(0);
  const [listRequests, setListRequests] = useState([]);

  async function getEstab() {
    var arrayItems = [];
    var db = firebase.database().ref().child("estab/");
    db.on("child_added", (snapshot) => {
      arrayItems.push(snapshot.val());
      setListRequests(
        arrayItems.filter((val) => {
          return val;
        })
      );
    });
  }

  function handleExperience() {
    if (selectedRestaurant == 0) {
      Alert.alert("Erro", "Selecione um restaurante a ser avaliado");
    } else {
      isLoading(true);
      const mediaRating = Number(((stars1 + stars2 + stars3) / 3).toFixed(1));
      const ratingId = firebase.database().ref().child("rating/").push().key;
      const UserEmail = firebase.auth().currentUser.email;
      records = {
        rating: mediaRating,
        UserEmail,
        text,
        estabId: selectedRestaurant,
        ratingId,
      };
      let updates = {};
      updates["/rating/" + ratingId] = records;
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          navigation.navigate("Restaurants");
        });
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getEstab();
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.HeaderText}>Avaliar experiência</Text>
      <Text style={styles.normalText}>
        Nos ajude a melhorar! Avalie sua experiência no restaurante frequentado.
      </Text>
      <Picker
        style={styles.pickerContainer}
        selectedValue={selectedRestaurant}
        onValueChange={setSelectedRestaurant}
      >
        <Picker.Item label="Selecione um estabelecimento..." />
        {listRequests.map((element, i) => {
          return (
            <Picker.Item
              key={i}
              label={element.NomeFantasia}
              value={element.CodigoEstabelecimento}
            />
          );
        })}
      </Picker>
      <RatingInputWithLabel
        title="Como estava sua refeição?"
        value={stars1}
        onChange={setStars1}
      />
      <RatingInputWithLabel
        title="Como foi o atendimento?"
        value={stars2}
        onChange={setStars2}
      />
      <RatingInputWithLabel
        title="O ambiente estava agradável?"
        value={stars3}
        onChange={setStars3}
      />
      <TextInput
        multiline={true}
        style={styles.textInput}
        numberOfLines={8}
        onChangeText={setText}
        value={text}
        placeholder={
          "Deixe um comentário justificando sua avaliação sobre sua experiência, fique à vontade! Além de nos ajudar, também auxilia outras pessoas que venham a utilizar o aplicativo."
        }
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Restaurants")}
        >
          <Text style={styles.outlined}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleExperience}
        >
          {loading && (
            <Text style={styles.full}>
              <ActivityIndicator size="large" color="#fff" />
            </Text>
          )}
          {!loading && <Text style={styles.full}>Avaliar</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.modal}>
        <Modal_ navigation={navigation} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  HeaderText: {
    textAlign: "center",
    color: "#800",
    fontSize: 38,
    fontWeight: "bold",
    marginTop: 20,
  },
  pickerContainer: {
    marginTop: "4%",
    padding: 22,
    marginHorizontal: 20,
    color: "#aaa",
    backgroundColor: "#ededed",
  },
  normalText: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginHorizontal: 20,
  },
  modal: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  textInput: {
    borderWidth: 1,
    marginTop: 30,
    marginHorizontal: 30,
    marginBottom: 10,
    textAlignVertical: "top",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  outlined: {
    height: 50,
    width: 150,
    paddingBottom: 5,
    color: "white",
    borderRadius: 8,
    borderColor: "#800",
    borderWidth: 2,
    color: "#800",
    textAlignVertical: "center",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 19,
  },
  full: {
    height: 50,
    width: 150,
    paddingBottom: 5,
    color: "white",
    borderRadius: 8,
    color: "#fff",
    backgroundColor: "#800",
    textAlignVertical: "center",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 20,
  },
});
