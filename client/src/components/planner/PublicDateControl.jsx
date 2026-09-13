import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { api } from '../../lib/api';
import { formatDateISO } from '../../lib/utils';

export function PublicDateControl({ focusDate, isEditor }) {
  const [publicDate, setPublicDate] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.meta.get().then(({ meta }) => setPublicDate(meta.publicDisplayDate || ''));
  }, []);

  if (!isEditor) return null;

  async function publishDay(dateIso) {
    setBusy(true);
    try {
      await api.meta.patch({ publicDisplayDate: dateIso });
      setPublicDate(dateIso);
    } finally {
      setBusy(false);
    }
  }

  async function resetToToday() {
    setBusy(true);
    try {
      await api.meta.patch({ publicDisplayDate: null });
      setPublicDate('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-panel flex flex-col gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex items-center gap-2 sm:w-full md:w-auto">
        <Globe size={20} className="shrink-0 text-neon" />
        <span className="text-sm font-medium text-vibrant">Publication /today</span>
      </div>
      <div className="w-full min-w-0 flex-1 sm:min-w-[200px]">
        <Label>Journée affichée</Label>
        <Input type="date" value={publicDate} onChange={(e) => setPublicDate(e.target.value)} className="min-h-11" />
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button disabled={busy} className="min-h-11 w-full sm:w-auto" onClick={() => publishDay(publicDate || formatDateISO(focusDate))}>
          Publier cette journée
        </Button>
        <Button variant="ghost" disabled={busy} className="min-h-11 w-full sm:w-auto" onClick={resetToToday}>
          Aujourd&apos;hui (auto)
        </Button>
      </div>
    </div>
  );
}
