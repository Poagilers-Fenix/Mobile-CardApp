import React from "react";
import { StyleSheet, View, StatusBar, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function BotaoPedido({ navigation, acao }) {
  return (
    <View style={styles.botaoPedido}>
      <TouchableOpacity onPress={() => navigation.navigate(acao)}>
        <Ionicons name="basket-outline" size={30} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  botaoPedido: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
});
