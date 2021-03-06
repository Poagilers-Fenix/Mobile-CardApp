import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { firebase } from "../../../util/config";
import Global from "../../../Global/Global";

export default function Categories({ route }) {
  let { items } = route.params;
  let { categorieCod } = route.params;
  const [isLoading, setLoading] = useState(true);
  const [listItems, setListItems] = useState([]);
  const [relatorio, setRelatorio] = useState([]);
  const [estab, setEstab] = useState([]);

  async function getItemsById() {
    var arrayItems = [];
    var db = firebase.database().ref().child("itemCardapio/");
    db.on("child_added", (snapshot) => {
      arrayItems.push(snapshot.val());
      arrayItems = arrayItems.filter((val) => {
        return (
          val.CodigoEstabelecimento ==
          (typeof items == "string" ? items : items.CodigoEstabelecimento)
        );
      });
      setListItems(
        arrayItems.filter((val) => {
          return typeof categorieCod == "string"
            ? val.Destaque == "S"
            : val.Categoria == categorieCod;
        })
      );
    });
  }

  async function getEstabById() {
    var arrayEstab = [];
    var db = firebase.database().ref().child("estab/");
    db.on("child_added", (snapshot) => {
      arrayEstab.push(snapshot.val());
      setEstab(
        arrayEstab.filter((val) => {
          return val.CodigoEstabelecimento == items;
        })
      );
    });
  }

  async function updateRelatorio() {
    let relatorioEspecifico;
    relatorio.filter((val) => {
      if (val.CodigoEstabelecimento == Global.estabInSession) {
        relatorioEspecifico = val;
      }
    });
    relatorioEspecifico.NumeroAcessosItemCardapio += 1;
    firebase
      .database()
      .ref("/Relatorio/" + relatorioEspecifico.CodigoRelatorio)
      .set(relatorioEspecifico);
  }

  async function getRelatorios() {
    var arraylistRelatorios = [];
    var db = firebase.database().ref().child("Relatorio/");
    db.on("child_added", (snapshot) => {
      arraylistRelatorios.push(snapshot.val());
      setRelatorio(
        arraylistRelatorios.filter((val) => {
          return val;
        })
      );
    });
  }
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (typeof items == "string") {
        await getEstabById();
      }
      await getItemsById();
      await getRelatorios();
      setLoading(false);
    }
    fetchData();
  }, []);
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.subContainer}
      onPress={(val) => updateRelatorio()}
    >
      <View>
        <Image
          style={styles.imgList}
          source={{
            uri:
              item.Foto == null
                ? "https://raw.githubusercontent.com/Poagilers-Fenix/WebApp-Challenge/main/Imagens/no-image-found.png?token=AOXNWKVBRD3WDDJKASDBZT3BHUBDY"
                : item.Foto,
          }}
        ></Image>
      </View>
      <View style={styles.cardList}>
        <Text
          style={(styles.cardText, { color: "#880000", fontWeight: "bold" })}
        >
          {item.Nome}
        </Text>
        <Text style={(styles.cardText, { fontWeight: "bold" })}>
          {item.ValCalorico} Kcal
        </Text>
        <Text style={styles.cardText}>{item.Descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View>
      <View style={styles.container}>
        {estab.length > 0 && (
          <Text style={styles.titulo}>{estab[0].NomeFantasia}</Text>
        )}
        {typeof items == "object" && (
          <Text style={styles.titulo}>{items.NomeFantasia}</Text>
        )}
      </View>
      {listItems.length == 0 && (
        <View>
          <Text style={styles.textOnEmpty}>
            Hmmm!! Nada por aqui. Navegue para outra aba.
          </Text>
        </View>
      )}
      <SafeAreaView style={(styles.container, { marginBottom: 140 })}>
        {isLoading && (
          <View style={styles.messageContainer}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        )}
        <FlatList
          data={listItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.CodigoItem}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  titulo: {
    textAlign: "center",
    fontSize: 38,
    color: "#880000",
    fontWeight: "bold",
    marginVertical: 10,
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
  },
  imgList: {
    width: 100,
    height: 100,
    borderRadius: 7,
    marginRight: 9,
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",

    borderRadius: 7,

    width: 250,
  },
  cardText: {
    marginHorizontal: 0,
  },
  textOnEmpty: {
    marginTop: 30,
    paddingHorizontal: 10,
    fontSize: 20,
    color: "#aaa",
    textAlign: "center",
  },
});
