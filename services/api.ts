// src/services/api.ts
import { Suggestion } from "@/types/suggestion";
import { SearchResponse } from "../types/api";
import { Chat } from "@/types/chat";
import { History } from "@/types/history";
import { getData } from "./storage";

// Utilitaire pour les appels API
const fetchApi = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const urlServer = await getData("serverURL");
    const response = await fetch(`${urlServer}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

export const searchApi = async (
  query: string,
  history?: History[],
): Promise<SearchResponse> => {
  const parsedHistory: [string, string][] = [];

  if (history) {
    for (const item of history) {
      // Vérification du type de role plus stricte
      if (item.role === "user" || item.role === "assistant") {
        parsedHistory.push([
          item.role === "user" ? "human" : "assistant",
          item.content.trim(),
        ]);
      }
    }
  }

  return fetchApi<SearchResponse>("/search", {
    method: "POST",
    body: JSON.stringify({
      chatModel: {
        provider: "ollama",
        model: "llama3.1:latest",
      },
      embeddingModel: {
        provider: "local",
      },
      focusMode: "webSearch",
      optimizationMode: "balanced",
      query: `${query}. Réponds uniquement dans la même langue que la requête. Recherche des sources uniquement en Français.`,
      history: parsedHistory, // Utilisation du tableau parsé
    }),
  });
};

export const getSuggestions = async (
  history?: History[],
): Promise<Suggestion> => {
  return fetchApi<Suggestion>("/suggestions", {
    method: "POST",
    body: JSON.stringify({
      chat_history: history?.map((item) => ({
        role: item.role,
        content:
          item.content +
          ". Réponds uniquement dans la même langue que la requête.",
      })),
    }),
  });
};

export const getChatsHistory = async (): Promise<Chat[]> => {
  const response = await fetchApi<{ chats: Chat[] }>("/chats");
  return response.chats;
};

export const getChat = async (id: string): Promise<Chat> => {
  return fetchApi<Chat>(`/chats/${id}`);
};
