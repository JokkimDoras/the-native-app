import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

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

  const handleDelete = async (taskID: string) => {
    await deleteDoc(doc(db, 'tasks', taskID));
  };

  const handleToggleComplete = async (taskID: string, completed: boolean) => {
    await updateDoc(doc(db, 'tasks', taskID), {
      completed: !completed
    });
  };

  const priorityColor = (priority: string) => {
    if (priority === 'high') return { bg: '#FFE5E5', text: '#FF5B5B' };
    if (priority === 'medium') return { bg: '#FFF3E0', text: '#FFB830' };
    return { bg: '#E8F5E9', text: '#4CAF50' };
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch =
      filter === 'all' ? true :
      filter === 'completed' ? task.completed :
      !task.completed;

    const priorityMatch =
      priorityFilter === 'all' ? true :
      task.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
        </View>
        <View style={styles.taskCount}>
          <Text style={styles.taskCountNumber}>{tasks.length}</Text>
          <Text style={styles.taskCountLabel}>Tasks</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {['all', 'incomplete', 'completed'].map((f) => (
          <Pressable
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.filterRow}>
        {['all', 'low', 'medium', 'high'].map((p) => (
          <Pressable
            key={p}
            style={[styles.filterBtn, priorityFilter === p && styles.filterBtnActive]}
            onPress={() => setPriorityFilter(p as any)}
          >
            <Text style={[styles.filterBtnText, priorityFilter === p && styles.filterBtnTextActive]}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const colors = priorityColor(item.priority);
          return (
            <View style={styles.taskCard}>
              <View style={[styles.priorityBar, { backgroundColor: colors.text }]} />
              <View style={styles.taskContent}>
                <View style={styles.taskTop}>
                  <Text style={[styles.taskTitle, item.completed && styles.completed]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={[styles.priorityBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.priorityText, { color: colors.text }]}>
                      {item.priority}
                    </Text>
                  </View>
                </View>

                {item.description ? (
                  <Text style={styles.taskDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}

                <Text style={styles.taskDate}>📅 {item.dueDate}</Text>

                <View style={styles.actionRow}>
                  <Pressable
                    style={[styles.completeBtn, item.completed && styles.completedBtn]}
                    onPress={() => handleToggleComplete(item.id, item.completed)}
                  >
                    <Text style={[styles.completeBtnText, item.completed && styles.completedBtnText]}>
                      {item.completed ? '✅ Done' : '⬜ Todo'}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.editBtn}
                    onPress={() => router.push(`/${item.id}`)}
                  >
                    <Text style={styles.editBtnText}>✏️ Edit</Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubText}>Tap + to add your first task</Text>
          </View>
        }
      />

      
      <Pressable style={styles.fab} onPress={() => router.push('/addTask')}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  header: {
    backgroundColor: '#6C63FF',
    padding: 24,
    paddingTop: 55,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 4 },
  title: { color: 'white', fontSize: 30, fontWeight: '800' },
  date: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
  taskCount: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    minWidth: 64,
  },
  taskCountNumber: { color: 'white', fontSize: 26, fontWeight: '800' },
  taskCountLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  taskCard: {
    backgroundColor: 'white',
    marginVertical: 7,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  priorityBar: { width: 5 },
  taskContent: { flex: 1, padding: 14 },
  taskTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', flex: 1, marginRight: 8 },
  completed: { textDecorationLine: 'line-through', color: '#aaa' },
  taskDescription: { fontSize: 13, color: '#888', marginBottom: 8, lineHeight: 18 },
  taskDate: { fontSize: 12, color: '#aaa', marginBottom: 10 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  priorityText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  completeBtn: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  completedBtn: { backgroundColor: '#E8F5E9' },
  completeBtnText: { color: '#888', fontSize: 12, fontWeight: '700' },
  completedBtnText: { color: '#4CAF50' },
  editBtn: {
    flex: 1,
    backgroundColor: '#F0EEFF',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  editBtnText: { color: '#6C63FF', fontSize: 12, fontWeight: '700' },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FFF0F0',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteBtnText: { color: '#FF5B5B', fontSize: 12, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#555' },
  emptySubText: { fontSize: 13, color: '#aaa', marginTop: 6 },
  fab: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    backgroundColor: '#6C63FF',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fabText: { color: 'white', fontSize: 32, fontWeight: '300', marginTop: -2 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  filterBtnText: { fontSize: 12, fontWeight: '600', color: '#888', textTransform: 'capitalize' },
  filterBtnTextActive: { color: 'white' },
});