// src/app/signsignsign/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInSignUpPage() {
  const [mode, setMode] = useState<"signIn" | "signUp" | "forgotPassword">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Simulate sign-in logic
    if (email === "user@example.com" && password === "password") {
      setSuccess("Sign-in successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 2000); // Redirect after 2 seconds
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Simulate sign-up logic
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setSuccess("Sign-up successful! Redirecting...");
    setTimeout(() => router.push("/onboarding"), 2000); // Redirect after 2 seconds
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Simulate forgot password logic
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setSuccess("Password reset email sent! Check your inbox.");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        {/* Mode Toggle Buttons */}
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setMode("signIn")}
            className={`text-blue-500 hover:underline focus:outline-none ${
              mode === "signIn" ? "font-bold underline" : ""
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signUp")}
            className={`text-blue-500 hover:underline focus:outline-none ${
              mode === "signUp" ? "font-bold underline" : ""
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode("forgotPassword")}
            className={`text-blue-500 hover:underline focus:outline-none ${
              mode === "forgotPassword" ? "font-bold underline" : ""
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
            {success}
          </div>
        )}

        {/* Form Rendering */}
        {mode === "signIn" && (
          <form onSubmit={handleSignIn}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Sign In
            </h2>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 dark:text-gray-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 dark:text-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>
        )}

        {mode === "signUp" && (
          <form onSubmit={handleSignUp}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Sign Up
            </h2>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 dark:text-gray-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 dark:text-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        )}

        {mode === "forgotPassword" && (
          <form onSubmit={handleForgotPassword}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Forgot Password
            </h2>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 dark:text-gray-400 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}