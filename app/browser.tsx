import { useLocalSearchParams } from "expo-router";

export default function Browser() {
  const params = useLocalSearchParams();

  if (params.url) {
    return <div>{params.url}</div>;
  }

  return <div>Browser</div>;
}
