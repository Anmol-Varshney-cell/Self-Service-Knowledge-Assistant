
export interface HRDocument {
  id: string;
  name: string;
  content: string;
  type: 'pdf' | 'docx' | 'txt';
  category?: string;
  uploadDate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string;
  citations?: string[];
  isLoading?: boolean;
}

export interface RAGResponse {
  answer: string;
  citations: string[];
  category: string;
}
