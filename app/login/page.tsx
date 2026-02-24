"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"MANAGER" | "STORE_KEEPER">("STORE_KEEPER");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const fillDemoCredentials = (demoRole: "MANAGER" | "STORE_KEEPER") => {
    if (demoRole === "MANAGER") {
      setEmail("manager@slooze.com");
      setPassword("password123");
      setRole("MANAGER");
    } else {
      setEmail("keeper@slooze.com");
      setPassword("password123");
      setRole("STORE_KEEPER");
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.token, data.data.user);
        if (data.data.user.role === "MANAGER") {
          router.push("/dashboard");
        } else {
          router.push("/products");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-black">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-24 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Role Selection - Kept from original functional logic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "MANAGER" | "STORE_KEEPER")}
                  className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="STORE_KEEPER">Store Keeper</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember for 30 days
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot Password?
                  </a>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#7F56D9] hover:bg-[#6941C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-black text-gray-500">OR</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5 mr-2"
                />
                Sign in with Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <img
                  src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                  alt="Facebook"
                  className="h-5 w-5 mr-2"
                />
                Sign in with Facebook
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up for free
              </Link>
            </p>

            {/* Demo Credentials Section */}
            <div className="mt-6 p-4 rounded-lg bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/50">
              <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-3 text-center">
                🔑 Demo Credentials (Quick Fill)
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("MANAGER")}
                  className="flex-1 py-2 px-3 text-xs font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  👔 Manager Login
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("STORE_KEEPER")}
                  className="flex-1 py-2 px-3 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  📦 Store Keeper Login
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Click a button above to auto-fill credentials, then hit Sign in
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <Image
            src="/images/auth-bg.png"
            alt="Authentication Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient if needed */}
          <div className="absolute inset-0 bg-transparent"></div>
        </div>
      </div>
    </div>
  );
}