import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { EditorLoginModal } from '../auth/EditorLoginModal';
import { iconSizes } from '../../theme/colors';

export function AppShell({ children, subtitle }) {
  return (
    <div className="min-h-screen overflow-x-hidden px-3 py-5 sm:px-6 md:px-8 md:py-6">
      <header className="mx-auto mb-6 flex max-w-7xl flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-neon sm:text-xl">
            <Sparkles size={iconSizes.hero} className="shrink-0" />
            <span className="truncate">Next-Gen Planner</span>
          </Link>
          {subtitle && <p className="mt-1 text-xs text-muted sm:text-sm">{subtitle}</p>}
        </div>
        <nav className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Link
            to="/today"
            className="min-h-10 inline-flex items-center justify-center rounded-lg border border-neon/15 px-3 text-sm text-vibrant transition-colors hover:border-neon/40 hover:text-neon sm:min-h-0 sm:border-0 sm:px-0"
          >
            Vue publique /today
          </Link>
          <EditorLoginModal />
        </nav>
      </header>
      <main className="mx-auto max-w-7xl min-w-0">{children}</main>
    </div>
  );
}
