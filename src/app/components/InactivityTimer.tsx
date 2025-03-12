// src/app/components/InactivityTimer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface InactivityTimerProps {
  onSignOut: () => void;
}

export default function InactivityTimer({ onSignOut }: InactivityTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const toastId = useRef<string | null>(null); // Store the toast ID

  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  const WARNING_TIME = 1 * 60 * 1000; // 1 minute

  const startInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setTimeLeft(60);
      startWarningTimer();
    }, INACTIVITY_TIMEOUT - WARNING_TIME);
  };

  const startWarningTimer = () => {
    if (warningTimer.current) clearInterval(warningTimer.current);
    warningTimer.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(warningTimer.current!);
          onSignOut();
          return null;
        }
        return prevTime ? prevTime - 1 : null;
      });
    }, 1000);
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearInterval(warningTimer.current);
    setTimeLeft(null);
    startInactivityTimer();
    if (toastId.current) toast.dismiss(toastId.current); // Dismiss the toast
  };

  useEffect(() => {
    const handleUserActivity = () => resetInactivityTimer();
    const events = ["mousemove", "keydown", "click", "scroll", "touchmove"];

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  useEffect(() => {
    if (timeLeft !== null) {
      // Show the toast only once
      if (!toastId.current) {
        toastId.current = toast(
          (t) => (
            <div>
              <p>You will be signed out in {timeLeft} seconds.</p>
              <button
                onClick={() => {
                  resetInactivityTimer();
                  toast.dismiss(t.id); // Dismiss the toast when the button is clicked
                }}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Stay Signed In
              </button>
            </div>
          ),
          {
            duration: Infinity, // Keep the toast open until dismissed
          }
        );
      } else {
        // Update the existing toast with the new timeLeft value
        toast(
          (t) => (
            <div>
              <p>You will be signed out in {timeLeft} seconds.</p>
              <button
                onClick={() => {
                  resetInactivityTimer();
                  toast.dismiss(t.id); // Dismiss the toast when the button is clicked
                }}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Stay Signed In
              </button>
            </div>
          ),
          {
            id: toastId.current, // Update the existing toast
          }
        );
      }
    }
  }, [timeLeft]);

  return null; // No need to render anything
}
