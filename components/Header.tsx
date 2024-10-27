import React from "react";
import { View, TouchableOpacity } from "react-native";
import { X, Bookmark, Share2, MoreVertical } from "lucide-react-native";
import { HeaderProps } from "@/types/props";

export const Header: React.FC<HeaderProps> = ({ onClose, theme }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    }}
  >
    <TouchableOpacity onPress={onClose}>
      <X size={24} color={theme.colors.text} />
    </TouchableOpacity>

    <View style={{ flexDirection: "row", gap: 16 }}>
      <TouchableOpacity>
        <Bookmark size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Share2 size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <TouchableOpacity>
        <MoreVertical size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  </View>
);
