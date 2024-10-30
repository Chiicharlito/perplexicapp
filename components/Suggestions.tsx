import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Layers3 } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import SkeletonLoader from "./Skeleton";

export default function Suggestions({
  suggestions,
  isLoading,
}: {
  suggestions: string[] | null;
  isLoading: boolean;
}) {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const theme = {
    colors: {
      background: isDark ? "#000000" : "#FFFFFF",
      text: isDark ? "#FFFFFF" : "#1A1A1A",
      secondary: isDark ? "#2A2A2A" : "#F5F5F5",
      border: isDark ? "#333333" : "#E5E5E5",
    },
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push({
        pathname: "/result",
        params: {
          query: query.trim(),
        },
      });
    }
  };

  return (
    <View style={{ paddingVertical: 30 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Layers3
          size={24}
          style={{ marginRight: 8 }}
          color={theme.colors.text}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: theme.colors.text,
          }}
        >
          Related
        </Text>
      </View>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        suggestions?.map((suggestion, index) => (
          <Pressable
            onPress={() => handleSearch(suggestion)}
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              key={index}
              style={{
                marginBottom: 8,
                color: theme.colors.text,
                fontWeight: "500",
                maxWidth: "90%",
                fontSize: 18,
              }}
            >
              {suggestion}
            </Text>
            <Ionicons name="add" size={18} color={theme.colors.text} />
          </Pressable>
        ))
      )}
    </View>
  );
}
