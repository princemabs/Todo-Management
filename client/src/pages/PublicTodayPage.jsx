import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { PublicTaskCard } from '../components/tasks/PublicTaskCard';
import { PlanningCompleteCelebration } from '../components/planner/PlanningCompleteCelebration';
import { isDayPlanningComplete } from '../components/planner/dayTimelineLayout';
import { api } from '../lib/api';
import { parseISODate } from '../lib/utils';

export function PublicTodayPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.public
      .today()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  const displayDate = data ? parseISODate(data.displayDate) : new Date();
  const dateLabel = format(displayDate, 'EEEE d MMMM yyyy', { locale: fr });
  const shown = data?.tasks || [];
  const allDone = isDayPlanningComplete(shown);

  return (
    <div className="min-h-screen overflow-x-hidden px-3 py-8 sm:px-6 sm:py-10 md:px-8">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-10 max-w-3xl text-center"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-neon">Planning du jour</p>
        <h1 className="mt-2 text-2xl font-semibold text-text sm:text-3xl md:text-4xl">
          {data?.ownerDisplayName || 'Prince Mabengue'}
        </h1>
        <p className="mt-2 capitalize text-muted">{dateLabel}</p>
        {data?.isCustomDate && (
          <p className="mt-1 text-xs text-vibrant">Journée sélectionnée pour affichage public</p>
        )}
        <Link to="/" className="mt-4 inline-block text-sm text-electric hover:text-neon">
          ← Retour au dashboard
        </Link>
      </motion.header>

      <div className="mx-auto max-w-3xl space-y-3">
        {error && <p className="text-center text-red-400">{error}</p>}
        {!data && !error && <p className="text-center text-muted">Chargement…</p>}
        {allDone && <PlanningCompleteCelebration />}
        {shown.map((task, i) => (
          <PublicTaskCard key={task.id} task={task} index={i} />
        ))}
        {data && shown.length === 0 && (
          <p className="text-center text-muted">Aucune tâche pour cette journée.</p>
        )}
      </div>
    </div>
  );
}
