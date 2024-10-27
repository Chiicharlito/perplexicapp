import { getData } from "@/services/storage";
import { useEffect, useState } from "react";

export function usePreferences() {
  const [serverURL, setServerURL] = useState<string>("");
  const [wsServerURL, setWsServerURL] = useState<string>("");

  useEffect(() => {
    const getServerURL = async () => {
      const data = await getData("serverURL");
      setServerURL(data ?? "");
    };

    const getWsServerURL = async () => {
      const data = await getData("wsServerURL");
      setWsServerURL(data ?? "");
    };

    getWsServerURL();
    getServerURL();
  });

  return { serverURL, wsServerURL };
}
