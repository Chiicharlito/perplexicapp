// src/screens/LibraryScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Search, Clock } from "lucide-react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getChatsHistory } from "@/services/api";

type SearchItem = {
  id: string;
  query: string;
  preview: string;
  timestamp: string;
  isLocked?: boolean;
  image?: string;
};

export default function History() {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<SearchItem[]>([]);
  const isDark = useColorScheme() === "dark";

  const theme = {
    colors: {
      background: isDark ? "#000000" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#1A1A1A",
      secondary: isDark ? "#2A2A2A" : "#F5F5F5",
      border: isDark ? "#333333" : "#E5E5E5",
    },
  };

  const fetchChatsHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getChatsHistory();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatsHistory();
  }, []);

  const renderHistoryItem = (item: SearchItem) => (
    <Link
      key={item.id}
      href={{ pathname: "/result", params: { query: item.title, id: item.id } }}
      style={{
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
        flexDirection: "column",
        alignSelf: "stretch",
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 18,
            color: theme.colors.text,
            fontWeight: "500",
            marginBottom: 8,
          }}
        >
          {item.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Clock
            size={16}
            color={theme.colors.text}
            style={{ marginRight: 4 }}
          />
          <Text style={{ color: theme.colors.text, fontSize: 14 }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Link>
  );

  const renderChatsHistory = () => {
    if (!chats || !chats.length) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#1A1A1A",
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            No results found
          </Text>
        </View>
      );
    }
    return chats.map((item) => renderHistoryItem(item));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "600",
            color: "#1A1A1A",
          }}
        >
          Library
        </Text>
        <TouchableOpacity>
          <Search size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchChatsHistory}
          />
        }
      >
        {isLoading ? <ActivityIndicator size="large" /> : renderChatsHistory()}
      </ScrollView>
    </SafeAreaView>
  );
}
