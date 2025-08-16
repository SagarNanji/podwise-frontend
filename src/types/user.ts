export interface User {
  _id?: string;
  name?: string;
  email?: string;
  company?: string;
  title?: string;
  bio?: string;
  createdAt?: string; // usually ISO string from API
  // Do NOT include plaintext password on the client
}
