/* "use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignUpRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/signInSignUp?mode=signup");
  }, [router]);
  return null;
}
 */
 //// src/app/signup-form/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // For error messages
  const [success, setSuccess] = useState<string | null>(null); // For success messages
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error
    setSuccess(null); // Reset success message

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created:", user.uid);

      // Show success message
      setSuccess("User created successfully! Redirecting...");

      // Redirect to Profile after a short delay
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000); // 2 seconds delay
    } catch (error: any) {
      console.error("Sign-up error:", error);

      // Handle specific Firebase errors
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("User with this email already exists.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password is too weak.");
          break;
        default:
          setError("Failed to create user. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Sign Up
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

