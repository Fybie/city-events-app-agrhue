
import { useState, useEffect } from 'react';
import { PastEventReport, Comment } from '../types/Event';
import { currentUser } from '../data/mockData';

// Mock data for past event reports
const mockPastEventReports: PastEventReport[] = [
  {
    id: '1',
    title: 'Stadtfest Berlin war fantastisch!',
    description: 'Das Stadtfest war ein voller Erfolg. Tolle Musik, leckeres Essen und eine super Atmosphäre. Die Kinder hatten viel Spaß bei den Aktivitäten und die Live-Bands waren großartig. Definitiv ein Highlight des Sommers!',
    eventDate: '2024-01-15',
    location: 'Alexanderplatz',
    city: 'Berlin',
    author: 'Max Mustermann',
    authorId: '1',
    createdAt: '2024-01-20T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400'
    ],
    likes: 15,
    comments: [],
    isReported: false
  },
  {
    id: '2',
    title: 'Konzert im Park - entspannter Abend',
    description: 'Ein wunderschöner Abend mit lokalen Bands im Stadtpark. Die Musik war vielfältig und die Stimmung entspannt. Perfekt für einen Sommerabend mit Freunden.',
    eventDate: '2024-01-10',
    location: 'Stadtpark',
    city: 'München',
    author: 'Anna Schmidt',
    authorId: '2',
    createdAt: '2024-01-18T15:30:00Z',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'
    ],
    likes: 8,
    comments: [],
    isReported: false
  }
];

export const usePastEventReports = () => {
  const [reports, setReports] = useState<PastEventReport[]>(mockPastEventReports);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');

  // Clean up old reports (older than 6 weeks)
  useEffect(() => {
    const cleanupOldReports = () => {
      const sixWeeksAgo = new Date();
      sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42); // 6 weeks = 42 days
      
      setReports(prev => {
        const filtered = prev.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate > sixWeeksAgo;
        });
        
        if (filtered.length !== prev.length) {
          console.log(`Cleaned up ${prev.length - filtered.length} old reports`);
        }
        
        return filtered;
      });
    };

    // Run cleanup immediately and then every hour
    cleanupOldReports();
    const interval = setInterval(cleanupOldReports, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  // Get unique cities from all reports
  const getAvailableLocations = () => {
    const cities = [...new Set(reports.map(report => report.city))];
    return cities.sort();
  };

  // Get date range options
  const getDateRangeOptions = () => {
    return [
      { label: 'Alle Zeiträume', value: 'all' },
      { label: 'Letzte Woche', value: 'week' },
      { label: 'Letzter Monat', value: 'month' },
      { label: 'Letzte 3 Monate', value: 'quarter' }
    ];
  };

  // Filter reports based on selected location and date range
  const getFilteredReports = () => {
    let filtered = reports;

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(report => report.city === selectedLocation);
    }

    // Filter by date range
    if (selectedDateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();

      switch (selectedDateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(report => {
        const eventDate = new Date(report.eventDate);
        return eventDate >= cutoffDate;
      });
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const addReport = (newReport: Omit<PastEventReport, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    console.log('Adding new past event report:', newReport.title);
    const report: PastEventReport = {
      ...newReport,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    setReports(prev => [report, ...prev]);
  };

  const deleteReport = (reportId: string) => {
    console.log('Deleting past event report:', reportId);
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const likeReport = (reportId: string) => {
    console.log('Liking past event report:', reportId);
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, likes: report.likes + 1 }
        : report
    ));
  };

  const addComment = (reportId: string, text: string) => {
    console.log('Adding comment to past event report:', reportId);
    const comment: Comment = {
      id: Date.now().toString(),
      eventId: reportId,
      author: currentUser.name,
      authorId: currentUser.id,
      text,
      createdAt: new Date().toISOString()
    };

    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, comments: [...report.comments, comment] }
        : report
    ));
  };

  const reportReport = (reportId: string) => {
    console.log('Reporting past event report:', reportId);
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, isReported: true }
        : report
    ));
  };

  const getReportsByUser = (userId: string) => {
    return reports.filter(report => report.authorId === userId);
  };

  const getReportedReports = () => {
    return reports.filter(report => report.isReported);
  };

  const setLocationFilter = (location: string) => {
    console.log('Setting location filter to:', location);
    setSelectedLocation(location);
  };

  const setDateRangeFilter = (dateRange: string) => {
    console.log('Setting date range filter to:', dateRange);
    setSelectedDateRange(dateRange);
  };

  return {
    reports: getFilteredReports(),
    allReports: reports,
    loading,
    selectedLocation,
    selectedDateRange,
    availableLocations: getAvailableLocations(),
    dateRangeOptions: getDateRangeOptions(),
    addReport,
    deleteReport,
    likeReport,
    addComment,
    reportReport,
    getReportsByUser,
    getReportedReports,
    setLocationFilter,
    setDateRangeFilter
  };
};
