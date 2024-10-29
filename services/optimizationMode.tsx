import { SlidersVertical, Zap } from "lucide-react-native";

export const OptimizationMode = ({
  optimizationMode,
}: {
  optimizationMode: string;
}) => {
  switch (optimizationMode) {
    case "speed":
      return <Zap color="#FF9800" size={24} />;
    case "balanced":
      return <SlidersVertical color="#4CAF50" size={24} />;
    default:
      return <Zap color="#FF9800" size={24} />;
  }
};
