
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  author: string;
  authorId: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  isReported?: boolean;
  image?: string; // Added image support
}

export interface Comment {
  id: string;
  eventId: string;
  author: string;
  authorId: string;
  text: string;
  createdAt: string;
  isReported?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
  eventsCreated: number;
  favoriteEvents?: string[]; // Array of event IDs
  pushToken?: string; // Push notification token
}

export interface PastEventReport {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  city: string;
  author: string;
  authorId: string;
  createdAt: string;
  images?: string[];
  likes: number;
  comments: Comment[];
  isReported?: boolean;
}
