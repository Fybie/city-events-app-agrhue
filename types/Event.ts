
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
}
