import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function DateNavigator({ label, onPrev, onNext }) {
  return (
    <div className="glass-panel flex items-center gap-2 p-2 sm:gap-4 sm:p-3">
      <Button variant="outline" className="min-h-10 shrink-0 px-2 sm:min-h-0" onClick={onPrev} aria-label="Précédent">
        <ChevronLeft size={20} />
      </Button>
      <span className="min-w-0 flex-1 truncate text-center text-xs font-medium text-vibrant sm:text-sm md:text-base">
        {label}
      </span>
      <Button variant="outline" className="min-h-10 shrink-0 px-2 sm:min-h-0" onClick={onNext} aria-label="Suivant">
        <ChevronRight size={20} />
      </Button>
    </div>
  );
}

export function formatDayLabel(date) {
  return format(date, 'EEEE d MMMM yyyy', { locale: fr });
}

export function formatWeekLabel(start) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${format(start, 'd MMM', { locale: fr })} — ${format(end, 'd MMM yyyy', { locale: fr })}`;
}

export function formatMonthLabel(date) {
  return format(date, 'MMMM yyyy', { locale: fr });
}

export function formatYearLabel(date) {
  return format(date, 'yyyy');
}
