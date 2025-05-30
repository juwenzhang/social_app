"use client";
import React, { createContext, useContext } from "react";
import ThemeType from "@/contexts/types/ThemeType";
import { localCache } from "@/utils/ProjectStorage";
import { themeKey } from "@/constants/keys";

const ThemeContext = createContext<{
  theme: ThemeType,
  toggleTheme: () => void
}>({
  theme: localCache.getItem(themeKey) || "light",
  toggleTheme: () => {}
});

const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: React.ReactNode }> 
= ({ children }) => {
  const [theme, setTheme] = React.useState<ThemeType>("light");
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (localCache.getItem(themeKey)) {
      localCache.removeItem(themeKey);
    }
    localCache.setItem(themeKey, newTheme);
  };

  return(
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { 
  ThemeProvider, 
  useTheme 
};