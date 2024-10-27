import { Theme } from './theme';
import { Source } from './api';
import { HomeScreenNavigationProp, ResultScreenNavigationProp, ResultScreenRouteProp } from './navigation';

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