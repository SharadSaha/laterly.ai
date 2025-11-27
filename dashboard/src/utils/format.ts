export const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const truncate = (text: string, length = 140) => {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}…` : text;
};
