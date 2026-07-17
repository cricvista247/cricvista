"use client";
import { useState, useRef, useEffect } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface DailyCreditAdProps {
  isOpen: boolean;
  onClose: () => void;
  onCreditAdd?: () => void;
  dailyCreditRes: {
    message: string;
    isSuccess: boolean;
  };
}
export const DailyCreditAd = ({
  isOpen,
  onClose,
  onCreditAdd,
  dailyCreditRes,
}: DailyCreditAdProps) => {
  const [isWatching, setIsWatching] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const videoRef = useRef<HTMLVideoElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset all states when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const startWatching = () => {
    setIsWatching(true);
    videoRef.current?.play();
    startCountdown();
  };

  const startCountdown = () => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          setIsCompleted(true);
          onCreditAdd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetState = () => {
    setIsWatching(false);
    setIsCompleted(false);
    setCountdown(30);

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    videoRef.current?.pause();

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Get Daily Free Credits</DialogTitle>
          <DialogDescription>
            Watch a short video to earn 1 credits for your wallet
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {!isWatching && !isCompleted && (
            <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Watch this ad to earn credits
                </h3>
                <p className="text-gray-600 mb-4">
                  30 seconds of your time for 1 free credits
                </p>
                <Button
                  onClick={startWatching}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Watching
                </Button>
              </div>
            </div>
          )}

          {isWatching && !isCompleted && (
            <>
              <div className="relative w-full">
                <video
                  ref={videoRef}
                  className="w-full aspect-video rounded-lg bg-black"
                  src="/sample-ad.mp4"
                  controls={false}
                  muted
                  autoPlay={false}
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {countdown}s remaining
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${100 - (countdown / 30) * 100}%` }}
                ></div>
              </div>
            </>
          )}

          {isCompleted && (
            <div className="w-full p-6 text-center">
              {dailyCreditRes.isSuccess ? (
                // ✅ Success state
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Credits Added!</h3>
                  <p className="text-gray-600 mb-4">
                    1 credit has been added to your wallet
                  </p>
                </>
              ) : dailyCreditRes.isSuccess === false ? (
                // ❌ Error state
                <>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Error Adding Credits
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {dailyCreditRes.message ||
                      "Failed to add daily credits to your wallet"}
                  </p>
                </>
              ) : (
                // ⏳ Loading state (progress spinner)
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">
                    Adding your credits...
                  </h3>
                </div>
              )}

              <Button
                onClick={() => {
                  onClose();
                  resetState();
                }}
                className={`mt-6 ${
                  dailyCreditRes.isSuccess
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-500 hover:bg-gray-600"
                } text-white px-4 py-2 rounded-md transition-colors`}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
