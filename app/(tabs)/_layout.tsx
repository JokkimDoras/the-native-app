import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { auth } from '@/lib/firebase';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}