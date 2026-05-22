import { useState, useEffect } from "react";

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("no-transitions");
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("no-transitions"))
    );
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((d) => !d) };
}

export default useTheme