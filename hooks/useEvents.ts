
import { useState, useEffect } from 'react';
import { Event, Comment, User } from '../types/Event';
import { mockEvents, mockUsers, currentUser } from '../data/mockData';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

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

  return {
    events,
    users,
    loading,
    addEvent,
    deleteEvent,
    likeEvent,
    addComment,
    reportEvent,
    banUser,
    getEventsByUser,
    getReportedEvents
  };
};
