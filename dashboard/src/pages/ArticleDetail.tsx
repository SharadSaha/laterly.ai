import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Tags,
  Trash2,
} from "lucide-react";
import {
  useDeleteArticleMutation,
  useGetArticleQuery,
  useMarkReadMutation,
  useResummarizeMutation,
  useToggleBookmarkMutation,
  articlesApi,
} from "../app/services/articlesApi";
import { useAppDispatch } from "../app/store/hooks";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ConfirmModal from "../components/ConfirmModal";
import { formatDate } from "../utils/format";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading } = useGetArticleQuery(id ?? "", {
    skip: !id,
  });
  const dispatch = useAppDispatch();
  const [markRead, { isLoading: marking }] = useMarkReadMutation();
  const [toggleBookmark, { isLoading: bookmarking }] =
    useToggleBookmarkMutation();
  const [deleteArticle, { isLoading: deleting }] = useDeleteArticleMutation();
  const [resummarize, { isLoading: summarizing }] = useResummarizeMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const invalidateDashboard = () => {
    void dispatch(
      articlesApi.util.invalidateTags([
        { type: "Articles", id: "LIST" },
        { type: "UserStats", id: "me" },
      ]),
    );
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteArticle(id).unwrap();
      invalidateDashboard();
      toast.success("Article deleted");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete article");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <div className="grid gap-4 md:grid-cols-[280px,1fr]">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!article) {
    return <p className="text-sm text-slate-500">Article not found.</p>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          {article.title}
        </h1>
        <Badge variant="outline">
          {article.intents?.[0]?.phrase ?? "No intent"}
        </Badge>
      </div>
      <p className="text-sm text-slate-500">
        Saved {formatDate(article.createdAt)}
      </p>

      <div className="grid gap-6 md:grid-cols-[280px,1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await toggleBookmark(article.id).unwrap();
                  invalidateDashboard();
                  toast.success("Bookmark updated");
                } catch (error) {
                  toast.error("Bookmark failed");
                }
              }}
              disabled={bookmarking}
              aria-label="Toggle bookmark"
            >
              <Bookmark className="mr-2 h-4 w-4" />{" "}
              {article.isBookmarked ? "Remove bookmark" : "Bookmark"}
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await markRead(article.id).unwrap();
                  invalidateDashboard();
                  toast.success(article.isRead ? "Marked as unread" : "Marked as read");
                } catch (error) {
                  toast.error("Update failed");
                }
              }}
              disabled={marking}
              aria-label="Toggle read"
            >
              <CheckCircle className="mr-2 h-4 w-4" />{" "}
              {article.isRead ? "Mark unread" : "Mark as read"}
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await resummarize(article.id).unwrap();
                  invalidateDashboard();
                  toast.success("Summary refreshed");
                } catch (error) {
                  toast.error("Resummarize failed");
                }
              }}
              disabled={summarizing}
              aria-label="Resummarize"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${summarizing ? "animate-spin" : ""}`}
              />
              {summarizing ? "Resummarizing" : "Resummarize"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open(article.url, "_blank")}
              aria-label="Open original"
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Open original
            </Button>
            <Button
              variant="ghost"
              className="text-red-500 hover:bg-red-50"
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>

            <div className="pt-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <Tags className="h-4 w-4" /> Topics
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {article.topics?.map((topic) => (
                  <Badge key={topic.id} variant="outline">
                    {topic.value}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="space-y-6">
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                AI Summary
              </p>
              <p className="mt-3 text-lg leading-relaxed text-slate-800 dark:text-slate-100">
                {article.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this article?"
        description="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default ArticleDetail;
