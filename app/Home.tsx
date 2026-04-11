import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db, auth } from '@/lib/firebase';

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  completed: boolean;
  userId: string;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        orderBy('dueDate', 'asc')
      );

      const unsubscribeTasks = onSnapshot(q, (snapshot) => {
        const taskList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Task, 'id'>
        }));
        setTasks(taskList);
      });

      return () => unsubscribeTasks();
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
        <Text style={styles.title}>My Tasks</Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskTop}>
              <Text style={[styles.taskTitle, item.completed && styles.completed]}>
                {item.title}
              </Text>
              <View style={[styles.priorityBadge, {
                backgroundColor:
                  item.priority === 'high' ? '#FFE5E5' :
                  item.priority === 'medium' ? '#FFF3E0' : '#E8F5E9'
              }]}>
                <Text style={[styles.priorityText, {
                  color:
                    item.priority === 'high' ? '#FF5B5B' :
                    item.priority === 'medium' ? '#FFB830' : '#4CAF50'
                }]}>{item.priority}</Text>
              </View>
            </View>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={styles.taskDate}>📅 {item.dueDate}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#6C63FF',
    padding: 24,
    paddingTop: 50,
  },
  date: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  taskCard: {
    backgroundColor: 'white',
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  taskTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskTitle: { fontSize: 20, fontWeight: '800' },
  taskDescription: { fontSize: 13, color: '#666', marginBottom: 6 },
  taskDate: { fontSize: 12, color: '#999', marginTop: 2 },
  completed: { textDecorationLine: 'line-through', color: '#aaa' },
  emptyText: { textAlign: 'center', marginTop: 60, color: '#aaa', fontSize: 16 },
});