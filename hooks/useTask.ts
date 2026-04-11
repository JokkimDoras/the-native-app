import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Task } from '@/types/task';

export function useTasks() {
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

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const toggleComplete = async (taskId: string, completed: boolean) => {
    await updateDoc(doc(db, 'tasks', taskId), {
      completed: !completed
    });
  };

  return { tasks, deleteTask, toggleComplete };
}