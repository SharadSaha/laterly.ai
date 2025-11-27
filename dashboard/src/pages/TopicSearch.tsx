import { useMemo, useState } from "react";
import { Filter, Search, Tags } from "lucide-react";
import { Input } from "../components/ui/input";
import ArticleList from "../components/ArticleList";
import TopicCloud from "../components/TopicCloud";
import { useFilterArticlesQuery, useGetTopicsQuery } from "../app/services/articlesApi";

const TopicSearch = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const { data: topics = [], isLoading: topicsLoading } = useGetTopicsQuery();
  const filteredTopics = useMemo(
    () => topics.filter((t) => t.value.toLowerCase().includes(search.toLowerCase())),
    [topics, search],
  );

  const shouldFetch = selected.length > 0;
  const { data, isLoading, isFetching } = useFilterArticlesQuery(
    { topicIds: selected },
    { skip: !shouldFetch },
  );

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 text-white shadow-lg">
            <Tags className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Topic cloud</h2>
            <p className="text-sm text-slate-500">Pick one or more topics to filter articles instantly.</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics"
              aria-label="Search topics"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter className="h-4 w-4" />
            {selected.length} selected
          </div>
        </div>

        <div className="mt-4">
          {topicsLoading ? (
            <p className="text-sm text-slate-500">Loading topics…</p>
          ) : (
            <TopicCloud topics={filteredTopics} selected={selected} onToggle={toggle} />
          )}
        </div>
      </div>

      <ArticleList
        articles={data?.items ?? []}
        isLoading={isLoading}
        loadingMore={isFetching && !isLoading}
        emptyLabel={selected.length === 0 ? "Select topics to view matching articles." : "No articles for those topics yet."}
      />
    </div>
  );
};

export default TopicSearch;
