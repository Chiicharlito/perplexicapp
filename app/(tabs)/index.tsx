import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Share,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { Share2, ScanEye, Settings, Zap } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { SearchContext } from "@/providers/searchProvider";
import { SearchTypeIcon } from "@/services/searchTypeIcon";
import { OptimizationMode } from "@/services/optimizationMode";

const HomeScreen = () => {
  const [query, setQuery] = useState<string>("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { focusMode, optimizationMode } = useContext(SearchContext);

  const handleSearch = () => {
    if (query.trim()) {
      router.push({
        pathname: "/result",
        params: {
          query: query.trim(),
          focusMode,
          optimizationMode,
        },
      });
      setQuery(""); // Reset le champ après la recherche
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        title: "Perplexicapp",
        message:
          "Discover Perplexica App for Perplexica Project : https://github.com/Chiicharlito/perplexicapp",
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeview}>
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar placeholder */}
        <Link href="/settings">
          <Settings size={24} color={Colors.light.text} />
        </Link>

        {/* Logo */}
        <Text style={styles.logo}>Perplexica</Text>

        {/* Share button */}
        <TouchableOpacity onPress={onShare}>
          <Share2 size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Tagline */}
        <Text style={styles.tagline}>Research begins here.</Text>
      </View>

      {/* Bottom Input Bar */}
      <View style={styles.bottomInputBarContainer}>
        <View style={styles.bottomInputBarView}>
          <Pressable onPress={() => router.push("/modals/focusMode")}>
            {focusMode === "webSearch" ? (
              <ScanEye color={Colors.light.text} size={24} />
            ) : (
              <SearchTypeIcon
                searchType={focusMode}
                color={Colors.light.text}
              />
            )}
          </Pressable>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Ask anything..."
            placeholderTextColor={isDark ? "#999999" : "#666666"}
            style={styles.textInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable onPress={() => router.push("/modals/optimizationMode")}>
            <OptimizationMode optimizationMode={optimizationMode} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.light.text,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 20,
  },
  bottomInputBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bottomInputBarView: {
    flexDirection: "row",
    backgroundColor: Colors.light.secondary,
    borderRadius: 25,
    padding: 12,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    color: Colors.light.text,
    fontSize: 16,
    paddingLeft: 12,
  },
});

export default HomeScreen;
