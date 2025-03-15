'use client'; // Client-side directive for Next.js

/**
 * Dashboard page for authenticated users.
 * Displays profile info with text wrapping around a circular picture, admin controls,
 * and navigation links. Responsive for desktop, tablet, and mobile.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface Profile {
  name: string;
  bio: string;
  location?: string;
  dob?: string;
  interests?: string[];
  profilePictureUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  role?: string;
}

// SocialLinks Component
const SocialLinks = ({ links }: { links?: Profile['socialLinks'] }) => (
  <div className="mt-6 space-y-2">
    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
      Social Links
    </h3>
    <div className="flex gap-4">
      {links?.linkedin && (
        <a href={links.linkedin} className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
          LinkedIn
        </a>
      )}
      {links?.twitter && (
        <a href={links.twitter} className="text-sky-500 hover:text-sky-700 dark:text-sky-400">
          Twitter
        </a>
      )}
      {links?.facebook && (
        <a href={links.facebook} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
          Facebook
        </a>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/");
        return;
      }

      setUserEmail(user.email);
      try {
        const profileDoc = await getDoc(doc(db, "users", user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as Profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pt-6 sm:pt-8 lg:pt-10">
 
       <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
  Welcome to the Dashboard,{" "}
  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    {profile?.name}
  </span>
</h3>
<h4 className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 text-center">
  <span className="font-semibold italic">{userEmail || "User"}</span> is used to log in.
</h4>


{/* Admin Section */}
{profile?.role === "admin" && (
  <div className="mb-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto">
    <p className="text-green-500 text-center text-lg sm:text-xl font-medium mb-6">
      You’re an admin! Secret powers unlocked.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/admin/users"
        className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-center sm:w-auto w-full"
      >
        Go to Admin Panel
      </Link>
      <Link
        href="/admin/content-create"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-center sm:w-auto w-full"
      >
        Manage Content
      </Link>
      <Link
        href="/admin/art-upload"
        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 text-center sm:w-auto w-full"
      >
        Upload Art
      </Link>
    </div>
  </div>
)}



        {/* Admin Section */}
    {/*     {profile?.role === "admin" && (
          <div className="mb-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md ">
            <p className="text-green-500 text-center sm:text-left mb-4">
              You’re an admin! Secret powers unlocked.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link
                href="/admin/users"
                className="px-6 py-3 bg-blue-700 text-white rounded hover:bg-blue-600 text-center"
              >
                Go to Admin Panel
              </Link>
              <Link
                href="/admin/content-create"
                className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
              >
                Manage Content
              </Link>
              <Link
                href="/admin/art-upload"
                className="px-6 py-3 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-center"
              >
                Upload Art
              </Link>
            </div>
          </div>
        )} */}

        {/* Navigation Links */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/art-show"
            className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
          >
            View Art
          </Link>
          <Link
            href="/profile"
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
          >
            Edit Profile
          </Link>
        </div>

        {/* Profile Section */}
        {profile ? (
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="relative overflow-hidden ">
              {profile.profilePictureUrl && (
                <img
                  src={profile.profilePictureUrl}
                  alt="Profile Picture"
                  className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover float-left mr-6 mb-4"
                  style={{
                    shapeOutside: "circle()", // Ensures text wraps around the circle
                    marginLeft: "0.5rem", // Adjusts for circular shape
                  }}
                />
              )}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {profile.name}
                </h2>
                <div className="prose dark:prose-invert">
                  <p className="text-gray-600 dark:text-gray-300">
                    {profile.bio || "No bio provided"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <ProfileField label="Location" value={profile.location} />
                    <ProfileField label="Date of Birth" value={profile.dob} />
                    <ProfileField
                      label="Interests"
                      value={profile.interests?.join(", ")}
                    />
                  </div>
                <SocialLinks links={profile.socialLinks} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No profile data found. Please complete your profile.
          </p>
        )}
      </div>
    </div>
  );
}

// Helper components
const ProfileField = ({ label, value }: { label: string; value?: string }) => (
  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
    <strong className="block text-sm font-medium text-gray-600 dark:text-gray-300">
      {label}:
    </strong>
    <span className="text-gray-800 dark:text-gray-200">
      {value || "Not provided"}
    </span>
  </div>
);
