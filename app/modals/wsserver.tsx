import { getData, storeData } from "@/services/storage";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WSServerModal() {
  const [server, setServer] = useState<string>("");

  useEffect(() => {
    const getServer = async () => {
      const data = await getData("wsServerURL");

      if (data) {
        setServer(data);
      }
    };

    getServer();
  }, []);

  const saveServer = async () => {
    if (
      server === "" ||
      server === undefined ||
      server === null ||
      server.length === 0
    ) {
      return;
    }

    await storeData("wsServerURL", server);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={server}
        style={styles.input}
        onChangeText={setServer}
        placeholder="wss://your-server-url.com"
      />
      <Button title="Save" onPress={saveServer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
