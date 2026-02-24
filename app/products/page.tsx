"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Filter,
  Download,
  Edit,
  Trash2,
  Plus,
  Loader2
} from "lucide-react";

// Mock Data for View Chart
const viewsData = [
  { name: 'Nov 20', value: 400 },
  { name: 'Nov 21', value: 300 },
  { name: 'Nov 22', value: 500 },
  { name: 'Nov 23', value: 200 },
  { name: 'Nov 24', value: 450 },
  { name: 'Nov 25', value: 600 },
];

export default function Products() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Published");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data.products || []);
      } else {
        setProducts([]);
      }
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on tab (mock: all are "Published" for now)
  const filteredProducts = products.filter(p => {
    if (activeTab === "Draft") {
      return p.isDraft === true;
    }
    return p.isDraft !== true;
  });

  const handleEdit = (productId: string) => {
    // Navigate to edit page with product ID
    router.push(`/add-product?edit=${productId}`);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleteLoading(productId);
    setMessage("");
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.ok) {
        setMessage("Product deleted successfully!");
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to delete");
      }
    } catch (e) {
      setMessage("Network error");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <Header />

      <div className="p-6 overflow-hidden flex flex-col h-full">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product</h1>
          </div>
          <button
            onClick={() => router.push('/add-product')}
            className="bg-[#5932EA] hover:bg-[#4a2bc2] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {message}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Table Section (2/3) */}
          <div className="flex-1 bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-6 border-b border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("Published")}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === "Published" ? "text-gray-900 dark:text-white border-b-2 border-black dark:border-white" : "text-gray-500"}`}
                >
                  Published ({products.filter(p => !p.isDraft).length})
                </button>
                <button
                  onClick={() => setActiveTab("Draft")}
                  className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === "Draft" ? "text-gray-900 dark:text-white border-b-2 border-black dark:border-white" : "text-gray-500"}`}
                >
                  Draft ({products.filter(p => p.isDraft).length})
                </button>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300">
                  <Filter size={14} /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex justify-center items-center h-40 text-gray-400">
                  No products found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-white dark:bg-[#111827]">
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                      <th className="py-3 pl-4 w-10"><input type="checkbox" className="rounded" /></th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">Product Name</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase text-right">Views</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase text-right">Pricing</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase text-right">Revenue</th>
                      <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase text-center">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, idx) => (
                      <tr key={product._id || idx} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 pl-4"><input type="checkbox" className="rounded" /></td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img src={product.image || "https://placehold.co/40"} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{product.name || "Product Name"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-gray-500">14.000</td>
                        <td className="py-4 px-4 text-right text-sm text-gray-500">${product.price || "0"}</td>
                        <td className="py-4 px-4 text-right text-sm text-gray-500">${(product.price || 0) * 164}</td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(product._id)}
                              className="p-1.5 hover:bg-blue-50 rounded text-blue-500 transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              disabled={deleteLoading === product._id}
                              className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteLoading === product._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right Stats Section (1/3) */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">+ 112,893</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-medium text-green-500 bg-green-50 px-1 rounded">+15.5%</span>
                  </div>
                </div>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsData}>
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
