"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // ADDED

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Signed in:", user.uid);

      setSuccess("Sign-in successful! Redirecting...");
      setTimeout(() => {
        const redirectURL = searchParams.get('redirect') || '/dashboard'; // ADDED
        router.push(redirectURL); // MODIFIED
      }, 1000);
    } catch (error: any) {
      console.error("Sign-in error:", error);

      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/user-not-found":
          setError("User not found. Please check your email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        default:
          setError("Failed to sign in. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Sign In
        </h2>

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg dark:bg-green-800 dark:text-green-100">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg dark:bg-red-800 dark:text-red-100">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-600 dark:text-gray-400 mb-2"
          >
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
          <label
            htmlFor="password"
            className="block text-gray-600 dark:text-gray-400 mb-2"
          >
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
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Forgot your password?{" "}
          <Link
            href="/forgot-password"
            className="text-blue-500 hover:underline"
          >
            Reset it here.
          </Link>
        </p>
      </form>
    </div>
  );
}
