import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", user.user.email);

      // 👉 go to login after signup
      router.replace('/login');

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🚀</Text>

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

      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => router.push('/login')}>
          Login
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 10,
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