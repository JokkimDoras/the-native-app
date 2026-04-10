import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState(null);

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", user.user.email); 
      router.replace('/Home');
      setError(null)     

    }catch (err: any) {
        switch (err.code) {
          case 'auth/invalid-credential':
            setError('Invalid email or password');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email');
            break;
          case 'auth/too-many-requests':
            setError('Too many attempts. Try again later');
            break;
         
        }
      }
  };
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
            {error && <Text style={styles.errorText}>{error}</Text>}


      <Pressable style={styles.button} onPress={handleLogin}>
        <Text  style={styles.buttonText}>Login</Text>
      </Pressable>

      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Text style={styles.link} onPress={() => router.push('/signup')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 25,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 30,
    },
    input: {
      backgroundColor: 'white',
      padding: 14,
      borderRadius: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#eee',
    },
    errorText: {
      color: 'red',
      fontSize: 13,
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#111',
      padding: 16,
      borderRadius: 10,
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    footerText: {
      marginTop: 20,
      textAlign: 'center',
      color: '#555',
    },
    link: {
      color: '#000',
      fontWeight: 'bold',
    },
  });