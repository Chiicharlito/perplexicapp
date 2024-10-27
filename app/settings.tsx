import { Colors } from "@/constants/Colors";
import { usePreferences } from "@/hooks/usePreferences";
import { getData } from "@/services/storage";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { serverURL, wsServerURL } = usePreferences();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Link href="/">
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </Link>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "400",
            color: Colors.light.text,
            marginLeft: 8,
          }}
        >
          Settings
        </Text>
      </View>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Link
          href="/modals/server"
          style={{ flexDirection: "column", marginBottom: 30 }}
        >
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                color: Colors.light.text,
                marginBottom: 5,
              }}
            >
              Server URL
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "300",
                color: Colors.light.text,
              }}
            >
              {serverURL || "https://your-server-url.com"}
            </Text>
          </View>
        </Link>
        <Link href="/modals/wsserver" style={{ flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                color: Colors.light.text,
                marginBottom: 5,
              }}
            >
              WebSockets URL
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "300",
                color: Colors.light.text,
              }}
            >
              {wsServerURL || "wss://your-server-url.com"}
            </Text>
          </View>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
