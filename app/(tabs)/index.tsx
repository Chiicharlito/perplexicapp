import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  TextInput,
} from "react-native";
import { Share2, Plus, Mic } from "lucide-react-native";
import { useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [query, setQuery] = useState<string>("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  // Thème personnalisé
  const theme = {
    colors: {
      background: isDark ? "#000000" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#1A1A1A",
      primary: "#008080", // Couleur teal pour le logo
      secondary: isDark ? "#2A2A2A" : "#F5F5F5",
      border: isDark ? "#333333" : "#E5E5E5",
    },
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push({
        pathname: "/result",
        params: {
          query: query.trim(),
        },
      });
      setQuery(""); // Reset le champ après la recherche
    }
  };

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
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
        }}
      >
        {/* Avatar placeholder */}
        <TouchableOpacity>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.border,
            }}
          />
        </TouchableOpacity>

        {/* Logo */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            color: theme.colors.text,
          }}
        >
          Perplexica
        </Text>

        {/* Share button */}
        <TouchableOpacity>
          <Share2 size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        {/* Logo icon */}
        <View
          style={{
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 48,
              color: theme.colors.primary,
            }}
          >
            ❋
          </Text>
        </View>

        {/* Tagline */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "600",
            color: theme.colors.text,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Where knowledge begins
        </Text>
      </View>

      {/* Bottom Input Bar */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: theme.colors.secondary,
            borderRadius: 25,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Plus
            size={24}
            color={theme.colors.text}
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Ask anything..."
            placeholderTextColor={isDark ? "#999999" : "#666666"}
            style={{
              flex: 1,
              color: theme.colors.text,
              fontSize: 16,
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Mic size={24} color={theme.colors.text} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
