import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BookOpenText, Home, Search } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home
              color={focused ? Colors[colorScheme ?? "light"].tint : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <Search
              color={focused ? Colors[colorScheme ?? "light"].tint : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chats/index"
        options={{
          title: "Library",
          tabBarIcon: ({ color, focused }) => (
            <BookOpenText
              color={focused ? Colors[colorScheme ?? "light"].tint : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
