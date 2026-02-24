"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  ShoppingBag,
  Eye,
  DollarSign,
  CreditCard,
  MoreHorizontal,
  RefreshCw
} from "lucide-react";

// Chart mock data
const chartData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
];

const recentSalesMock = [
  { name: "Indra Maulara", email: "indramaulara@gmail.com", amount: "+$1500.00", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Indra" },
  { name: "Aditya Pratama", email: "aditya@gmail.com", amount: "+$1500.00", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya" },
  { name: "Junaedi", email: "junaedi@gmail.com", amount: "+$1500.00", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Junaedi" },
  { name: "Sarah Smith", email: "sarah@gmail.com", amount: "+$1500.00", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEarning: "$112,893.00",
    views: "+112,893",
    totalSales: "+112,893",
    subscriptions: "+112,893",
    productCount: 0,
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        const products = data.data?.products || [];
        const totalValue = products.reduce((sum: number, p: any) => sum + (p.price || 0), 0);
        const totalStock = products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);

        setStats({
          totalEarning: `$${totalValue.toLocaleString()}.00`,
          views: `+${Math.floor(Math.random() * 50000 + 10000)}`,
          totalSales: `+${totalStock}`,
          subscriptions: `+${products.length * 100}`,
          productCount: products.length,
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setIsRefreshing(false);
      setLastUpdate(new Date());
    }
  };

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      title: "Total Earning",
      value: stats.totalEarning,
      trend: "+20%",
      icon: <DollarSign size={20} className="text-gray-500" />,
    },
    {
      title: "Views",
      value: stats.views,
      trend: "+15%",
      icon: <Eye size={20} className="text-gray-500" />,
    },
    {
      title: "Total Sales",
      value: stats.totalSales,
      trend: "+10%",
      icon: <ShoppingBag size={20} className="text-gray-500" />,
    },
    {
      title: "Subscriptions",
      value: stats.subscriptions,
      trend: "+5%",
      icon: <CreditCard size={20} className="text-gray-500" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <Header />

      <div className="p-6 space-y-6">
        {/* Live Status Bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-500">Live updates every 30s</span>
            <span className="text-xs text-gray-400">| Last: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            Refresh Now
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  {stat.icon}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span className="text-xs text-green-500 mb-1 font-medium bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Sales Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Overview Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Overview</h2>
              <div className="flex gap-2">
                <select className="bg-gray-50 dark:bg-gray-800 border-none text-sm rounded-lg px-3 py-1 text-gray-600 dark:text-gray-300 outline-none">
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: '#F3F4F6', opacity: 0.5 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="income" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expense" fill="#93C5FD" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Sales</h2>
              <p className="text-xs text-gray-500">You made {stats.productCount} products.</p>
            </div>

            <div className="space-y-6">
              {recentSalesMock.map((sale, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <img src={sale.img} alt={sale.name} className="w-10 h-10 rounded-full bg-gray-100" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{sale.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{sale.email}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{sale.amount}</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
