import { useState } from "react";
import { toast } from "sonner";
import ArticleCard from "./ArticleCard";
import ConfirmModal from "./ConfirmModal";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useDeleteArticleMutation, useMarkReadMutation, useToggleBookmarkMutation } from "../app/services/articlesApi";
import type { Article } from "../types";

interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  emptyLabel?: string;
}

const ArticleList = ({ articles, isLoading, hasMore, onLoadMore, loadingMore, emptyLabel }: ArticleListProps) => {
  const [markRead] = useMarkReadMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();
  const [deleteArticle, { isLoading: deleting }] = useDeleteArticleMutation();
  const [toDelete, setToDelete] = useState<string | null>(null);

  const handleBookmark = async (id: string) => {
    try {
      await toggleBookmark(id).unwrap();
      toast.success("Bookmark updated");
    } catch (error) {
      toast.error("Unable to update bookmark");
    }
  };

  const handleRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
      toast.success("Marked status updated");
    } catch (error) {
      toast.error("Unable to update read state");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteArticle(toDelete).unwrap();
      toast.success("Article deleted");
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading && (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/70 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-4 h-16 w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && articles.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 text-center text-sm text-slate-500">
          {emptyLabel ?? "No articles yet."}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onBookmark={handleBookmark}
            onMarkRead={handleRead}
            onDelete={(id) => setToDelete(id)}
          />
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="flex justify-center">
          <Button onClick={onLoadMore} disabled={loadingMore} aria-label="Load more articles">
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete article"
        description="This will remove the article from your list."
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default ArticleList;
