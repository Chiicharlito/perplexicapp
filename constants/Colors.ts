/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#1A1A1A",
    background: "#FCFCF9",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    primary: "#008080",
    secondary: "#F5F5F5",
    border: "#E5E5E5",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    tint: tintColorDark,
    icon: "#9BA1A6",
    primary: "#008080",
    tabIconDefault: "#9BA1A6",
    secondary: "#2A2A2A",
    border: "#333333",
    tabIconSelected: tintColorDark,
  },
};
