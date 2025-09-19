
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePastEventReports } from '../../hooks/usePastEventReports';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import PastEventCard from '../../components/PastEventCard';
import CreatePastEventReportSheet from '../../components/CreatePastEventReportSheet';
import LocationFilter from '../../components/LocationFilter';
import { Platform } from 'react-native';

const PastEventsScreen = () => {
  const {
    reports,
    loading,
    selectedLocation,
    selectedDateRange,
    availableLocations,
    addReport,
    likeReport,
    reportReport,
    setLocationFilter,
    setDateRangeFilter,
  } = usePastEventReports();

  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Calculate bottom spacing for tab bar
  const tabBarHeight = Platform.OS === 'ios' ? 50 + Math.max(insets.bottom - 10, 0) : 60;

  const onRefresh = () => {
    console.log('Refreshing past event reports');
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleReportPress = (reportId: string) => {
    console.log('Opening past event report:', reportId);
    // Navigate to report detail if needed
  };

  const handleCreateReport = (reportData: any) => {
    console.log('Creating past event report:', reportData);
    addReport(reportData);
  };

  const handleLocationChange = (location: string) => {
    setLocationFilter(location === 'All Locations' ? 'all' : location);
  };

  const handleDateRangeChange = (dateRange: string) => {
    setDateRangeFilter(dateRange === 'All Time' ? 'all' : dateRange);
  };

  const dateRangeOptions = ['All Time', 'Last Week', 'Last Month', 'Last 3 Months'];

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Reports</Text>
          <Text style={styles.headerSubtitle}>Past Events</Text>
        </View>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setIsCreateSheetVisible(true)}
        >
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <LocationFilter
          selectedLocation={selectedLocation === 'all' ? 'All Locations' : selectedLocation}
          onLocationChange={handleLocationChange}
          availableLocations={['All Locations', ...availableLocations]}
        />
        
        <View style={styles.dateFilterContainer}>
          <LocationFilter
            selectedLocation={selectedDateRange === 'all' ? 'All Time' : selectedDateRange}
            onLocationChange={handleDateRangeChange}
            availableLocations={dateRangeOptions}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 20 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="document-text-outline" size={64} color={colors.grey} />
            <Text style={styles.emptyStateTitle}>No Reports Found</Text>
            <Text style={styles.emptyStateText}>
              {selectedLocation !== 'all' || selectedDateRange !== 'all'
                ? 'No reports found for the selected filters. Try different filters or create the first report!'
                : 'Be the first to report on a past event!'
              }
            </Text>
          </View>
        ) : (
          reports.map((report) => (
            <PastEventCard
              key={report.id}
              report={report}
              onPress={() => handleReportPress(report.id)}
              onLike={() => likeReport(report.id)}
              onReport={() => reportReport(report.id)}
            />
          ))
        )}
      </ScrollView>

      <CreatePastEventReportSheet
        isVisible={isCreateSheetVisible}
        onClose={() => setIsCreateSheetVisible(false)}
        onCreateReport={handleCreateReport}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.grey,
    fontSize: 14,
    marginTop: 2,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  dateFilterContainer: {
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: colors.grey,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default PastEventsScreen;
