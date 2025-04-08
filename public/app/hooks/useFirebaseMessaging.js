// Step 2: Create a custom hook for Firebase messaging
// hooks/useFirebaseMessaging.ts
import { useState, useEffect } from 'react';
import { getFCMToken, onMessageListener } from '../lib/firebase';
export const useFirebaseMessaging = () => {
    // State for FCM token
    const [token, setToken] = useState(null);
    // State for notification data to display
    const [notification, setNotification] = useState(null);
    // State for browser notification permission status
    const [notificationPermission, setNotificationPermission] = useState(null);
    // Check initial permission status on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setNotificationPermission(Notification.permission); // Set to "default", "granted", or "denied"
        }
    }, []);
    // Function to fetch FCM token
    const getToken = async () => {
        try {
            const fcmToken = await getFCMToken(); // Call utility to get token
            if (fcmToken) {
                setToken(fcmToken); // Store token in state
                console.log('Token obtained:', fcmToken); // Log for debugging
            }
        }
        catch (error) {
            console.error('Error getting token:', error); // Log any errors
        }
    };
    // Function to request browser notification permission
    const requestPermission = async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            try {
                const permission = await Notification.requestPermission(); // Ask user for permission
                setNotificationPermission(permission); // Update permission state
                if (permission === 'granted') {
                    getToken(); // Get token if permission is granted
                }
                return permission; // Return result ("granted", "denied", etc.)
            }
            catch (error) {
                console.error('Error requesting permission:', error); // Log errors
                return 'denied'; // Default to denied on error
            }
        }
        return null; // Return null if not in browser
    };
    // Listen for incoming FCM messages
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Handler for incoming messages
            const handleMessage = (payload) => {
                var _a, _b, _c;
                console.log('New notification:', payload); // Log the raw payload
                // Extract notification data from payload
                const notificationData = payload.notification || {
                    title: (_a = payload.data) === null || _a === void 0 ? void 0 : _a.title,
                    body: (_b = payload.data) === null || _b === void 0 ? void 0 : _b.body,
                    image: (_c = payload.data) === null || _c === void 0 ? void 0 : _c.image,
                };
                if (notificationData) {
                    // Set notification state for UI display
                    setNotification({
                        title: notificationData.title || '',
                        body: notificationData.body || '',
                        image: notificationData.image,
                    });
                    // Show browser notification if permission is granted
                    if (Notification.permission === 'granted') {
                        console.log('Permission granted, showing notification'); // Debug permission
                        new Notification(notificationData.title || 'Notification', {
                            body: notificationData.body || '', // Notification body
                            icon: notificationData.image || undefined, // Optional image
                        });
                    }
                    else {
                        console.log('Permission not granted:', Notification.permission); // Debug why it’s not showing
                    }
                }
            };
            // Set up listener and get unsubscribe function
            const unsubscribe = onMessageListener(handleMessage);
            // Cleanup listener on unmount
            return () => unsubscribe && unsubscribe();
        }
    }, []);
    // Return hook utilities
    return {
        token, // FCM token
        notification, // Notification data for UI
        notificationPermission, // Current permission status
        requestPermission, // Function to request permission
        getToken, // Function to get token
        clearNotification: () => setNotification(null), // Clear notification state
    };
};
