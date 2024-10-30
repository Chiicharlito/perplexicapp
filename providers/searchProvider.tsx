import React, { createContext } from "react";

export const SearchContext = createContext({
  query: "",
  setQuery: (query: string) => {},
  focusMode: "webSearch",
  optimizationMode: "speed",
  setFocusMode: (focusMode: string) => {},
  setOptimizationMode: (optimizationMode: string) => {},
});

export default function SearchProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [query, setQuery] = React.useState("");
  const [focusMode, setFocusMode] = React.useState("webSearch");
  const [optimizationMode, setOptimizationMode] = React.useState("speed");

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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
