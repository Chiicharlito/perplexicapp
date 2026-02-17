import { History } from "@/types/history";
import React, { createContext } from "react";

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  history: History[];
  setHistory: (history: History[]) => void;
}

export const SearchContext = createContext<SearchContextType>({
  query: "",
  setQuery: () => {},
  focusMode: "webSearch",
  setFocusMode: () => {},
  optimizationMode: "speed",
  setOptimizationMode: () => {},
  history: [],
  setHistory: () => {},
});

export default function SearchProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [query, setQuery] = React.useState("");
  const [focusMode, setFocusMode] = React.useState("webSearch");
  const [optimizationMode, setOptimizationMode] = React.useState("speed");
  const [history, setHistory] = React.useState<History[]>([]);

  return (
    <SearchContext.Provider
      value={{
        query: query,
        setQuery: (query: string) => setQuery(query),
        focusMode: focusMode,
        optimizationMode: optimizationMode,
        setFocusMode: (focusMode: string) => setFocusMode(focusMode),
        setOptimizationMode: (optimizationMode: string) =>
          setOptimizationMode(optimizationMode),
        history: history,
        setHistory: (history: History[]) => setHistory(history),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
