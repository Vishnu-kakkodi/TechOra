export interface MessageParams {
    apikey: string;
    sender: string;
    to: string[];
    message: string;
    format: 'json' | 'xml';
  }
  