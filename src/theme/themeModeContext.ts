import { createContext } from "react";

export interface ThemeContextValue {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  toggleTheme: () => {},
});
