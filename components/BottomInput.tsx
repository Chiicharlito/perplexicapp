import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Play, Headphones } from "lucide-react-native";
import { BottomInputProps } from "@/types/props";

export const BottomInput: React.FC<BottomInputProps> = ({ theme }) => (
  <View
    style={{
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
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
      <TouchableOpacity>
        <Play size={24} color={theme.colors.text} style={{ marginRight: 8 }} />
      </TouchableOpacity>
      <Text
        style={{
          flex: 1,
          color: theme.colors.text,
          fontSize: 16,
        }}
      >
        Ask follow-up...
      </Text>
      <TouchableOpacity>
        <Headphones size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  </View>
);
