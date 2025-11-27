import { useState } from "react";
import "./style.css";
import articlesApi from "../../services/articles";

const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL;

const SaveIntentForm = () => {
  const [intent, setIntent] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [saved, setSaved] = useState(false);

  const [createArticle, { isLoading }] = articlesApi.useCreateArticleMutation();

  const handleSave = async () => {
    if (isLoading) return;
    setStatus("");
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id || !tab.url) {
      setStatus("Couldn't read this tab.");
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      },
      async (results) => {
        const content = results?.[0]?.result;
        if (!content) {
          setStatus("No content detected on this page.");
          return;
        }
        const payload = {
          url: tab.url,
          title: tab.title || "",
          content,
          intent,
        };
        try {
          await createArticle(payload).unwrap();
          setSaved(true);
          setStatus("Saved to Laterly");
        } catch (error) {
          setStatus("Save failed. Please try again.");
        }
      }
    );
  };

  const handleNavigateToDashboard = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    window.open(dashboardUrl, "_blank");
  };

  return (
    <div className="popup">
      <div className="popup-hero">
        <div className="glow" />
        <div className="badge">Laterly.ai</div>
        <h1>Save this read with intent</h1>
        <p>Capture why it matters. AI will summarize and tag it for you.</p>
      </div>

      {!saved ? (
        <>
          <div className="field">
            <label>Why are you saving this?</label>
            <textarea
              className="popup-textarea"
              rows={4}
              placeholder="e.g. Researching onboarding ideas or Learn redux quickly"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
            />
          </div>
          <button className="popup-button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving…" : "Save to Laterly"}
          </button>
        </>
      ) : (
        <div className="saved-card">
          <div className="check">✓</div>
          <div>
            <h3>Saved to Laterly</h3>
            <p>Your article is queued for AI summary. Peek at the dashboard to see it.</p>
          </div>
        </div>
      )}

      {status && <div className="popup-status">{status}</div>}

      <a
        className="popup-link"
        onClick={handleNavigateToDashboard}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open dashboard ↗
      </a>
    </div>
  );
};

export default SaveIntentForm;
