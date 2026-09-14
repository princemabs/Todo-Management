import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useTasks(from, to) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (opts = {}) => {
    if (!from || !to) return;
    const silent = opts.silent === true;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { tasks: list } = await api.tasks.list(from, to);
      setTasks(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e.message || 'Impossible de charger les tâches');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') load({ silent: true });
    }
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [load]);

  const createTask = async (body) => {
    const { task } = await api.tasks.create(body);
    setTasks((prev) => [...prev.filter((t) => t.id !== task.id), task]);
    await load({ silent: true });
    return task;
  };

  const updateTask = async (id, body) => {
    const { task } = await api.tasks.update(id, body);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    await load({ silent: true });
    return task;
  };

  const deleteTask = async (id) => {
    await api.tasks.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await load({ silent: true });
  };

  return { tasks, loading, error, reload: load, createTask, updateTask, deleteTask };
}
