// Lists available Gemini models via REST because the SDK doesn't expose listModels.
const key = process.env.GEMINI_API_KEY;

if (!key) {
  console.error("GEMINI_API_KEY is required in environment");
  process.exit(1);
}

const endpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

async function main() {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      console.error(`Request failed: ${res.status} ${res.statusText}`);
      const body = await res.text();
      console.error(body);
      process.exit(1);
    }
    const data = await res.json();
    const models = (data as any)?.models || [];
    if (!models.length) {
      console.log("No models returned. Ensure your key has access and the endpoint is correct (v1 vs v1beta).");
      return;
    }
    models.forEach((m) => {
      const name = m.name || "unknown";
      const display = m.displayName || "";
      const methods = Array.isArray(m.supportedGenerationMethods)
        ? m.supportedGenerationMethods.join(",")
        : "";
      console.log(`${name} | ${display} | methods: ${methods}`);
    });
  } catch (err) {
    console.error("Failed to list models", err);
    process.exit(1);
  }
}

main();
