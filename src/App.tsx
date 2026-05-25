import AppRouter from "./AppRouter";
import useTheme from "./hooks/useTheme";
import "./App.css";

function App() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-200">
      <AppRouter isDark={isDark} onToggleTheme={toggle} />
    </div>
  );
}

export default App;
