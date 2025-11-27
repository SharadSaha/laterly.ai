import { FormEvent, useMemo, useState } from "react";
import { Brain, Compass, Sparkles } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import ArticleList from "../components/ArticleList";
import { useFilterArticlesQuery, useGetTopicsQuery, useGetTrendingIntentsQuery } from "../app/services/articlesApi";
import { Badge } from "../components/ui/badge";

const IntentSearch = () => {
  const [intent, setIntent] = useState("");
  const [queryIntent, setQueryIntent] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { data: intentsData, isError: intentsError } = useGetTrendingIntentsQuery();
  const { data: topicsData } = useGetTopicsQuery();

  const shouldFetch = queryIntent.trim().length > 0 || selectedTopics.length > 0;
  const { data, isLoading, isFetching } = useFilterArticlesQuery(
    { intent: queryIntent || undefined, topicIds: selectedTopics },
    { skip: !shouldFetch },
  );

  const suggestions = useMemo(() => {
    if (intentsData && intentsData.length) return intentsData.map((i) => i.phrase);
    if (topicsData && topicsData.length) return topicsData.slice(0, 5).map((t) => t.value);
    return ["learn redux quickly", "find product-led growth reads", "ai + privacy", "writing better cold emails"];
  }, [intentsData, topicsData]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setQueryIntent(intent.trim());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 text-white shadow-lg">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Intent search</h2>
              <p className="text-sm text-slate-500">Describe what you need; we'll match the best articles.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setIntent(s);
                  setQueryIntent(s);
                }}
              >
                <Sparkles className="mr-1 h-3 w-3" /> {s}
              </Badge>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g. learn redux quickly"
              aria-label="Intent search"
            />
          </div>
          <Button type="submit" aria-label="Search intents">
            <Compass className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>

        {topicsData && topicsData.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {topicsData.slice(0, 10).map((topic) => {
              const active = selectedTopics.includes(topic.id);
              return (
                <Badge
                  key={topic.id}
                  variant={active ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTopic(topic.id)}
                >
                  {topic.value}
                </Badge>
              );
            })}
          </div>
        )}
        {intentsError && (
          <p className="mt-2 text-xs text-amber-500">Trending intents unavailable; showing topic-based suggestions.</p>
        )}
      </div>

      <ArticleList
        articles={data?.items ?? []}
        isLoading={isLoading}
        loadingMore={isFetching && !isLoading}
        emptyLabel="No articles match that intent yet."
      />
    </div>
  );
};

export default IntentSearch;
