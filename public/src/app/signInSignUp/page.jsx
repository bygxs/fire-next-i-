// src/app/signInSignUp/page.tsx
"use client";
import { useState } from "react";
import SignInForm from "../signin-form/page"; // Reuse your existing SignInForm
import SignUpForm from "../signup-form/page"; // Reuse your existing SignUpForm
export default function SignInSignUpPage() {
    const [isSignUp, setIsSignUp] = useState(false); // State to toggle between modes
    return (<div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      {/* Form Container */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        {/* Toggle Button */}
        <div className="text-center mb-6">
          <button onClick={() => setIsSignUp(!isSignUp)} // Toggle between sign-in and sign-up
     className="text-blue-500 hover:underline focus:outline-none">
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Render Sign-In or Sign-Up Form */}
        {isSignUp ? <SignUpForm /> : <SignInForm />}
      </div>
    </div>);
}
