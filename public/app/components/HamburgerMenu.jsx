"use client";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import NavLinks from "./NavLinks";
export default function HamburgerMenu({ isSignedIn, onSignOut, }) {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserName(data.name || "User");
                    setProfilePictureUrl(data.profilePictureUrl || "/default-user.png");
                }
            }
        };
        if (isSignedIn) {
            fetchUserData();
        }
    }, [isSignedIn]);
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    return (<div className="md:hidden">
      {/* Hamburger Icon */}
      <button onClick={toggleMenu} className="p-2 focus:outline-none">
        {isOpen ? (<span className="text-2xl">✕</span> // Close icon
        ) : (<span className="text-2xl">☰</span> // Hamburger icon
        )}
      </button>

      {/* Menu Overlay */}
      {isOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeMenu}></div>)}

      {/* Menu Content */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* User Info */}
        {isSignedIn && (<div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              {profilePictureUrl && (<img src={profilePictureUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover"/>)}
              {userName && (<span className="text-gray-800 dark:text-gray-200">{userName}</span>)}
            </div>
          </div>)}

        {/* Theme Toggle */}
      {/*   <div className="flex justify-center mt-4">
            <ThemeToggle />
          </div>
   */}
        {/* Vertical NavLinks */}
        <div className="p-4">
          <div className="flex flex-col space-y-4 [&>*]:block">
            <NavLinks isSignedIn={isSignedIn} onLinkClick={closeMenu}/>
          </div>
        </div>

        {/* Sign Out Button */}
        {isSignedIn && (<button onClick={() => {
                onSignOut();
                closeMenu();
            }} className="ml-17 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 dark:bg-red-600 dark:hover:bg-red-700 text-sm font-medium">
            Sign Out
          </button>)}
      </div>
    </div>);
}
