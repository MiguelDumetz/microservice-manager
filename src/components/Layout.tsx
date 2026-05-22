import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function Layout({ isDark, onToggleTheme }: LayoutProps) {
  return (
    <>
      <Navbar isDark={isDark} onToggleTheme={onToggleTheme} />
      <Outlet />
    </>
  );
}

export default Layout;
