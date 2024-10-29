import { Ionicons } from "@expo/vector-icons";
import { BadgePercent, Globe, Pencil, SwatchBook } from "lucide-react-native";

export const SearchTypeIcon = ({
  searchType,
  color,
}: {
  searchType: string;
  color: string;
}) => {
  switch (searchType) {
    case "webSearch":
      return <Globe color={color} />;
    case "academicSearch":
      return <SwatchBook color={color} />;
    case "writingAssistant":
      return <Pencil color={color} />;
    case "wolframAlphaSearch":
      return <BadgePercent color={color} />;
    case "youtubeSearch":
      return <Ionicons name="logo-youtube" color={color} size={24} />;
    case "redditSearch":
      return <Ionicons name="logo-reddit" color={color} size={24} />;
    default:
      return <Globe color={color} />;
  }
};
