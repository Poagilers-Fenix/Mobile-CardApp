import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import Botao from "../components/Button";
import { Picker } from "@react-native-picker/picker";
import Modal_ from "../components/Modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import ArrowTopIcon from "../components/ArrowTopIcon";
import { firebase } from "../util/config";
import Global from "../Global/Global";

export default function Illumination({ navigation }) {
  const [modoIluminacao, SetModoIluminacao] = useState("floresta");
  const [relatorio, setRelatorio] = useState([]);
  const [msgLog, setMsgLog] = useState("");

  async function updateRelatorio() {
    let relatorioEspecifico;
    relatorio.filter((val) => {
      if (val.CodigoEstabelecimento == Global.estabInSession) {
        relatorioEspecifico = val;
      }
    });
    relatorioEspecifico.NumeroAtivacaoLuz += 1;
    firebase
      .database()
      .ref("/Relatorio/" + relatorioEspecifico.CodigoRelatorio)
      .set(relatorioEspecifico);
  }

  const createUser = async () => {
    try {
      const res = await fetch("https://node-red---cardapp.mybluemix.net/luz", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modoLuz: modoIluminacao,
        }),
      });
      if (res.status == 200) {
        Alert.alert(
          "Sucesso",
          "Modo de iluminação mudado para " + modoIluminacao
        );
      }
      if (res.status !== 200) {
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao trocar a iluminação, tente novamente mais tarde"
        );
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        "Erro interno, tente novamente mais tarde ou contate o suporte"
      );
      console.error(error);
    }
  };

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
      await getRelatorios();
    }
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <ArrowTopIcon navigation={navigation}></ArrowTopIcon>
      <Text style={styles.HeaderText}>Mudar iluminação</Text>
      <Text style={styles.normalText}>
        Selecione um modo de iluminação para que sua mesa fique do jeito
        desejado
      </Text>
      <View style={styles.viewPicker}>
        <Picker
          style={styles.pickerStyle}
          selectedValue={modoIluminacao}
          onValueChange={(itemValue) => SetModoIluminacao(itemValue)}
        >
          <Picker.Item label="Floresta" value={"floresta"} />
          <Picker.Item label="Crepúsculo" value={"crepusculo"} />
          <Picker.Item label="Praia" value={"praia"} />
          <Picker.Item label="Desligar Iluminação" value={"desligar"} />
        </Picker>
      </View>
      <View>
        <Text style={styles.aviso}>
          <Ionicons name="alert-circle-outline" size={24} />
          As luzes da mesa variam de intensidade conforme modo selecionado
        </Text>
      </View>
      <View style={styles.viewBtn}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={async () => {
            updateRelatorio();
            await createUser();
          }}
        >
          <Text style={styles.full}>Selecionar</Text>
        </TouchableOpacity>
        <View style={styles.modal}>
          <Modal_ navigation={navigation} />
        </View>
      </View>
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
  },
  normalText: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    marginHorizontal: 15,
  },
  modal: {
    marginTop: 40,
  },
  viewPicker: {
    marginTop: 40,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 7,
  },

  pickerStyle: {
    padding: 20,
  },
  viewBtn: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  aviso: {
    color: "#800",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  full: {
    height: 50,
    width: "75%",
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
  outlined: {
    height: 50,
    width: "75%",
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
    marginTop: 15,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
