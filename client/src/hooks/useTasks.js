import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useTasks(from, to) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!from || !to) return;
    setLoading(true);
    setError(null);
    try {
      const { tasks: list } = await api.tasks.list(from, to);
      setTasks(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const createTask = async (body) => {
    const { task } = await api.tasks.create(body);
    await load();
    return task;
  };

  const updateTask = async (id, body) => {
    const { task } = await api.tasks.update(id, body);
    await load();
    return task;
  };

  const deleteTask = async (id) => {
    await api.tasks.remove(id);
    await load();
  };

  return { tasks, loading, error, reload: load, createTask, updateTask, deleteTask };
}
