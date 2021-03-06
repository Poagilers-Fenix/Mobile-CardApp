import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ArrowTopIcon from "../../components/ArrowTopIcon";

import Botao from "../../components/Button";
import Modal from "../../components/Modal";

const dados = require("../../API/pedidos.json");

export default function Comanda({ navigation }) {
  return (
    <View style={{ height: "100%" }}>
      <ArrowTopIcon navigation={navigation}></ArrowTopIcon>
      <Text style={styles.title}>Sua Comanda</Text>
      <View style={styles.item}>
        <Text style={styles.subtitle}>Item</Text>
        <Text style={styles.subtitle}>Qtd e Preço</Text>
      </View>
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <View style={styles.item}>
              <Text style={styles.nomeItem}>{item.nome}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="1"
              />
              <Text style={styles.qtdPreco}>R$ {item.preco}</Text>
              <Ionicons
                name="trash-sharp"
                size={24}
                style={{ flex: 1, marginLeft: 15 }}
              />
            </View>
          </View>
        )}
      />
      <View style={styles.modal}>
        <Text style={styles.aviso}>
          <Ionicons name="alert-circle-outline" size={24} />O pedido não pode
          ser alterado depois de finalizado.
        </Text>
        <TouchableOpacity
          outlined={false}
          titulo="Fazer pedido"
          onPress={() => navigation.navigate("AcompanharPedido")}
        >
          <Text style={styles.btnFooterBar}>Fazer pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: "#800",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 38,
  },
  item: {
    textAlign: "left",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: "gray",
    width: 40,
    marginLeft: 30,
    paddingHorizontal: 15,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  nomeItem: {
    flex: 3,
    textAlign: "center",
    textAlignVertical: "center",
  },
  qtdPreco: {
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,
    marginLeft: 7,
  },
  aviso: {
    color: "#800",
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: 10,
  },
  btnFooterBar: {
    height: 50,
    borderRadius: 8,
    color: "#fff",
    backgroundColor: "#800",
    textAlignVertical: "center",
    fontSize: 20,
    width: 240,
    marginBottom: 15,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  modal: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
});
