import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  Animated,
  Easing,
  Button,
} from "react-native";
import { getChat, getSuggestions } from "@/services/api";
import { Header } from "@/components/Header";
import { SourceItem } from "@/components/SourceItem";
import { BottomInput } from "@/components/BottomInput";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Headphones, Disc3, BookCopy } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Suggestions from "@/components/Suggestions";
import { History } from "@/types/history";
import * as Speech from "expo-speech";
import { usePreferences } from "@/hooks/usePreferences";
import SkeletonLoader from "@/components/Skeleton";

export default function Result() {
  const { wsServerURL } = usePreferences();
  const params = useLocalSearchParams();
  const query = params.query;
  const chatId = params.id;
  const focusMode = params.focusMode;
  const optimizationMode = params.optimizationMode;
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
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timing = Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    if (!loading) {
      Animated.loop(timing).stop();
      return;
    }

    Animated.loop(timing).start();
  }, [loading]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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
    const parsedMetadata = JSON.parse(data.messages[1].metadata);

    setSources(parsedMetadata.sources);
  };

  useEffect(() => {
    if (!wsServerURL) {
      return;
    }

    if (chatId) {
      fetchChat();
      return;
    }
    const connectWebSocket = () => {
      const parsedHistory: [string, string][] = history.map((item) => [
        item.role === "user" ? "human" : "assistant",
        item.content,
      ]);

      const wsUrl = `${wsServerURL}?chatModelProvider=ollama&chatModel=llama3.1:latest`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        const message = {
          type: "message",
          focusMode: focusMode || "webSearch",
          optimizationMode: optimizationMode || "speed",
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
  }, [query, wsServerURL]);

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
    <SafeAreaView
      style={[
        styles.safeAreaView,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Header onClose={() => router.replace("/")} query={query} theme={theme} />
      <ScrollView>
        <Text style={[styles.query, { color: theme.colors.text }]}>
          {query}
        </Text>

        {loading && !streamedMessage ? (
          <SkeletonLoader />
        ) : (
          <View>
            {error ? (
              <Text style={{ color: "red" }}>{error}</Text>
            ) : (
              <>
                <View style={{ padding: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <BookCopy
                      size={24}
                      style={{ marginRight: 4 }}
                      color={theme.colors.text}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "600",
                        color: theme.colors.text,
                      }}
                    >
                      Sources
                    </Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                    <Animated.View
                      style={{
                        transform: [{ rotate: spin }],
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Disc3 size={24} color={theme.colors.text} />
                    </Animated.View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "600",
                        marginLeft: 8,
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
                      onPress={() => Speech.speak(streamedMessage)}
                    >
                      <Headphones size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>
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
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>

      <BottomInput theme={theme} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  query: {
    fontSize: 24,
    fontWeight: "400",
    padding: 16,
  },
});
