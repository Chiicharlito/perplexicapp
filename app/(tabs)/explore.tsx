import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Search } from "lucide-react-native";
import { NewsItem } from "@/types/explore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = useColorScheme() === "dark";

  const theme = {
    colors: {
      background: isDark ? "#000000" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#1A1A1A",
      secondary: isDark ? "#2A2A2A" : "#F5F5F5",
      border: isDark ? "#333333" : "#E5E5E5",
    },
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("http://192.168.1.57:3001/api/discover");
      const data = await response.json();
      setNews(data.blogs);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderNewsCard = (item: NewsItem) => (
    <TouchableOpacity
      key={item.url}
      style={{
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: theme.colors.secondary,
        overflow: "hidden",
      }}
    >
      {item.thumbnail && (
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: "100%",
            height: 200,
            resizeMode: "cover",
          }}
        />
      )}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: theme.colors.text,
            marginBottom: 8,
          }}
          numberOfLines={3}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: theme.colors.text,
            opacity: 0.8,
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {item.content}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.text,
            opacity: 0.6,
          }}
        >
          {item.metadata}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        <Search size={24} color={theme.colors.text} />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "600",
            color: theme.colors.text,
            marginLeft: 12,
          }}
        >
          Discover
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator
          style={{ flex: 1 }}
          size="large"
          color={theme.colors.text}
        />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {news.map(renderNewsCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
