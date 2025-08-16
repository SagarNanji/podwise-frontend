export interface Message {
  sender: "user" | "bot";
  content: string;
  timestamp: string;
}
