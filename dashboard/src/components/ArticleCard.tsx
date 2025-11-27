import { Bookmark, CheckCircle, ExternalLink, MessageSquare, Tags, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Article } from "../types";
import { formatDate, truncate } from "../utils/format";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ArticleCardProps {
  article: Article;
  onBookmark: (id: string) => void;
  onMarkRead: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ArticleCard = ({ article, onBookmark, onMarkRead, onDelete }: ArticleCardProps) => {
  return (
    <Card className="card-hover h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <Link to={`/article/${article.id}`} className="group">
            <CardTitle className="group-hover:text-brand-600 dark:group-hover:text-brand-300">
              {article.title}
            </CardTitle>
          </Link>
          <p className="text-xs text-slate-500">{formatDate(article.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs capitalize">
            {article.intents?.[0]?.phrase ?? "No intent"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-slate-700 dark:text-slate-200">{truncate(article.summary)}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {article.topics?.map((topic) => (
            <span
              key={topic.id}
              className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
            >
              <Tags className="mr-1 inline h-3 w-3" />
              {topic.value}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MessageSquare className="h-4 w-4" />
            <span>{article.contentSnippet ? truncate(article.contentSnippet, 60) : "Snippet"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              aria-label={article.isBookmarked ? "Remove bookmark" : "Bookmark"}
              variant="ghost"
              size="icon"
              onClick={() => onBookmark(article.id)}
              className={article.isBookmarked ? "text-amber-500" : "text-slate-500"}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button
              aria-label={article.isRead ? "Mark unread" : "Mark read"}
              variant="ghost"
              size="icon"
              onClick={() => onMarkRead(article.id)}
              className={article.isRead ? "text-emerald-500" : "text-slate-500"}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Link to={`/article/${article.id}`} aria-label="Open article">
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
            {onDelete && (
              <Button
                aria-label="Delete article"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(article.id)}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
