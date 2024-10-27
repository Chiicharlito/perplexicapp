export interface NewsItem {
    url: string;
    title: string;
    content: string;
    thumbnail: string | null;
    metadata: string;
    engine: string;
    score: number;
    category: string;
  }