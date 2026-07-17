"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MarqueeNoticeProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

const MarqueeNotice = ({
  onClose,
  showCloseButton = true,
}: MarqueeNoticeProps) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <AlertTriangle className="h-5 w-5 text-yellow-200 flex-shrink-0" />
          <div className="marquee-container flex-1 min-w-0">
            <div className="marquee-content">
              <span className="font-medium">
                IMPORTANT NOTICE: If any player information is missing on the
                website but available on other sources, please{" "}
                <Link
                  href="/support"
                  className="underline hover:text-yellow-200 font-semibold"
                >
                  raise a ticket
                </Link>{" "}
                and inform the admin immediately. Missing player data affects
                AI-generated analysis and insights accuracy.
              </span>
            </div>
          </div>
        </div>
        {showCloseButton && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 ml-4 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }

        .marquee-content {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .marquee-content {
            animation-duration: 25s;
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeNotice;
