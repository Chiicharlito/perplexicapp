import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { getChat, getSuggestions } from "@/services/api";
import { Header } from "@/components/Header";
import { SourceItem } from "@/components/SourceItem";
import { BottomInput } from "@/components/BottomInput";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Headphones } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Suggestions from "@/components/Suggestions";
import { History } from "@/types/history";
import { Ionicons } from "@expo/vector-icons";

export default function Result() {
  const params = useLocalSearchParams();
  const query = params.query;
  const chatId = params.id;
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);

  const [loading, setLoading] = useState(false);
  const [streamedMessage, setStreamedMessage] = useState("");
  const [sources, setSources] = useState([]);
  const [history, setHistory] = useState<History[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isDark = useColorScheme() === "dark";
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);

  const theme = {
    colors: {
      background: isDark ? "#000000" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#1A1A1A",
      secondary: isDark ? "#2A2A2A" : "#F5F5F5",
      border: isDark ? "#333333" : "#E5E5E5",
    },
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const fetchChat = async () => {
    const data = await getChat(chatId as string);

    setStreamedMessage(data.messages[1].content);
  };

  useEffect(() => {
    if (chatId) {
      fetchChat();
      return;
    }
    const connectWebSocket = () => {
      const parsedHistory: [string, string][] = history.map((item) => [
        item.role === "user" ? "human" : "assistant",
        item.content,
      ]);

      // Construire l'URL avec les paramètres de connexion
      const wsUrl = `ws://192.168.1.57:3001?chatModelProvider=ollama&chatModel=llama3.1:latest`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        // Envoyer la requête une fois la connexion établie
        const message = {
          type: "message",
          focusMode: "webSearch",
          optimizationMode: "balanced",
          history: parsedHistory,
          message: {
            content: query,
            chatId: chatId || generateId(),
            messageId: generateId(),
          },
        };
        wsRef.current?.send(JSON.stringify(message));
        setLoading(true);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "message":
            setStreamedMessage((prev) => prev + data.data);
            break;
          case "sources":
            setSources(data.data);
            break;
          case "messageEnd":
            setLoading(false);
            break;
          case "error":
            setError(data.data);
            setLoading(false);
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        setError("WebSocket error occurred");
        setLoading(false);
      };

      wsRef.current.onclose = () => {
        setLoading(false);
      };
    };

    if (query) {
      connectWebSocket();
    }

    return () => {
      wsRef.current?.close();
    };
  }, [query]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        setHistory([
          ...history,
          { role: "user", content: streamedMessage },
          { role: "assistant", content: query as string },
        ]);
        const data = await getSuggestions([
          ...history,
          { role: "user", content: streamedMessage },
          { role: "assistant", content: query as string },
        ]);
        setSuggestions(data?.suggestions);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    if (!loading && streamedMessage) {
      fetchSuggestions();
    }
  }, [loading, streamedMessage]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header onClose={() => router.replace("/")} query={query} theme={theme} />

      <ScrollView>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "600",
            color: theme.colors.text,
            padding: 16,
          }}
        >
          {query}
        </Text>

        <View style={{ marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {!loading &&
              sources.length > 0 &&
              sources.map((source, index) => (
                <SourceItem key={index} source={source} theme={theme} />
              ))}
          </ScrollView>
        </View>

        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons
              name="disc-outline"
              size={20}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: theme.colors.text,
              }}
            >
              Answer
            </Text>
            <TouchableOpacity
              style={{
                marginLeft: "auto",
                backgroundColor: theme.colors.secondary,
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Headphones size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {loading && !streamedMessage ? (
            <ActivityIndicator size="large" />
          ) : (
            <View>
              {error ? (
                <Text style={{ color: "red" }}>{error}</Text>
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: 16,
                      lineHeight: 24,
                      color: theme.colors.text,
                    }}
                  >
                    {streamedMessage}
                  </Text>
                  <Suggestions
                    suggestions={suggestions}
                    isLoading={isLoadingSuggestions}
                  />
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomInput theme={theme} />
    </SafeAreaView>
  );
}
