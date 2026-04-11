import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  filter: string;
  priorityFilter: string;
  onFilterChange: (f: 'all' | 'completed' | 'incomplete') => void;
  onPriorityChange: (p: 'all' | 'low' | 'medium' | 'high') => void;
};

export default function FilterBar({ filter, priorityFilter, onFilterChange, onPriorityChange }: Props) {
  return (
    <View>
      <View style={styles.filterRow}>
        {['all', 'incomplete', 'completed'].map((f) => (
          <Pressable
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => onFilterChange(f as any)}
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
            onPress={() => onPriorityChange(p as any)}
          >
            <Text style={[styles.filterBtnText, priorityFilter === p && styles.filterBtnTextActive]}>
              {p}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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