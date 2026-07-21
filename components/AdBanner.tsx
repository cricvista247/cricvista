"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  adSlot?: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  adLayout?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AdBanner — renders a Google AdSense ad unit.
 * Ads are suppressed for admin users.
 * In development, ads appear as empty boxes (normal behaviour).
 */
const AdBanner = ({
  adSlot = "1321189639",
  adFormat = "auto",
  adLayout,
  className = "",
  style,
}: AdBannerProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);
  const { user } = useSelector((state: RootState) => state.auth);

  // Hide ads for admin users
  if (user?.role === "admin") return null;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div
      className={`adsense-wrapper overflow-hidden text-center ${className}`}
      style={style}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3220405841079438"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        {...(adLayout ? { "data-ad-layout": adLayout } : {})}
      />
    </div>
  );
};

export default AdBanner;
