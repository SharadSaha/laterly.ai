import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import StatsCards from "../components/StatsCards";
import ArticleList from "../components/ArticleList";
import { useGetArticlesQuery, DEFAULT_PAGE } from "../app/services/articlesApi";
import { useAppSelector } from "../app/store/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatDate, truncate } from "../utils/format";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";

const Home = () => {
  const stats = useAppSelector((state) => state.auth.user?.stats);
  const [take, setTake] = useState<number>(DEFAULT_PAGE.take);
  const queryArgs = useMemo(() => ({ skip: 0, take }), [take]);
  const { data, isLoading, isFetching } = useGetArticlesQuery(queryArgs);

  const articles = data?.items ?? [];
  const recent = articles.slice(0, 6);
  const hasMore = (data?.total ?? 0) > articles.length;

  console.log("data", data);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 text-white shadow-lg">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500">
            Your latest AI summaries and saves live here.
          </p>
        </div>
      </div>

      <StatsCards
        opened={stats?.opened}
        bookmarked={stats?.bookmarked}
        unread={stats?.unread}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Recent
          </h3>
          <Link
            to="/search/intent"
            className="text-sm text-brand-600 hover:underline"
          >
            Explore intents
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recent.map((article) => (
            <Card key={article.id} className="card-hover">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-base">
                  {article.title}
                </CardTitle>
                <p className="text-xs text-slate-500">
                  {formatDate(article.createdAt)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  {truncate(article.summary, 120)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.topics?.slice(0, 2).map((topic) => (
                    <Badge key={topic.id} variant="outline">
                      {topic.value}
                    </Badge>
                  ))}
                </div>
                <Link
                  to={`/article/${article.id}`}
                  className="mt-3 inline-flex text-sm text-brand-600"
                >
                  Read more →
                </Link>
              </CardContent>
            </Card>
          ))}
          {recent.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 text-sm text-slate-500">
              No recent articles yet.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            All articles
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTake(DEFAULT_PAGE.take)}
            aria-label="Refresh list"
          >
            Refresh
          </Button>
        </div>
        <ArticleList
          articles={articles}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={() => setTake((prev) => prev + DEFAULT_PAGE.take)}
          loadingMore={isFetching && !isLoading}
          emptyLabel="You haven't saved any articles yet."
        />
      </div>
    </div>
  );
};

export default Home;
