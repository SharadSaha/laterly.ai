import { motion } from "framer-motion";
import type { Topic } from "../types";

interface TopicCloudProps {
  topics: Topic[];
  selected: string[];
  onToggle: (id: string) => void;
}

const TopicCloud = ({ topics, selected, onToggle }: TopicCloudProps) => {
  const maxCount = Math.max(...topics.map((t) => t.count ?? 1), 1);

  return (
    <div className="flex flex-wrap gap-3">
      {topics.map((topic, idx) => {
        const isActive = selected.includes(topic.id);
        const scale = 0.9 + ((topic.count ?? 1) / maxCount) * 0.5;
        return (
          <motion.button
            key={topic.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.02 }}
            onClick={() => onToggle(topic.id)}
            className={`rounded-full border px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${isActive ? "bg-brand-600 text-white border-brand-600" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"}`}
            aria-pressed={isActive}
            aria-label={`Topic ${topic.value}`}
            style={{ transform: `scale(${scale})` }}
          >
            {topic.value}
            {topic.count !== undefined && <span className="ml-2 text-xs opacity-70">{topic.count}</span>}
          </motion.button>
        );
      })}
    </div>
  );
};

export default TopicCloud;
