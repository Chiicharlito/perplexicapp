import { History } from "@/types/history";
import React, { createContext } from "react";

export const SearchContext = createContext({});

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
