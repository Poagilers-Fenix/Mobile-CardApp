import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { firebase } from "../../util/config";

import ArrowTopIcon from "../../components/ArrowTopIcon";
import Modal from "../../components/Modal";
import Global from "../../Global/Global";

const getSuggesMusic = require("../../API/getPlaylist.json");

export default function Playlist({ navigation }) {
  const [artistName, setArtistName] = useState("");
  const [musicName, setMusicName] = useState("");
  const [playlistMusic, setPlaylistMusic] = useState();
  const [isLoading, setLoading] = useState(false);

  async function getMusicPlaylist() {
    setLoading(true);
    const options = {
      method: "GET",
      url: "https://unsa-unofficial-spotify-api.p.rapidapi.com/playlist",
      params: { id: "37i9dQZEVXbMXbN3EUUhlg", start: "0", limit: "10" },
      headers: {
        "x-rapidapi-host": "unsa-unofficial-spotify-api.p.rapidapi.com",
        "x-rapidapi-key": "8c52297b56mshea664a7d6264cb8p16f0bejsndf3573794d9c",
      },
    };

    var arrayMusics = [];
    axios
      .request(options)
      .then(function (response) {
        arrayMusics.push(response.data.Results);
        setPlaylistMusic(
          arrayMusics[0].map((val, i) => {
            return response.data.Results[i];
          })
        );
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        console.error(error);
      });
  }
  async function sugestMusic() {
    if (artistName == "" && musicName == "") {
      Alert.alert(
        "Ops",
        "Preencha os campos acima para enviar sua solicitação"
      );
    } else {
      const suggestMusicId = firebase
        .database()
        .ref()
        .child("suggestMusic/")
        .push().key;
      const userEmail = firebase.auth().currentUser.email;
      records = {
        artistName,
        musicName,
        userEmail,
        suggestMusicId,
        estabId: Global.estabInSession,
        approval: false,
      };
      let updates = {};
      updates["/suggestMusic/" + suggestMusicId] = records;
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          Alert.alert(
            "Solicitação enviada",
            "Sua música será avaliada e poderá ser tocada em breve"
          );
          navigation.navigate("Playlist");
        });
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getMusicPlaylist();
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ArrowTopIcon navigation={navigation}></ArrowTopIcon>
      <Text style={styles.title}>Sugerir Música</Text>
      <Text style={styles.text}>
        Preencha os campos abaixo para sugerir uma música
      </Text>
      <Text style={styles.aviso}>
        <Ionicons name="alert-circle-outline" size={24} />
        Colabore para o bem-estar de todos. Sua sujestão deverá ser pre-aprovada
        antes de ser tocada.
      </Text>
      <TextInput
        placeholder="Digite o nome do artista"
        style={styles.inputCenter}
        value={artistName}
        onChangeText={setArtistName}
      />
      <TextInput
        placeholder="Digite o nome da música"
        style={styles.inputCenter}
        value={musicName}
        onChangeText={setMusicName}
      />
      <Text style={styles.text}>
        Sugestões de músicas do próprio estabelecimento
      </Text>
      {isLoading && (
        <View>
          <ActivityIndicator size="large" color="#800" />
        </View>
      )}
      {!isLoading && (
        <FlatList
          horizontal={true}
          data={playlistMusic}
          style={{ marginTop: 23 }}
          keyExtractor={(item) => item.track.album.images[0].url}
          renderItem={({ item }) => (
            <View style={styles.viewImgs}>
              <TouchableOpacity
                onPress={() => {
                  setArtistName(item.track.album.artists[0].name);
                  setMusicName(item.track.album.name);
                }}
              >
                <Image
                  style={styles.img}
                  source={{ uri: item.track.album.images[0].url }}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={async () => await sugestMusic()}
        >
          <Text style={styles.btnFooterBar}>Enviar Música</Text>
        </TouchableOpacity>
        <Modal navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 40,
    color: "#880000",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 20,
    color: "#282C3F",
    textAlign: "center",
    marginTop: 10,
  },
  text2: {
    fontSize: 16,
    color: "#282C3F",
    marginTop: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0.5,
    padding: 10,
    width: "80%",
    marginLeft: 20,
  },
  inputCenter: {
    height: 40,
    margin: 12,
    borderWidth: 0.5,
    padding: 10,
    marginHorizontal: 30,
  },
  viewImgs: {
    marginHorizontal: 12,
  },
  img: {
    width: 120,
    height: 120,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
  },
  aviso: {
    color: "#800",
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: 10,
  },
  btnFooterBar: {
    height: 50,
    color: "white",
    borderRadius: 8,
    color: "#fff",
    backgroundColor: "#800",
    textAlignVertical: "center",
    fontSize: 20,
    width: 240,
    marginRight: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    textAlign: "center",
  },
});
