import React, { useState } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StarRating from "react-native-star-rating";

export default function InputWithIcon({ title, onChange, value }) {
  return (
    <View>
      <Text style={styles.labelRating}>{title}</Text>
      <View style={{ paddingHorizontal: 55 }}>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={value}
          fullStarColor="#800"
          selectedStar={onChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRating: {
    marginVertical: 10,
    fontSize: 16,
    marginHorizontal: 30,
    fontWeight: "bold",
  },
});
