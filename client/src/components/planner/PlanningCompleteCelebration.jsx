import { motion } from 'framer-motion';
import { PartyPopper, Sparkles } from 'lucide-react';

export function PlanningCompleteCelebration({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`relative overflow-hidden rounded-xl border border-neon/40 bg-gradient-to-br from-electric/25 via-bg-space/90 to-neon/10 p-5 text-center shadow-glow-cyan ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(0,240,255,0.15), transparent 45%), radial-gradient(circle at 80% 70%, rgba(0,102,255,0.2), transparent 40%)',
        }}
      />
      <motion.div
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }}
        className="relative mx-auto mb-3 flex w-fit items-center gap-2 text-neon"
      >
        <PartyPopper size={28} />
        <Sparkles size={22} />
      </motion.div>
      <p className="relative text-lg font-semibold text-text sm:text-xl">
        Félicitations !
      </p>
      <p className="relative mt-1 text-sm text-vibrant sm:text-base">
        Vous avez respecté votre planning.
      </p>
    </motion.div>
  );
}
