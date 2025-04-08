// src/app/sign-fullstac/page.tsx
"use client";
import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loginMethod, setLoginMethod] = useState("email");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const router = useRouter();
    // Placeholder functions
    const handleGoogleAuth = () => toast.info("Google auth placeholder");
    const handleAppleAuth = () => toast.info("Apple auth placeholder");
    const handleFacebookAuth = () => toast.info("Facebook auth placeholder");
    const handlePhoneAuth = () => toast.info("Phone auth placeholder");
    // Password reset handler
    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent. Check your inbox.");
            setShowForgotPassword(false);
        }
        catch (err) {
            toast.error(err.message || "Failed to send reset email");
        }
    };
    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (isSignUp) {
                const userCred = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", userCred.user.uid), {
                    email,
                    role: "user",
                    createdAt: new Date().toISOString(),
                });
                toast.success("Account created!");
                router.push("/profile");
            }
            else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Signed in successfully!");
                router.push("/dashboard");
            }
        }
        catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };
    return (<div className="flex flex-col items-center justify-center min-h-screen bg-gray-300 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        {showForgotPassword ? (<>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Reset Password
            </h1>
            <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4" required/>
            <button onClick={handlePasswordReset} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4">
              Send Reset Link
            </button>
            <button onClick={() => setShowForgotPassword(false)} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              Back to {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </>) : (<>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              {isSignUp ? "Create Account" : "Sign In"}
            </h1>

            {/* Auth Method Toggle */}
            <div className="mb-4 flex">
              <button onClick={() => setLoginMethod("email")} className={`flex-1 py-2 px-4 ${loginMethod === "email"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"} rounded-l-md`}>
                Email
              </button>
              <button onClick={() => setLoginMethod("phone")} className={`flex-1 py-2 px-4 ${loginMethod === "phone"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"} rounded-r-md`}>
                Phone
              </button>
            </div>

            {/* Dynamic Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {loginMethod === "email" ? (<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>) : (<input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>)}

              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>

              {!isSignUp && loginMethod === "email" && (<button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-blue-600 hover:underline dark:text-blue-400 text-left">
                  Forgot password?
                </button>)}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            {/* Phone Auth Placeholder */}
            {loginMethod === "phone" && (<button onClick={handlePhoneAuth} className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 flex items-center justify-center">
                Send Verification Code
              </button>)}

            {/* Toggle Between Sign Up/Sign In */}
            <div className="mt-4 text-center">
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
              </button>
            </div>

            {/* Social Login Placeholders */}
            <div className="mt-6 space-y-4">
              <button onClick={handleGoogleAuth} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 flex items-center justify-center">
                <Image src="/icons8-google-logo.svg" alt="Google" width={20} height={20} className="mr-2"/>
                Continue with Google
              </button>
              <button onClick={handleAppleAuth} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 flex items-center justify-center">
                <Image src="/icons8-apple-logo.svg" alt="Apple" width={20} height={20} className="mr-2"/>
                Continue with Apple
              </button>
              <button onClick={handleFacebookAuth} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 flex items-center justify-center">
                <Image src="/icons8-facebook.svg" alt="Facebook" width={20} height={20} className="mr-2"/>
                Continue with Facebook
              </button>
            </div>
          </>)}
      </div>
    </div>);
}
