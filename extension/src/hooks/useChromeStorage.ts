import { useEffect, useState, Dispatch, SetStateAction } from "react";

const useChromeStorage = <T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  // Load initial value from chrome.storage.local
  useEffect(() => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] !== undefined) {
        setValue(result[key]);
      }
      setLoading(false);
    });
  }, [key]);

  // Save to chrome.storage.local on value change
  useEffect(() => {
    if (!loading) {
      chrome.storage.local.set({ [key]: value });
    }
  }, [key, value, loading]);

  return [value, setValue, loading];
};

export default useChromeStorage;
