import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { ColorTheme, light, dark } from "@/theme/colors";

interface ThemeContextType {
  isDark: boolean;
  theme: ColorTheme;
  toggleTheme: () => void;
  setDark: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  theme: light,
  toggleTheme: () => {},
  setDark: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  useEffect(() => {
    setIsDark(systemScheme === "dark");
  }, [systemScheme]);

  const toggleTheme = () => setIsDark((v) => !v);
  const setDark = (val: boolean) => setIsDark(val);
  const theme = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
