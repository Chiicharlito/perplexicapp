import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";

export default function Browser() {
  const params = useLocalSearchParams();

  const [webContent, setWebContent] =
    useState<WebBrowser.WebBrowserResult | null>(null);

  if (params.url) {
    return <div>{params.url}</div>;
  }

  return <div>Browser</div>;
}
