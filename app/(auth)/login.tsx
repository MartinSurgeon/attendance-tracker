import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { GraduationCap } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'lecturer'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <View style={styles.header}>
        <GraduationCap size={48} color="#007AFF" />
        <Text style={styles.title}>Campus Attendance</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, userType === 'student' && styles.activeToggle]}
          onPress={() => setUserType('student')}
        >
          <Text style={[styles.toggleText, userType === 'student' && styles.activeToggleText]}>
            Student
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, userType === 'lecturer' && styles.activeToggle]}
          onPress={() => setUserType('lecturer')}
        >
          <Text style={[styles.toggleText, userType === 'lecturer' && styles.activeToggleText]}>
            Lecturer
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    color: '#1a1a1a',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
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
  },
  activeToggleText: {
    color: '#007AFF',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});