"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

export default function Profile() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    dob: "",
    interests: "",
    socialLinks: { linkedin: "", twitter: "", facebook: "" },
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/signin-form");
      } else {
        setUserEmail(user.email);

        // Fetch profile data from Firestore
        const profileDoc = await getDoc(doc(db, "users", user.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setProfile(data);
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            location: data.location || "",
            dob: data.dob || "",
            interests: data.interests?.join(", ") || "",
            socialLinks: data.socialLinks || {
              linkedin: "",
              twitter: "",
              facebook: "",
            },
          });
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: profile?.name || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      dob: profile?.dob || "",
      interests: profile?.interests?.join(", ") || "",
      socialLinks: profile?.socialLinks || {
        linkedin: "",
        twitter: "",
        facebook: "",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      let imageUrl = profile?.profilePictureUrl || null;

      // Upload profile picture to Firebase Storage
      if (profilePicture) {
        const storageRef = ref(storage, `profile-pictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Update profile data in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        ...formData,
        interests: formData.interests
          .split(",")
          .map((interest) => interest.trim()),
        socialLinks: formData.socialLinks,
        profilePictureUrl: imageUrl,
      });

      console.log("Profile updated successfully!");
      setIsEditing(false);
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
      <div className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div>
          {" "}
          {profile.profilePictureUrl && (
            <div className="flex justify-center mb-4">
              <img
                src={profile.profilePictureUrl}
                alt="Profile Picture"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}{" "}
        </div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
          Welcome, {profile.name || "User"}!
        </h1>
        {!isEditing ? (
          <>
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Name:</strong> {profile.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Bio:</strong> {profile.bio}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Location:</strong> {profile.location}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Date of Birth:</strong> {profile.dob}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Interests:</strong>{" "}
                {profile.interests?.join(", ") || "None"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>LinkedIn:</strong>{" "}
                {profile.socialLinks.linkedin || "Not provided"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Twitter:</strong>{" "}
                {profile.socialLinks.twitter || "Not provided"}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Facebook:</strong>{" "}
                {profile.socialLinks.facebook || "Not provided"}
              </p>
            </div>
            <button
              onClick={handleEdit}
              className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Form fields similar to Onboarding page */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="profilePicture"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="bio"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                rows={4}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="location"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="dob"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 mb-2"
                htmlFor="interests"
              >
                Interests
              </label>
              <input
                type="text"
                id="interests"
                value={formData.interests}
                onChange={(e) =>
                  setFormData({ ...formData, interests: e.target.value })
                }
                placeholder="Comma-separated interests"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Social Media Links
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <input
                  type="url"
                  placeholder="Twitter URL"
                  value={formData.socialLinks.twitter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        twitter: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <input
                  type="url"
                  placeholder="Facebook URL"
                  value={formData.socialLinks.facebook}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        facebook: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
            </div>
            {/* Other form fields... */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-2 text-white rounded-md ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
