// src/app/forgot-password/page.tsx
"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent. Please check your inbox.");
        }
        catch (error) {
            console.error("Error sending password reset email:", error);
            switch (error.code) {
                case "auth/invalid-email":
                    setError("Invalid email address.");
                    break;
                case "auth/user-not-found":
                    setError("No user found with this email address.");
                    break;
                default:
                    setError("Failed to send password reset email. Please try again later.");
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 dark:text-gray-400 mb-2">
              Email
            </label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required/>
          </div>
          {message && (<div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg dark:bg-green-800 dark:text-green-100">
              {message}
            </div>)}
          {error && (<div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg dark:bg-red-800 dark:text-red-100">
              {error}
            </div>)}
          <button type="submit" disabled={isSubmitting} className={`w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
            {isSubmitting ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Remember your password?{" "}
          <Link href="/signin-form" className="text-blue-500 hover:underline">
            Sign in here.
          </Link>
        </p>
      </div>
    </div>);
}
