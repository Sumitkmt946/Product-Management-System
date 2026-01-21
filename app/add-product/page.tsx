"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Image as ImageIcon, Plus, Check, Loader2 } from "lucide-react";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    discount: "",
    stock: "0",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscard = () => {
    setProductData({
      name: "",
      category: "",
      description: "",
      price: "",
      discount: "",
      stock: "0",
    });
    setMessage("");
  };

  const handleSave = async (publish: boolean) => {
    setLoading(true);
    setMessage("");

    if (!productData.name || !productData.category || !productData.price) {
      setMessage("Please fill required fields");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login first");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("category", productData.category);
      formData.append("price", productData.price);
      formData.append("discount", productData.discount || "0");
      formData.append("description", productData.description);
      formData.append("stock", productData.stock || "0");

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(publish ? "Product published!" : "Draft saved!");
        setTimeout(() => router.push("/products"), 1500);
      } else {
        setMessage(data.message || "Failed to save");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <Header />

      <div className="p-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Product</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 text-red-500 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Discard Change
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={loading}
              className="px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={loading}
              className="px-4 py-2 bg-[#5932EA] hover:bg-[#4a2bc2] text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Publish Product</>}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("!") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {message}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Form (2/3) */}
          <div className="flex-[2] space-y-6">
            {/* General Information */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">General Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Category *</label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Description"
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all dark:text-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      value={productData.discount}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={productData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Images (1/3) */}
          <div className="flex-1 space-y-6">
            {/* Previews Product (Main Image) */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Previews Product</h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px] text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <ImageIcon size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
                <span className="text-sm font-medium">Drag and drop here</span>
              </div>
            </div>

            {/* Thumbnail Product */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Thumbnail Product</h2>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center min-h-[150px] text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <ImageIcon size={32} className="mb-4 text-gray-300 dark:text-gray-600" />
                <span className="text-sm font-medium">Drag and drop here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
