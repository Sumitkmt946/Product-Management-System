"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart2,
  Wallet,
  Settings,
  User,
  HelpCircle,
  ChevronDown,
  LogOut,
  Package,
  PlusCircle
} from "lucide-react";

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const { user, logout } = useAuth();
  const role = user?.role;
  const [openDropdown, setOpenDropdown] = useState<string | null>("store");
  const pathname = usePathname();

  // Hide sidebar on auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const isActive = (path: string) => pathname === path;
  const isGroupActive = (paths: string[]) => paths.some(p => pathname.startsWith(p));

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"
        } min-h-screen bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-gray-800 flex flex-col sticky top-0 h-screen transition-all duration-300`}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            F
          </div>
          {!collapsed && <span className="text-xl font-bold dark:text-white">FabriCooze</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {/* Dashboard - Only for MANAGER */}
        {role === "MANAGER" && (
          <Link
            href="/dashboard"
            className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${isActive("/dashboard")
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`}
          >
            <LayoutDashboard size={20} className={isActive("/dashboard") ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500"} />
            {!collapsed && <span className="ml-3 font-medium">Dashboard</span>}
          </Link>
        )}

        {/* Store Section */}
        <div>
          <button
            onClick={() => toggleDropdown("store")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${isGroupActive(["/products", "/add-product"])
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
              : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
          >
            <div className="flex items-center">
              <ShoppingBag size={20} className={isGroupActive(["/products", "/add-product"]) ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500"} />
              {!collapsed && <span className="ml-3 font-medium">Store</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${openDropdown === "store" ? "rotate-180" : ""
                  }`}
              />
            )}
          </button>

          {openDropdown === "store" && !collapsed && (
            <div className="mt-1 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1">
              <Link
                href="/products"
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive("/products")
                  ? "text-blue-600 font-medium dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
              >
                <Package size={16} className="mr-2" />
                Products
              </Link>
              <Link
                href="/add-product"
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive("/add-product")
                  ? "text-blue-600 font-medium dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
              >
                <PlusCircle size={16} className="mr-2" />
                Add Product
              </Link>
            </div>
          )}
        </div>

        {/* Analytics - Only for MANAGER */}
        {role === "MANAGER" && (
          <Link href="#" className="flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
            <BarChart2 size={20} className="text-gray-400 group-hover:text-gray-500" />
            {!collapsed && <span className="ml-3 font-medium">Analytic</span>}
          </Link>
        )}

        {/* Finances - Only for MANAGER */}
        {role === "MANAGER" && (
          <Link href="#" className="flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
            <Wallet size={20} className="text-gray-400 group-hover:text-gray-500" />
            {!collapsed && <span className="ml-3 font-medium">Finances</span>}
          </Link>
        )}

        {/* Divider */}
        <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>

        <Link href="#" className="flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
          <User size={20} className="text-gray-400 group-hover:text-gray-500" />
          {!collapsed && <span className="ml-3 font-medium">My Profile</span>}
        </Link>
        <Link href="#" className="flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors group dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
          <Settings size={20} className="text-gray-400 group-hover:text-gray-500" />
          {!collapsed && <span className="ml-3 font-medium">Account Settings</span>}
        </Link>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={() => {
            console.log("Logout clicked");
            logout();
            // detailed logging
            console.log("Token removed");
            window.location.href = '/login';
          }}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/10 cursor-pointer"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
