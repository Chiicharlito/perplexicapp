import { OptimizationModes } from "@/constants/OptimizationsModes";
import { SearchContext } from "@/providers/searchProvider";
import { OptimizationMode } from "@/services/optimizationMode";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OptimizationModeModal() {
  const router = useRouter();
  const { optimizationMode, setOptimizationMode } = useContext(SearchContext);
  const theme = useColorScheme();

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 16, backgroundColor: "#fff" }}
    >
      <ScrollView>
        {OptimizationModes.map((mode) => (
          <Pressable
            key={mode.title}
            onPress={() => {
              setOptimizationMode(mode.optimizationMode);
              router.back();
            }}
            style={{
              flexDirection: "column",
              gap: 8,
              borderBottomColor: "#EAEAEA",
              borderBottomWidth: 1,
              paddingVertical: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <OptimizationMode optimizationMode={mode.optimizationMode} />
              <Text
                style={{
                  fontWeight: "700",
                  color:
                    optimizationMode === mode.optimizationMode
                      ? "#24A0ED"
                      : "#000",
                }}
              >
                {mode.title}
              </Text>
            </View>
            <Text style={{ color: "#777", fontWeight: "400" }}>
              {mode.description}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
