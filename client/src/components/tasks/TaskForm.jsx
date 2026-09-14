import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { SelectField } from '../ui/select';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from './PriorityBadge';
import { durationHours, formatDateISO } from '../../lib/utils';
import { cn } from '../../lib/utils';

const empty = (date) => ({
  title: '',
  description: '',
  date: formatDateISO(date),
  startTime: '09:00',
  endTime: '10:00',
  priority: 'normal',
  status: 'todo',
  publishOnPublicView: false,
});

function FormSection({ title, children, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {title && (
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{title}</p>
      )}
      {children}
    </div>
  );
}

export function TaskForm({ focusDate, initial, onSubmit, onCancel, embedded = false }) {
  const [form, setForm] = useState(initial || empty(focusDate));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const editingId = initial?.id ?? null;

  useEffect(() => {
    if (initial) setForm({ ...initial });
    else setForm(empty(focusDate));
  }, [editingId]);

  useEffect(() => {
    if (!initial) {
      setForm((f) => ({ ...f, date: formatDateISO(focusDate) }));
    }
  }, [focusDate, initial]);

  const hours = durationHours(form.startTime, form.endTime);

  function setField(key, value) {
    setSaveError(null);
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || hours <= 0 || saving) return;

    setSaving(true);
    setSaveError(null);
    try {
      await onSubmit(form);
      if (!initial) setForm(empty(focusDate));
    } catch (err) {
      setSaveError(err.message || 'Enregistrement impossible');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-5', embedded ? 'p-4 pt-3' : 'glass-panel p-4 sm:p-5')}
    >
      {!embedded && (
        <h3 className="text-sm font-semibold text-vibrant">
          {initial ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </h3>
      )}

      <FormSection title="Informations">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            required
            className="min-h-11"
            enterKeyHint="next"
          />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            className="min-h-[72px]"
            enterKeyHint="done"
          />
        </div>
      </FormSection>

      <FormSection title="Horaires">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              className="min-h-11"
            />
          </div>
          <div>
            <Label htmlFor="start">Heure début</Label>
            <Input
              id="start"
              type="time"
              value={form.startTime}
              onChange={(e) => setField('startTime', e.target.value)}
              className="min-h-11"
            />
          </div>
          <div>
            <Label htmlFor="end">Heure fin</Label>
            <Input
              id="end"
              type="time"
              value={form.endTime}
              onChange={(e) => setField('endTime', e.target.value)}
              className="min-h-11"
            />
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
            hours > 0 ? 'border-neon/30 bg-neon/5 text-neon' : 'border-red-500/30 bg-red-500/5 text-red-300'
          )}
        >
          <Clock3 size={16} className="shrink-0" />
          {hours > 0 ? `Durée : ${hours} h` : 'Fin doit être après le début (même jour)'}
        </div>
      </FormSection>

      <FormSection title="Priorité & statut">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>Priorité (Eisenhower)</Label>
            <SelectField
              value={form.priority}
              onValueChange={(v) => setField('priority', v)}
              options={PRIORITY_OPTIONS}
            />
          </div>
          <div>
            <Label>Statut</Label>
            <SelectField value={form.status} onValueChange={(v) => setField('status', v)} options={STATUS_OPTIONS} />
          </div>
        </div>
      </FormSection>

      <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-white/5 bg-bg-deep/40 p-3 text-sm text-muted">
        <input
          type="checkbox"
          checked={form.publishOnPublicView}
          onChange={(e) => setField('publishOnPublicView', e.target.checked)}
          className="mt-1 size-5 shrink-0 accent-electric"
        />
        <span>Inclure dans la vue publique /today lorsque la journée est publiée</span>
      </label>

      {saveError && <p className="text-sm text-red-400">{saveError}</p>}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="submit"
          disabled={hours <= 0 || saving}
          className="min-h-12 w-full text-base sm:min-h-11 sm:w-auto sm:flex-1 sm:text-sm"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={saving}
            className="min-h-12 w-full text-base sm:min-h-11 sm:w-auto sm:text-sm"
          >
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
