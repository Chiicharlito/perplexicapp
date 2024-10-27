import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Result: {
    query: string;
  };
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type ResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Result"
>;

export type ResultScreenRouteProp = RouteProp<RootStackParamList, "Result">;

// src/types/props.ts
import { Theme } from "./theme";
import { Source } from "./api";

export interface HeaderProps {
  onClose: () => void;
  theme: Theme;
}

export interface SourceItemProps {
  source: Source;
  theme: Theme;
}

export interface BottomInputProps {
  theme: Theme;
  onSubmit?: (query: string) => void;
}

export interface ResultScreenProps {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}
