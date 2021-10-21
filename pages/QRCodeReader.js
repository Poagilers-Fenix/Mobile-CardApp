import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { firebase } from "../util/config";

import Botao from "../components/Button";
import Global from "../Global/Global";
export default function TelaCadastro({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState("");
  const [estab, setEstab] = useState([]);
  const [isValidQRCode, setIsValidQRCode] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      await getEstab();
    })();
  }, []);

  async function getEstab() {
    var arrayEstab = [];
    var db = firebase.database().ref().child("estab/");
    db.on("child_added", (snapshot) => {
      arrayEstab.push(snapshot.val());
      setEstab(
        arrayEstab.filter((val) => {
          return val;
        })
      );
    });
  }

  if (hasPermission === null) {
    return <Text>Requisitando permissão para ter acesso à camera.</Text>;
  }
  if (hasPermission === false) {
    return <Text>A permissão de acesso à câmera foi negada</Text>;
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data}`);
    setData(data);

    Global.estabInSession = data;
    let isRight;
    isRight = estab.find((val) => {
      if (val.CodigoEstabelecimento == data) {
        return true;
      }
    });
    if (isRight) {
      setIsValidQRCode(isRight);
      navigation.navigate({
        name: "Menu",
        params: { items: data },
      });
    } else {
      setIsValidQRCode(false);
    }
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Posicione a câmera sobre o QRCode localizado no estabelecimento
      </Text>

      <View style={{ width: 320, height: 450 }}>
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      </View>
      {!isValidQRCode && (
        <Text style={{ color: "#f00", textAlign: "center" }}>
          QRCode inválido, tente novamente ou contate o estabelecimento para
          mais informações
        </Text>
      )}
      <View style={{ width: 250, marginTop: 30 }}>
        <Botao
          titulo="Ver Cardápios"
          acao={"Restaurants"}
          navigation={navigation}
        />
        <Botao
          outlined={true}
          titulo="Ver meus pedidos"
          acao={"MyRequests"}
          navigation={navigation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    textAlign: "center",
    fontSize: 21,
    color: "#480000",
    marginBottom: 60,
  },
  label: {
    color: "#666",
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: "#aaa",
    borderRadius: 5,
    width: 300,
    height: 40,
    marginBottom: 10,
    alignItems: "center",
    paddingLeft: 5,
    flexDirection: "row",
  },
});
