import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  title: string;
  summary: string;
  tag: string;
}

const ArticleCard = ({ title, summary, tag }: ArticleCardProps) => {
  return (
    <Card className="transition hover:shadow-lg hover:ring-1 hover:ring-muted-foreground/20 rounded-xl">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg leading-tight">{title}</h3>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
          {summary}
        </p>
        <Badge variant="secondary" className="mt-4">
          {tag}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
