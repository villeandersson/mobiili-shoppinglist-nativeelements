import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import * as SQLite from "expo-sqlite";
import { Header, Input, Button, ListItem } from "react-native-elements";

const db = SQLite.openDatabase("shoppinglist.db");

export default function App() {
  const [maara, setMaara] = useState("");
  const [tuote, setTuote] = useState("");
  const [tuotteet, setTuotteet] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists tuotteet (id integer primary key not null, maara int, tuote text);"
      );
    });
    updateList();
  }, []);

  const saveItem = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into tuotteet (maara, tuote) values (?, ?);", [
          parseInt(maara),
          tuote,
        ]);
      },
      null,
      updateList
    );
    console.log(tuotteet);
  };

  const updateList = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from tuotteet;", [], (_, { rows }) =>
        setTuotteet(rows._array)
      );
    });
  };

  const deleteItem = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from tuotteet where id = ?;`, [id]);
      },
      null,
      updateList
    );
  };

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: "menu", color: "white" }}
        centerComponent={{
          text: "OSTOSLISTA",
          style: { color: "white" },
        }}
        rightComponent={{ icon: "home", color: "white" }}
      />
      <Input
        label="Tuotteen nimi"
        placeholder="Syötä tuotteen nimi"
        style={{
          fontSize: 18,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(tuote) => setTuote(tuote)}
        value={tuote}
      />
      <Input
        label="Määrä"
        placeholder="Syötä tuotteen määrä"
        keyboardType="numeric"
        style={{
          marginBottom: 5,
          fontSize: 18,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
        }}
        onChangeText={(maara) => setMaara(maara)}
        value={maara}
      />
      <Button
        raised
        icon={{ name: "save", color: "white" }}
        onPress={saveItem}
        title="Tallenna"
      />
      <FlatList
        style={{ width: "90%" }}
        data={tuotteet}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Swipeable
              leftContent={
                <Button
                  icon={{ name: "delete", color: "red" }}
                  buttonStyle={{ minHeight: "100%", backgroundColor: "white" }}
                  onPress={() => deleteItem(item.id)}
                  title="DELETE"
                />
              }
            >
              <ListItem.Title>{item.tuote}</ListItem.Title>
              <ListItem.Subtitle>{item.maara}</ListItem.Subtitle>
            </ListItem.Swipeable>
          </ListItem>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
