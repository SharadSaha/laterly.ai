import { motion } from "framer-motion";
import { BookmarkCheck, BookOpenCheck, Flame } from "lucide-react";

interface StatsCardsProps {
  opened?: number;
  bookmarked?: number;
  unread?: number;
}

const cardData = [
  {
    key: "opened",
    label: "Articles opened",
    icon: BookOpenCheck,
    gradient: "from-brand-500/15 to-emerald-500/15",
  },
  {
    key: "bookmarked",
    label: "Bookmarked",
    icon: BookmarkCheck,
    gradient: "from-amber-500/15 to-pink-500/15",
  },
  {
    key: "unread",
    label: "Remaining",
    icon: Flame,
    gradient: "from-indigo-500/15 to-brand-500/15",
  },
];

const tinySpark = (
  <svg viewBox="0 0 120 40" className="h-10 w-full text-brand-500/50">
    <polyline
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      points="0,30 20,24 40,32 60,18 80,26 100,12 120,22"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StatsCards = ({ opened = 0, bookmarked = 0, unread = 0 }: StatsCardsProps) => {
  const values: Record<string, number> = { opened, bookmarked, unread };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cardData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
            className="gradient-border rounded-2xl"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 shadow-sm">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-70`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">{values[card.key]}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 dark:bg-slate-800 text-brand-600 shadow">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 text-brand-500/60">{tinySpark}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
