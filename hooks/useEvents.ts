
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Event } from '../types/Event';
import { getSupabase, isSupabaseInitialized } from '../utils/supabase';
import { mockEvents } from '../data/mockData';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, using mock data');
      setEvents(mockEvents);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setEvents(mockEvents);
      return;
    }

    setLoading(true);
    try {
      console.log('Loading events from Supabase');
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          comments:comments(
            id,
            content,
            author_name,
            author_id,
            created_at
          )
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        Alert.alert('Fehler', 'Veranstaltungen konnten nicht geladen werden.');
        setEvents(mockEvents);
        return;
      }

      console.log('Events loaded successfully:', data?.length);
      
      // Transform Supabase data to Event format
      const transformedEvents: Event[] = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time,
        location: event.location,
        city: event.city,
        author: event.author_name || 'Unbekannt',
        authorId: event.author_id || '',
        createdAt: event.created_at,
        likes: event.likes_count || 0,
        image: event.image_url,
        comments: (event.comments || []).map((comment: any) => ({
          id: comment.id,
          eventId: event.id,
          author: comment.author_name || 'Unbekannt',
          authorId: comment.author_id || '',
          text: comment.content,
          createdAt: comment.created_at
        }))
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const createEvent = async (eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    author: string;
    authorId: string;
    image?: string;
  }) => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, cannot create event');
      Alert.alert('Fehler', 'Supabase ist nicht verbunden. Veranstaltung kann nicht erstellt werden.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase) return { success: false };

    setLoading(true);
    try {
      console.log('Creating event:', eventData.title);
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          city: eventData.city,
          author_name: eventData.author,
          author_id: eventData.authorId,
          image_url: eventData.image,
          likes_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        Alert.alert('Fehler', 'Veranstaltung konnte nicht erstellt werden: ' + error.message);
        return { success: false };
      }

      console.log('Event created successfully:', data.id);
      Alert.alert('Erfolg', 'Veranstaltung wurde erfolgreich erstellt.');
      await loadEvents(); // Reload events
      return { success: true };
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, cannot update event');
      Alert.alert('Fehler', 'Supabase ist nicht verbunden.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase) return { success: false };

    setLoading(true);
    try {
      console.log('Updating event:', eventId);
      const { error } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          city: eventData.city,
          image_url: eventData.image,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) {
        console.error('Error updating event:', error);
        Alert.alert('Fehler', 'Veranstaltung konnte nicht aktualisiert werden: ' + error.message);
        return { success: false };
      }

      console.log('Event updated successfully');
      Alert.alert('Erfolg', 'Veranstaltung wurde erfolgreich aktualisiert.');
      await loadEvents(); // Reload events
      return { success: true };
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, cannot delete event');
      Alert.alert('Fehler', 'Supabase ist nicht verbunden.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase) return { success: false };

    return new Promise((resolve) => {
      Alert.alert(
        'Veranstaltung löschen',
        'Sind Sie sicher, dass Sie diese Veranstaltung löschen möchten?',
        [
          {
            text: 'Abbrechen',
            style: 'cancel',
            onPress: () => resolve({ success: false })
          },
          {
            text: 'Löschen',
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              try {
                console.log('Deleting event:', eventId);
                const { error } = await supabase
                  .from('events')
                  .delete()
                  .eq('id', eventId);

                if (error) {
                  console.error('Error deleting event:', error);
                  Alert.alert('Fehler', 'Veranstaltung konnte nicht gelöscht werden: ' + error.message);
                  resolve({ success: false });
                  return;
                }

                console.log('Event deleted successfully');
                Alert.alert('Erfolg', 'Veranstaltung wurde erfolgreich gelöscht.');
                await loadEvents(); // Reload events
                resolve({ success: true });
              } catch (error) {
                console.error('Error deleting event:', error);
                Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
                resolve({ success: false });
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    });
  };

  const addComment = async (eventId: string, comment: string, authorName: string, authorId: string) => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, cannot add comment');
      Alert.alert('Fehler', 'Supabase ist nicht verbunden.');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase) return { success: false };

    try {
      console.log('Adding comment to event:', eventId);
      const { error } = await supabase
        .from('comments')
        .insert({
          event_id: eventId,
          content: comment,
          author_name: authorName,
          author_id: authorId
        });

      if (error) {
        console.error('Error adding comment:', error);
        Alert.alert('Fehler', 'Kommentar konnte nicht hinzugefügt werden: ' + error.message);
        return { success: false };
      }

      console.log('Comment added successfully');
      await loadEvents(); // Reload events to get updated comments
      return { success: true };
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
      return { success: false };
    }
  };

  const likeEvent = async (eventId: string, userId: string) => {
    if (!isSupabaseInitialized()) {
      console.log('Supabase not initialized, cannot like event');
      return { success: false };
    }

    const supabase = getSupabase();
    if (!supabase) return { success: false };

    try {
      console.log('Toggling like for event:', eventId);
      
      // Check if user already liked this event
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing like:', checkError);
        return { success: false };
      }

      if (existingLike) {
        // Unlike the event
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          console.error('Error removing like:', deleteError);
          return { success: false };
        }

        // Decrement likes count
        const { error: updateError } = await supabase
          .from('events')
          .update({ likes_count: supabase.raw('likes_count - 1') })
          .eq('id', eventId);

        if (updateError) {
          console.error('Error updating likes count:', updateError);
        }
      } else {
        // Like the event
        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            event_id: eventId,
            user_id: userId
          });

        if (insertError) {
          console.error('Error adding like:', insertError);
          return { success: false };
        }

        // Increment likes count
        const { error: updateError } = await supabase
          .from('events')
          .update({ likes_count: supabase.raw('likes_count + 1') })
          .eq('id', eventId);

        if (updateError) {
          console.error('Error updating likes count:', updateError);
        }
      }

      console.log('Like toggled successfully');
      await loadEvents(); // Reload events to get updated likes
      return { success: true };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false };
    }
  };

  const getEventById = (eventId: string): Event | undefined => {
    return events.find(event => event.id === eventId);
  };

  return {
    events,
    loading,
    refreshing,
    loadEvents,
    refreshEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    addComment,
    likeEvent,
    getEventById
  };
};
