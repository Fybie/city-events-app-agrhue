
import { Event, User, Comment } from '../types/Event';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Max Mustermann',
    email: 'max@example.com',
    city: 'Berlin',
    isAdmin: false,
    isBanned: false,
    createdAt: '2024-01-01',
    eventsCreated: 3
  },
  {
    id: '2',
    name: 'Anna Schmidt',
    email: 'anna@example.com',
    city: 'München',
    isAdmin: false,
    isBanned: false,
    createdAt: '2024-01-02',
    eventsCreated: 2
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    city: 'Hamburg',
    isAdmin: true,
    isBanned: false,
    createdAt: '2024-01-01',
    eventsCreated: 0
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    eventId: '1',
    author: 'Anna Schmidt',
    authorId: '2',
    text: 'Klingt super! Bin dabei!',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    eventId: '1',
    author: 'Max Mustermann',
    authorId: '1',
    text: 'Freue mich schon darauf!',
    createdAt: '2024-01-15T11:00:00Z'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Stadtfest Berlin 2024',
    description: 'Großes Stadtfest mit Live-Musik, Food Trucks und Aktivitäten für die ganze Familie.',
    date: '2024-06-15',
    time: '14:00',
    location: 'Alexanderplatz',
    city: 'Berlin',
    author: 'Max Mustermann',
    authorId: '1',
    createdAt: '2024-01-15T09:00:00Z',
    likes: 25,
    comments: mockComments.filter(c => c.eventId === '1')
  },
  {
    id: '2',
    title: 'Konzert im Park',
    description: 'Entspanntes Konzert mit lokalen Bands im Stadtpark.',
    date: '2024-05-20',
    time: '18:00',
    location: 'Stadtpark',
    city: 'München',
    author: 'Anna Schmidt',
    authorId: '2',
    createdAt: '2024-01-14T15:30:00Z',
    likes: 18,
    comments: []
  },
  {
    id: '3',
    title: 'Flohmarkt Wochenende',
    description: 'Großer Flohmarkt mit Vintage-Artikeln, Büchern und Antiquitäten.',
    date: '2024-04-28',
    time: '09:00',
    location: 'Marktplatz',
    city: 'Hamburg',
    author: 'Max Mustermann',
    authorId: '1',
    createdAt: '2024-01-13T12:00:00Z',
    likes: 12,
    comments: []
  },
  {
    id: '4',
    title: 'Food Festival',
    description: 'Internationale Küche von lokalen Restaurants und Food Trucks.',
    date: '2024-07-10',
    time: '11:00',
    location: 'Rheinufer',
    city: 'Köln',
    author: 'Anna Schmidt',
    authorId: '2',
    createdAt: '2024-01-12T08:45:00Z',
    likes: 31,
    comments: []
  }
];

// Current user simulation
export const currentUser: User = mockUsers[0]; // Max Mustermann
export const adminUser: User = mockUsers[2]; // Admin User
