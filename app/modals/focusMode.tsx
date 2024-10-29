import { SearchTypes } from "@/constants/SearchTypes";
import { SearchContext } from "@/providers/searchProvider";
import { SearchTypeIcon } from "@/services/searchTypeIcon";
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

export default function FocusModeModal() {
  const router = useRouter();
  const { focusMode, setFocusMode } = useContext(SearchContext);
  const theme = useColorScheme();

  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 16, backgroundColor: "#fff" }}
    >
      <ScrollView>
        {SearchTypes.map((searchType) => (
          <Pressable
            key={searchType.focusMode}
            onPress={() => {
              setFocusMode(searchType.focusMode);
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
              <SearchTypeIcon
                searchType={searchType.focusMode}
                color={focusMode === searchType.focusMode ? "#24A0ED" : "#000"}
              />
              <Text
                style={{
                  fontWeight: "700",
                  color:
                    focusMode === searchType.focusMode ? "#24A0ED" : "#000",
                }}
              >
                {searchType.label}
              </Text>
            </View>
            <Text style={{ color: "#777", fontWeight: "400" }}>
              {searchType.description}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
