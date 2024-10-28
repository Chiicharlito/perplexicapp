import { SourceItemProps } from "@/types/props";
import { Image, Text, View } from "react-native";
import { ExternalLink } from "./ExternalLink";

export const SourceItem: React.FC<SourceItemProps> = ({ source, theme }) => (
  <ExternalLink
    href={source.metadata.url}
    style={{
      backgroundColor: theme.colors.secondary,
      borderRadius: 20,
      padding: 12,
      marginRight: 12,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        flexWrap: "wrap",
        overflow: "hidden",
      }}
    >
      {source.metadata.favicon ? (
        <Image
          source={{ uri: source.metadata.favicon }}
          style={{ width: 16, height: 16, marginRight: 8 }}
        />
      ) : (
        <View
          style={{
            width: 16,
            height: 16,
            backgroundColor: theme.colors.border,
            borderRadius: 8,
            marginRight: 8,
          }}
        />
      )}
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 14,
          opacity: 0.7,
          flexWrap: "wrap",
        }}
      >
        {source.metadata.title.slice(0, 30)}...
      </Text>
    </View>
  </ExternalLink>
);
