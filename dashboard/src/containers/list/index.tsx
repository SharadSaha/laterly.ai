import ArticleCard from "./item";

export default function ArticleList() {
  const dummyData = [
    {
      title: "How to Use LLMs for Better Summaries",
      summary: "Explore how language models summarize articles efficiently.",
      tag: "AI / LLM",
    },
    {
      title: "5 Ways to Improve Your JavaScript Code",
      summary:
        "Learn modern techniques to write cleaner, more maintainable JS.",
      tag: "JavaScript",
    },
    {
      title: "UX Principles for SaaS Dashboards",
      summary: "Design tips that improve user experience in SaaS products.",
      tag: "UX / Design",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {dummyData.map((article) => (
        <ArticleCard
          key={article.title}
          title={article.title}
          summary={article.summary}
          tag={article.tag}
        />
      ))}
    </div>
  );
}
