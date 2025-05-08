import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';

const MOCK_CLASSES = [
  {
    id: 1,
    name: 'Advanced Mathematics',
    time: '09:00 AM - 10:30 AM',
    location: 'Building A, Room 101',
    lecturer: 'Dr. Smith',
  },
  {
    id: 2,
    name: 'Computer Science',
    time: '11:00 AM - 12:30 PM',
    location: 'Building B, Room 205',
    lecturer: 'Prof. Johnson',
  },
  {
    id: 3,
    name: 'Physics Lab',
    time: '02:00 PM - 03:30 PM',
    location: 'Science Building, Lab 3',
    lecturer: 'Dr. Brown',
  },
];

export default function ClassesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Classes</Text>
      <ScrollView style={styles.scrollView}>
        {MOCK_CLASSES.map((class_) => (
          <TouchableOpacity key={class_.id} style={styles.classCard}>
            <View style={styles.classHeader}>
              <Text style={styles.className}>{class_.name}</Text>
              <Text style={styles.classTime}>{class_.time}</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#666" />
              <Text style={styles.locationText}>{class_.location}</Text>
            </View>
            <Text style={styles.lecturerName}>{class_.lecturer}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1a1a1a',
  },
  classTime: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#007AFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  lecturerName: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
});