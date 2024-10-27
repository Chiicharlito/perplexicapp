import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Share,
  Alert,
} from "react-native";
import { Share2, Plus, Mic } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

const HomeScreen = () => {
  const [query, setQuery] = useState<string>("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

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

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Perplexicapp",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.light.background,
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
        <Link href="/settings">
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.light.border,
            }}
          />
        </Link>

        {/* Logo */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            color: Colors.light.text,
          }}
        >
          Perplexica
        </Text>

        {/* Share button */}
        <TouchableOpacity onPress={onShare}>
          <Share2 size={24} color={Colors.light.text} />
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
              color: Colors.light.primary,
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
            color: Colors.light.text,
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
            backgroundColor: Colors.light.secondary,
            borderRadius: 25,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Plus
            size={24}
            color={Colors.light.text}
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Ask anything..."
            placeholderTextColor={isDark ? "#999999" : "#666666"}
            style={{
              flex: 1,
              color: Colors.light.text,
              fontSize: 16,
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Mic size={24} color={Colors.light.text} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
