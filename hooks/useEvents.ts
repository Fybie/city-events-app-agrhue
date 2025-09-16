
import { useState, useEffect } from 'react';
import { Event, Comment, User } from '../types/Event';
import { mockEvents, mockUsers, currentUser } from '../data/mockData';
import { useFavorites } from './useFavorites';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const favorites = useFavorites();

  // Get unique cities from all events
  const getAvailableLocations = () => {
    const cities = [...new Set(events.map(event => event.city))];
    return cities.sort();
  };

  // Filter events based on selected location
  const getFilteredEvents = () => {
    if (selectedLocation === 'all') {
      return events;
    }
    return events.filter(event => event.city === selectedLocation);
  };

  const addEvent = (newEvent: Omit<Event, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    console.log('Adding new event:', newEvent.title);
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    setEvents(prev => [event, ...prev]);
  };

  const deleteEvent = (eventId: string) => {
    console.log('Deleting event:', eventId);
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const likeEvent = (eventId: string) => {
    console.log('Liking event:', eventId);
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, likes: event.likes + 1 }
        : event
    ));
  };

  const addComment = (eventId: string, text: string) => {
    console.log('Adding comment to event:', eventId);
    const comment: Comment = {
      id: Date.now().toString(),
      eventId,
      author: currentUser.name,
      authorId: currentUser.id,
      text,
      createdAt: new Date().toISOString()
    };

    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, comments: [...event.comments, comment] }
        : event
    ));
  };

  const reportEvent = (eventId: string) => {
    console.log('Reporting event:', eventId);
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isReported: true }
        : event
    ));
  };

  const banUser = (userId: string) => {
    console.log('Banning user:', userId);
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isBanned: true }
        : user
    ));
  };

  const getEventsByUser = (userId: string) => {
    return events.filter(event => event.authorId === userId);
  };

  const getReportedEvents = () => {
    return events.filter(event => event.isReported);
  };

  const setLocationFilter = (location: string) => {
    console.log('Setting location filter to:', location);
    setSelectedLocation(location);
  };

  return {
    events: getFilteredEvents(),
    allEvents: events,
    users,
    loading,
    selectedLocation,
    availableLocations: getAvailableLocations(),
    addEvent,
    deleteEvent,
    likeEvent,
    addComment,
    reportEvent,
    banUser,
    getEventsByUser,
    getReportedEvents,
    setLocationFilter,
    // Favorites functionality
    favorites: favorites.favoriteEvents,
    isFavorite: favorites.isFavorite,
    toggleFavorite: favorites.toggleFavorite,
    getFavoriteEvents: () => favorites.getFavoriteEvents(events),
    hasNotificationPermission: favorites.hasNotificationPermission
  };
};
