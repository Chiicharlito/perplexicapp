import AsyncStorage from "@react-native-async-storage/async-storage";

export function useStorage({ key }: { key: string }) {
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("error getting data", e);
    }
  };

  const storeData = async (value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log("error storing data", e);
    }
  };

  return {
    getData,
    storeData,
  };
}
