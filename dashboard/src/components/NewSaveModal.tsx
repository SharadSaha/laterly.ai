import { useState } from "react";
import { X, BookMarked, Sparkles } from "lucide-react";
import { createPortal } from "react-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCreateArticleMutation } from "../app/services/articlesApi";
import { toast } from "sonner";

interface NewSaveModalProps {
  open: boolean;
  onClose: () => void;
}

const NewSaveModal = ({ open, onClose }: NewSaveModalProps) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [intent, setIntent] = useState("");
  const [content, setContent] = useState("");
  const [createArticle, { isLoading }] = useCreateArticleMutation();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      url: url.trim(),
      title: title.trim(),
      intent: intent.trim(),
      content: content.trim(),
    };

    if (!payload.url || !payload.title || !payload.content) {
      toast.error("Please provide a URL, title, and content.");
      return;
    }

    try {
      await createArticle(payload).unwrap();
      toast.success("Saved to Laterly");
      setUrl("");
      setTitle("");
      setIntent("");
      setContent("");
      onClose();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        (typeof error?.data === "string" ? error.data : null) ||
        "Save failed. Please try again.";
      toast.error(message);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-10">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl">
        <div className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_10%_20%,rgba(79,70,229,0.08),transparent_25%),radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.08),transparent_22%),linear-gradient(135deg,#f8fbff_0%,#f1f5f9_100%)]" />
        <div className="relative grid gap-6 p-6 sm:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 text-white shadow-lg">
                <BookMarked className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Laterly.ai</p>
                <h2 className="text-lg font-semibold text-slate-900">Drop a save manually</h2>
                <p className="text-sm text-slate-600">
                  Enter a URL, title, intent, and paste the content. We will queue it like the extension does.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">URL</label>
                <Input
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  type="url"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Title</label>
                <Input
                  placeholder="What are you saving?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Intent (optional)</label>
                <Input
                  placeholder="Why are you saving this?"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Content
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                    paste article body
                  </span>
                </label>
                <textarea
                  className="min-h-[160px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="Paste the article text here…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save to Laterly"}
                </Button>
              </div>
            </form>
          </div>

          <div className="hidden flex-col justify-between rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5 shadow-inner sm:flex">
            <div className="flex items-center gap-3 text-brand-600">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-semibold">Manual saves join the same AI flow</p>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Tips</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Paste cleaned text for best summaries.</li>
                <li>Include a short intent to improve tagging.</li>
                <li>We will sync this with your dashboard immediately.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
              Saves here behave just like extension drops—summaries and topics will be generated automatically.
            </div>
          </div>
        </div>

        <button
          className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:text-slate-800"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default NewSaveModal;
