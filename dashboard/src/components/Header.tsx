import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookMarked, Plus, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ProfileDropdown from "./ProfileDropdown";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (value?: string) => {
    const intent = (value ?? query).trim();
    if (!intent) return;
    navigate(`/search/intent?intent=${encodeURIComponent(intent)}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 text-white shadow-lg">
            <BookMarked className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Laterly.ai</p>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-50">Insights Dashboard</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              aria-label="Global intent search"
              placeholder="Search by intent, topic, or title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            aria-label="New save instructions"
            onClick={() =>
              toast("Save from anywhere", {
                description: "Use the Laterly.ai browser extension to save an article. We'll drop it here once processed.",
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            New Save
          </Button>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
