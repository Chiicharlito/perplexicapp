export type ChatModel = {
  provider: "openai" | "ollama";
  model: string;
  customOpenAIBaseURL?: string;
  customOpenAIKey?: string;
};

export type EmbeddingModel = {
  provider: "openai" | "local";
  model?: string;
};

export type FocusMode =
  | "webSearch"
  | "academicSearch"
  | "writingAssistant"
  | "wolframAlphaSearch"
  | "youtubeSearch"
  | "redditSearch";

export type OptimizationMode = "speed" | "balanced";

export interface SearchRequest {
  chatModel: ChatModel;
  embeddingModel: EmbeddingModel;
  focusMode: FocusMode;
  optimizationMode: OptimizationMode;
  query: string;
  history?: [string, string][];
}

export interface Source {
  pageContent: string;
  metadata: {
    title: string;
    url: string;
    favicon?: string;
  };
}

export interface SearchResponse {
  message: string;
  sources: Source[];
}
