import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, useWindowDimensions, Platform, ImageSourcePropType } from 'react-native';
import { GraduationCap } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { getImageUrl } from '@/lib/supabase';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'lecturer'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const isLargeScreen = width > 768;

  // In a real implementation, these would be URLs from Supabase storage
  // For now, we'll use local assets
  const getLecturerImage = () => require('../../assets/images/Lecturer.png');
  const getStudentImage = () => require('../../assets/images/Rushing Student\'s.png');

  // Get the appropriate image based on user type
  const getActiveImage = () => userType === 'student' ? getStudentImage() : getLecturerImage();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await login(email, password, userType);
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLargeScreen ? (
        <View style={styles.largeScreenContainer}>
          <View style={styles.imageContainer}>
            <Image 
              source={getActiveImage()}
              style={styles.sideImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.formContainer}>
            <LoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              userType={userType}
              setUserType={setUserType}
              isLoading={isLoading}
              error={error}
              handleLogin={handleLogin}
            />
          </View>
        </View>
      ) : (
        <View style={styles.smallScreenContainer}>
          <View style={styles.smallImageContainer}>
            <Image 
              source={getActiveImage()}
              style={styles.topImage}
              resizeMode="contain"
            />
          </View>
          <LoginForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            userType={userType}
            setUserType={setUserType}
            isLoading={isLoading}
            error={error}
            handleLogin={handleLogin}
          />
        </View>
      )}
    </View>
  );
}

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  userType: 'student' | 'lecturer';
  setUserType: (type: 'student' | 'lecturer') => void;
  isLoading: boolean;
  error: string | null;
  handleLogin: () => Promise<void>;
}

function LoginForm({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  userType, 
  setUserType, 
  isLoading, 
  error, 
  handleLogin 
}: LoginFormProps) {
  return (
    <View style={styles.formInner}>
      <View style={styles.header}>
        <GraduationCap size={48} color="#007AFF" />
        <Text style={styles.title}>GeoAttend</Text>
      </View>

      <View style={styles.formContent}>
        <Text style={styles.welcomeText}>Welcome! Please select your role to continue.</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, userType === 'student' && styles.activeToggle]}
          onPress={() => setUserType('student')}
        >
          <Text style={[styles.toggleText, userType === 'student' && styles.activeToggleText]}>
              I am a Student
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, userType === 'lecturer' && styles.activeToggle]}
          onPress={() => setUserType('lecturer')}
        >
          <Text style={[styles.toggleText, userType === 'lecturer' && styles.activeToggleText]}>
              I am a Lecturer
          </Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.hint}>
        Hint: Use student@example.com / password (Student) or{'\n'}
        lecturer@example.com / password (Lecturer)
      </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 GeoAttend. All rights reserved.
        </Text>
        <Text style={styles.footerText}>
          Smart Attendance, Simplified.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  largeScreenContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  smallScreenContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  smallImageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formInner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  formContent: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  sideImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    color: '#1a1a1a',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'column',
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 6,
    gap: 8,
  },
  toggleButton: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    fontSize: 16,
  },
  activeToggleText: {
    color: '#007AFF',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  hint: {
    marginTop: 24,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
});