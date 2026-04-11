import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useState } from "react";
import { useTasks } from '../hooks/useTask';
import TaskCard from '@/components/TaskCard';
import FilterBar from '@/components/FilterBar';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { tasks, deleteTask, toggleComplete } = useTasks();
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

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

      <FilterBar
        filter={filter}
        priorityFilter={priorityFilter}
        onFilterChange={setFilter}
        onPriorityChange={setPriorityFilter}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TaskCard
            item={item}
            onDelete={deleteTask}
            onToggle={toggleComplete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubText}>Tap + to add your first task</Text>
          </View>
        }
      />

      <Pressable style={styles.fab} onPress={() => router.push('/task/addTask')}>
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
});