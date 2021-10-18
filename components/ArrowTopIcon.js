import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BotaoPedido from "../components/pedido/BotaoPedido";

export default function InputWithIcon({ temPedido, navigation }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10,
        marginTop: 5,
        width: "100%",
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name={"arrow-left"} size={32} color="#666" />
      </TouchableOpacity>
      {temPedido && <BotaoPedido acao={"Comanda"} navigation={navigation} />}
    </View>
  );
}

const styles = StyleSheet.create({
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
