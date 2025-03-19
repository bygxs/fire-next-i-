// src/components/GoogleAnalytics.tsx
"use client"; // Marks this component as a client component
import { useEffect } from "react";
const GoogleAnalytics = () => {
    useEffect(() => {
        const googleTagId = "G-25L0KPBS0H"; // Replace with your actual Google Tag ID
        const script1 = document.createElement("script");
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagId}`;
        document.head.appendChild(script1);
        const script2 = document.createElement("script");
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleTagId}');
    `;
        document.head.appendChild(script2);
    }, []);
    return null; // This component doesn't render anything
};
export default GoogleAnalytics;
