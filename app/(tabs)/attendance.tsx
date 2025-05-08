import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MapPin, Check, Clock } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useAttendance } from '@/context/AttendanceContext';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const { classes, markAttendance, getUserAttendance } = useAttendance();
  const [loading, setLoading] = useState(false);

  const handleMarkAttendance = async (classId: string) => {
    try {
      setLoading(true);
      await markAttendance(classId, user!.id);
      Alert.alert('Success', 'Attendance marked successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const attendanceRecords = getUserAttendance(user!.id);
  const currentClass = classes[0]; // For demo purposes, showing first class

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      
      <View style={styles.card}>
        <Text style={styles.currentClass}>{currentClass.name}</Text>
        <Text style={styles.classInfo}>{currentClass.time}</Text>
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#666" />
          <Text style={styles.locationText}>{currentClass.location}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => handleMarkAttendance(currentClass.id)}
        disabled={loading}
      >
        <Check size={24} color="#fff" />
        <Text style={styles.buttonText}>
          {loading ? 'Marking Attendance...' : 'Mark Attendance'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Attendance</Text>
      {attendanceRecords.map((record) => {
        const classDetails = classes.find((c) => c.id === record.classId);
        return (
          <View key={record.id} style={styles.attendanceRecord}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordClass}>{classDetails?.name}</Text>
              <View style={[styles.statusBadge, styles[`status${record.status}`]]}>
                <Text style={styles.statusText}>{record.status}</Text>
              </View>
            </View>
            <View style={styles.recordTime}>
              <Clock size={14} color="#666" />
              <Text style={styles.timeText}>
                {record.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 24,
    marginBottom: 16,
    color: '#1a1a1a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentClass: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  classInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#007AFF',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  attendanceRecord: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordClass: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statuspresent: {
    backgroundColor: '#E8F5E9',
  },
  statuslate: {
    backgroundColor: '#FFF3E0',
  },
  statusabsent: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  recordTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});