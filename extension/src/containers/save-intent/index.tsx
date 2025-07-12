import { useState } from "react";
import "./style.css";

const SaveIntentForm = () => {
  const [intent, setIntent] = useState<string>("");
  const [saveSatus, setSaveStatus] = useState<string>("");

  const handleSave = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id || !tab.url) return;

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      },
      async (results) => {
        const content = results?.[0]?.result;
        const payload = {
          url: tab.url,
          title: tab.title || "",
          content,
          intent,
        };
        await fetch("http://localhost:3000/api/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSaveStatus("✅ Saved!");
      }
    );
  };

  return (
    <div className="popup">
      <h1 className="popup-title">ReadLater AI</h1>
      <textarea
        className="popup-textarea"
        rows={3}
        placeholder="Why are you saving this?"
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
      />
      <button className="popup-button" onClick={handleSave}>
        Save Article
      </button>
      {saveSatus && <div className="popup-status">{saveSatus}</div>}

      <a
        className="popup-link"
        href="https://readlater.ai/dashboard"
        target="_blank"
        rel="noopener noreferrer"
      >
        Go to Dashboard →
      </a>
    </div>
  );
};

export default SaveIntentForm;
