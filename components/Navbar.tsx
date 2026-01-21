"use client";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-[#141414]">
      <input
        className="px-4 py-2 rounded bg-gray-100 dark:bg-black"
        placeholder="Search"
      />
      <div className="flex gap-4 items-center">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            ☰
          </button>
        )}
        <span className="text-sm">{user?.name} ({user?.role})</span>
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-gray-500 text-white rounded"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
