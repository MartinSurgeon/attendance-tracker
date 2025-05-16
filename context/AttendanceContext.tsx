import { createContext, useContext, useState } from 'react';
import * as Location from 'expo-location';

type Class = {
  id: string;
  name: string;
  time: string;
  location: string;
  lecturer: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

type AttendanceRecord = {
  id: string;
  classId: string;
  userId: string;
  timestamp: Date;
  status: 'present' | 'late' | 'absent';
  location: {
    latitude: number;
    longitude: number;
  };
};

type AttendanceContextType = {
  classes: Class[];
  attendanceRecords: AttendanceRecord[];
  markAttendance: (classId: string, userId: string) => Promise<void>;
  getClassAttendance: (classId: string) => AttendanceRecord[];
  getUserAttendance: (userId: string) => AttendanceRecord[];
};

const MOCK_CLASSES: Class[] = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    time: '09:00 AM - 10:30 AM',
    location: 'Building A, Room 101',
    lecturer: 'Dr. Smith',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
  },
  {
    id: '2',
    name: 'Computer Science',
    time: '11:00 AM - 12:30 PM',
    location: 'Building B, Room 205',
    lecturer: 'Prof. Johnson',
    coordinates: {
      latitude: 40.7129,
      longitude: -74.0061,
    },
  },
  {
    id: '3',
    name: 'Physics Lab',
    time: '02:00 PM - 03:30 PM',
    location: 'Science Building, Lab 3',
    lecturer: 'Dr. Brown',
    coordinates: {
      latitude: 40.7130,
      longitude: -74.0062,
    },
  },
];

const AttendanceContext = createContext<AttendanceContextType | null>(null);

const MAX_DISTANCE_METERS = 100; // Maximum allowed distance from class location

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const markAttendance = async (classId: string, userId: string) => {
    const classDetails = MOCK_CLASSES.find((c) => c.id === classId);
    if (!classDetails) {
      throw new Error('Class not found');
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      classDetails.coordinates.latitude,
      classDetails.coordinates.longitude
    );

    if (distance > MAX_DISTANCE_METERS) {
      throw new Error('You are too far from the class location');
    }

    const now = new Date();
    const [startTime] = classDetails.time.split(' - ');
    const classStartTime = new Date();
    const [hours, minutes] = startTime.split(':');
    classStartTime.setHours(parseInt(hours), parseInt(minutes.replace('AM', '').replace('PM', '')));
    
    const attendanceStatus = now > classStartTime ? 'late' : 'present';

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      classId,
      userId,
      timestamp: now,
      status: attendanceStatus,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };

    setAttendanceRecords((prev) => [...prev, newRecord]);
  };

  const getClassAttendance = (classId: string) => {
    return attendanceRecords.filter((record) => record.classId === classId);
  };

  const getUserAttendance = (userId: string) => {
    return attendanceRecords.filter((record) => record.userId === userId);
  };

  return (
    <AttendanceContext.Provider
      value={{
        classes: MOCK_CLASSES,
        attendanceRecords,
        markAttendance,
        getClassAttendance,
        getUserAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}