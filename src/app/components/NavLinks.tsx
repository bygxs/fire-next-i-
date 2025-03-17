  

// src/app/components/NavLinks.tsx
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faTachometerAlt,
  faUser,
  faSignInAlt,
  faUserPlus,
  faUsersCog,
} from "@fortawesome/free-solid-svg-icons";

interface NavLinksProps {
  isSignedIn: boolean;
  onLinkClick?: () => void; // Optional callback for closing the hamburger menu
}

export default function NavLinks({ isSignedIn, onLinkClick }: NavLinksProps) {
  return (
    <div className="flex items-center space-x-6">
      {/* // {/* Admin Panel Link  */}
      {isSignedIn && (
        <Link
          href="/admin/users"
          className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-300"
          onClick={onLinkClick}
        >
          <FontAwesomeIcon icon={faUsersCog} className="w-6 h-6" />
          <span className="text-xs mt-1">Admin</span>
        </Link>
      )}

      {/* // {/* Home Link  */}
      <Link
        href="/"
        className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-300"
        onClick={onLinkClick}
      >
        <FontAwesomeIcon icon={faHome} className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>

      {/* // {/* Content Link  */}
      <Link
        href="/content-show"
        className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-300"
        onClick={onLinkClick}
      >
        <FontAwesomeIcon icon={faBook} className="w-6 h-6" />
        <span className="text-xs mt-1">Content</span>
      </Link>

      {/* // {/* Signed-In Links  */}
      {isSignedIn && (
        <>
         
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-300"
            onClick={onLinkClick}
          >
            <FontAwesomeIcon icon={faTachometerAlt} className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>

          {/* // {/* Profile Link  */}
          <Link
            href="/profile"
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-300"
            onClick={onLinkClick}
          >
            <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          <Link
            href="/onboarding"
            className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
            onClick={onLinkClick}
          >
             <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
            <span className="text-lg mt-1">Onboarding</span>{" "}
          
          </Link>
        </>
      )}

      {/* // {/* Signed-Out Links  */}
      {!isSignedIn && (
        <>
          {/* // {/* Sign In Link  */}
          <Link
            href="/signin-form"
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-300"
            onClick={onLinkClick}
          >
            <FontAwesomeIcon icon={faSignInAlt} className="w-6 h-6" />
            <span className="text-xs mt-1">Sign In</span>
          </Link>

          {/* // {/* Sign Up Link  */}
          <Link
            href="/signup-form"
            className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-300"
            onClick={onLinkClick}
          >
            <FontAwesomeIcon icon={faUserPlus} className="w-6 h-6" />
            <span className="text-xs mt-1">Sign Up</span>
          </Link>
        </>
      )}
    </div>
  );
} 

/* // src/app/components/NavLinks.tsx
import Link from "next/link";

interface NavLinksProps {
  isSignedIn: boolean;
  onLinkClick?: () => void; // Optional callback for closing the hamburger menu
}

export default function NavLinks({ isSignedIn, onLinkClick }: NavLinksProps) {
  return (
    <>
      <Link
                href="/admin/users"
                className="text-xs px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 text-center sm:w-auto w-full"
              >
                AdminPanel
              </Link>
      <Link href="/" onClick={onLinkClick}>
        <span className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
          Home
        </span>
      </Link>

      <Link href="/content-show" onClick={onLinkClick}>
        <span className=" text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
          content
        </span>
      </Link>

      {isSignedIn && (
        <>
          <Link href="/dashboard" onClick={onLinkClick}>
            <span className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Dashboard
            </span>
          </Link>
          <Link href="/onboarding" onClick={onLinkClick}>
            <span className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Onboarding
            </span>
          </Link>
          <Link href="/profile" onClick={onLinkClick}>
            <span className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Profile
            </span>
          </Link>
        </>
      )}

      {!isSignedIn && (
        <>
          <Link href="/signin-form" onClick={onLinkClick}>
            <span className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Sign In
            </span>
          </Link>
          <Link href="/signup-form" onClick={onLinkClick}>
            <span className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition duration-300">
              Sign Up
            </span>
          </Link>
        </>
      )}
    </>
  );
}


 
  
  import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faHome,
//   faBook,
//   faTachometerAlt,
//   faUser,
//   faSignInAlt,
//   faUserPlus,
//   faUsersCog,
// } from "@fortawesome/free-solid-svg-icons";
/* 
interface NavLinksProps {
  isSignedIn: boolean;
  onLinkClick?: () => void; // Optional callback for closing the hamburger menu
}

export default function NavLinks({ isSignedIn, onLinkClick }: NavLinksProps) {
  return (
    <div className="flex items-center space-x-6">

      // {/* Admin Panel Link 
      {isSignedIn && (
        <Link
          href="/admin/users"
          className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
          onClick={onLinkClick}
        >
          // {/* <FontAwesomeIcon icon={faUsersCog} className="w-6 h-6" /> 
          <span className="text-lg mt-1">Admin</span>{" "}
          // {/* Increased text size 
        </Link>
      )}

      // {/* Home Link 
      <Link
        href="/"
        className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
        onClick={onLinkClick}
      >
        // {/* <FontAwesomeIcon icon={faHome} className="w-6 h-6" /> 
        // <span className="text-lg mt-1">Home</span> {/* Increased text size 
      </Link>

      // {/* Content Link 
      <Link
        href="/content-show"
        className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
        onClick={onLinkClick}
      >
        // {/* <FontAwesomeIcon icon={faBook} className="w-6 h-6" />
        <span className="text-lg mt-1">Content</span>{" "}
        // {/* Increased text size 
      </Link>

      // {/* Signed-In Links 
      {isSignedIn && (
        <>
          // {/* Dashboard Link 
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
            onClick={onLinkClick}
          >
            // {/* <FontAwesomeIcon icon={faTachometerAlt} className="w-6 h-6" /> 
            <span className="text-lg mt-1">Dashboard</span>{" "}
            // {/* Increased text size 
          </Link>

          // {/* Profile Link 
          <Link
            href="/profile"
            className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
            onClick={onLinkClick}
          >
            // {/* <FontAwesomeIcon icon={faUser} className="w-6 h-6" /> 
            <span className="text-lg mt-1">Profile</span>{" "}
            // {/* Increased text size 
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
            onClick={onLinkClick}
          >
            // {/* <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
            <span className="text-lg mt-1">Onboarding</span>{" "}
            // {/* Increased text size *
          </Link>
        </>
      )}

      // {/* Signed-Out Links 
      {!isSignedIn && (
        <>
          
          <Link
            href="/signin-form"
            className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
            onClick={onLinkClick}
          >
            // {/* <FontAwesomeIcon icon={faSignInAlt} className="w-6 h-6" /> 
            <span className="text-lg mt-1">Sign In</span>{" "}
 
          </Link>


          <Link
            href="/signup-form"
            className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition duration-300"
            onClick={onLinkClick}
          >
            // {/* <FontAwesomeIcon icon={faUserPlus} className="w-6 h-6" /> 
            <span className="text-lg mt-1">Sign Up</span>{" "}
       
          </Link>
        </>
      )}
    </div>
  );
}
 */
