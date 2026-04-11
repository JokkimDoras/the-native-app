import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Task } from '@/types/task';

type Props = {
  item: Task;
  onDelete: (id: string) => void;
  onToggle: (id: string, completed: boolean) => void;
};

const priorityColor = (priority: string) => {
  if (priority === 'high') return { bg: '#FFE5E5', text: '#FF5B5B' };
  if (priority === 'medium') return { bg: '#FFF3E0', text: '#FFB830' };
  return { bg: '#E8F5E9', text: '#4CAF50' };
};

export default function TaskCard({ item, onDelete, onToggle }: Props) {
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
            onPress={() => onToggle(item.id, item.completed)}
          >
            <Text style={[styles.completeBtnText, item.completed && styles.completedBtnText]}>
              {item.completed ? '✅ Done' : '⬜ Todo'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.editBtn}
            onPress={() => router.push(`/task/${item.id}`)}
          >
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </Pressable>

          <Pressable
            style={styles.deleteBtn}
            onPress={() => onDelete(item.id)}
          >
            <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});