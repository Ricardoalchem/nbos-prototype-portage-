import { useContext } from "react";
import { ThemeContext } from "./themeModeContext";

export const useThemeMode = () => useContext(ThemeContext);
