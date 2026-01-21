"use client";

import { Search, Bell, Grid, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                {toggleSidebar && (
                    <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <Menu size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                )}
                <div className="relative hidden sm:block">
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-10 pr-4 py-2 w-64 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm dark:bg-gray-800 dark:text-white"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Search
                </button>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Admin</span>
                    </button>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {theme === "dark" ? (
                            <Sun size={20} className="text-yellow-500" />
                        ) : (
                            <Moon size={20} className="text-gray-500" />
                        )}
                    </button>

                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <Grid size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                        <Bell size={20} className="text-gray-500 dark:text-gray-400" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                    {/* Placeholder Avatar */}
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                </div>
            </div>
        </header>
    );
}
