export interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
  data: any[];
  columns: string[];
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  visualization?: {
    type: 'bar' | 'line' | 'pie';
    data: any[];
  };
}

export interface QuestionSuggestion {
  text: string;
  type: 'column' | 'aggregate' | 'filter';
}