import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { TasK } from '../../types/task'


export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('low');
  const [error, setError] = useState('');

  const handleAddTask = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        dueDate,
        priority,
        completed: false,
        userId: user.uid,
      });

      router.back();
    } catch (err) {
      setError('Something went wrong. Try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Task</Text>

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        placeholder="Due Date (e.g. 11-04-2026 )"
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.priorityRow}>
        {['low', 'medium', 'high'].map((p) => (
          <Pressable
            key={p}
            style={[styles.priorityBtn, priority === p && styles.prioritySelected]}
            onPress={() => setPriority(p)}
          >
            <Text style={[styles.priorityBtnText, priority === p && styles.prioritySelectedText]}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f5f5', paddingTop: 60 },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 24 },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10, color: '#333' },
  priorityRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  priorityBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  prioritySelected: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  priorityBtnText: { fontWeight: '600', textTransform: 'capitalize', color: '#333' },
  prioritySelectedText: { color: 'white' },
  errorText: { color: 'red', fontSize: 13, marginBottom: 10 },
  button: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  cancelText: { textAlign: 'center', color: '#888', fontSize: 14 },
});