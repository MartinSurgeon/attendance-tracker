import { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'lecturer';
  department: string;
  year?: number;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'lecturer') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data - In a real app, this would come from your backend
const MOCK_USERS = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password',
    name: 'John Doe',
    role: 'student',
    department: 'Computer Science',
    year: 3,
  },
  {
    id: '2',
    email: 'lecturer@example.com',
    password: 'password',
    name: 'Dr. Smith',
    role: 'lecturer',
    department: 'Computer Science',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const checkAuth = async () => {
      try {
        // In a real app, verify token with backend
        setIsLoading(false);
      } catch (error) {
        setUser(null);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: 'student' | 'lecturer') => {
    try {
      // Simulate API call
      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password && u.role === role
      );

      if (!mockUser) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      router.replace('/(tabs)');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}