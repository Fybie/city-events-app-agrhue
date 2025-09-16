
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePastEventReports } from '../../hooks/usePastEventReports';
import { commonStyles, colors } from '../../styles/commonStyles';
import Icon from '../../components/Icon';
import PastEventCard from '../../components/PastEventCard';
import CreatePastEventReportSheet from '../../components/CreatePastEventReportSheet';
import LocationFilter from '../../components/LocationFilter';

const PastEventsScreen = () => {
  const {
    reports,
    loading,
    selectedLocation,
    selectedDateRange,
    availableLocations,
    dateRangeOptions,
    addReport,
    likeReport,
    reportReport,
    setLocationFilter,
    setDateRangeFilter
  } = usePastEventReports();

  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    console.log('Refreshing past events');
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleReportPress = (reportId: string) => {
    console.log('Opening past event report:', reportId);
    // Navigate to report detail (could be implemented later)
  };

  const handleCreateReport = (reportData: any) => {
    console.log('Creating past event report:', reportData);
    addReport(reportData);
  };

  const handleLocationChange = (location: string) => {
    setLocationFilter(location === 'Alle Orte' ? 'all' : location);
  };

  const handleDateRangeChange = (dateRange: string) => {
    setDateRangeFilter(dateRange);
  };

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vergangene Events</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setIsCreateSheetVisible(true)}
        >
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <LocationFilter
          selectedLocation={selectedLocation === 'all' ? 'Alle Orte' : selectedLocation}
          onLocationChange={handleLocationChange}
          availableLocations={['Alle Orte', ...availableLocations]}
        />
        
        <View style={styles.dateRangeFilter}>
          <Text style={styles.filterLabel}>Zeitraum:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dateRangeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dateRangeButton,
                  selectedDateRange === option.value && styles.dateRangeButtonActive
                ]}
                onPress={() => handleDateRangeChange(option.value)}
              >
                <Text style={[
                  styles.dateRangeButtonText,
                  selectedDateRange === option.value && styles.dateRangeButtonTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="document-text-outline" size={64} color={colors.grey} />
            <Text style={styles.emptyStateTitle}>Keine Berichte gefunden</Text>
            <Text style={styles.emptyStateText}>
              {selectedLocation !== 'all' || selectedDateRange !== 'all'
                ? 'Versuchen Sie andere Filter oder erstellen Sie den ersten Bericht.'
                : 'Seien Sie der Erste, der einen Event-Bericht erstellt!'
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

        <View style={styles.bottomSpacing} />
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
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '30',
  },
  dateRangeFilter: {
    marginTop: 12,
  },
  filterLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateRangeButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  dateRangeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateRangeButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  dateRangeButtonTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
  bottomSpacing: {
    height: 100,
  },
});

export default PastEventsScreen;
