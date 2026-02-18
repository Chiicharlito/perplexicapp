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
