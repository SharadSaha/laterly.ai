import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Filter, Search, Sparkles, StickyNote, Tags } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "intent" | "summary" | "tags" | null;

const Sidebar = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [searchInput, setSearchInput] = useState("");

  const handleFilterClick = (filter: FilterType) => {
    setSearchInput("");
    setActiveFilter((prev) => (prev === filter ? null : filter));
  };

  const renderSearchInput = () => (
    <Input
      placeholder="Type to filter..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      className="mt-4"
    />
  );

  return (
    <aside className="h-full w-64 border-r p-4 flex flex-col justify-between bg-muted/50">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          Laterly.ai
          <Sparkles className="w-5 h-5 text-primary" />
        </h1>

        <div className="space-y-2">
          <p className="text-xs uppercase text-muted-foreground flex items-center gap-2 pb-2">
            <Filter size={12} /> Filters
          </p>

          <div className="flex flex-col space-y-3 mt-2">
            <div>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start w-full gap-2 rounded-md cursor-pointer",
                  activeFilter === "intent" &&
                    "bg-muted text-foreground hover:bg-muted"
                )}
                onClick={() => handleFilterClick("intent")}
              >
                <StickyNote size={16} />
                Why I Saved
              </Button>
              {activeFilter === "intent" && renderSearchInput()}
            </div>

            <div>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start w-full gap-2 rounded-md cursor-pointer",
                  activeFilter === "summary" &&
                    "bg-muted text-foreground hover:bg-muted"
                )}
                onClick={() => handleFilterClick("summary")}
              >
                <Search size={16} />
                Smart Summaries
              </Button>
              {activeFilter === "summary" && renderSearchInput()}
            </div>

            <div>
              <Button
                variant="ghost"
                className={cn(
                  "justify-start w-full gap-2 rounded-md cursor-pointer",
                  activeFilter === "tags" &&
                    "bg-muted text-foreground hover:bg-muted"
                )}
                onClick={() => handleFilterClick("tags")}
              >
                <Tags size={16} />
                Tags / Topics
              </Button>
              {activeFilter === "tags" && renderSearchInput()}
            </div>
          </div>
        </div>

        <Separator />

        <Button variant="outline" className="w-full rounded-md">
          + New Save
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">© 2025 Laterly.ai</p>
    </aside>
  );
};

export default Sidebar;
