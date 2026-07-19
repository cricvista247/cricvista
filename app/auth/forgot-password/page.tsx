"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UserResetPassword } from "@/app/MainService";
import toast from "react-hot-toast";
import ForgetPassword from "@/components/ForgetPassword";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resData, setResData] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem("currentPath", pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const resetPassword = async (payload: any) => {
    setIsLoading(true);
    return UserResetPassword(payload)
      .then((res) => {
        toast.success(res.message);
        setIsLoading(false);
        return true;
      })
      .catch((err) => {
        toast.error(err.message || "Failed update details. Please try again.");
        setIsLoading(false);
        return false;
      });
  };

  // Handle OTP input change
  const handleOtpChange = (element: any, index: number) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  // Handle OTP key actions
  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      // Focus previous input on backspace
      const prevInput = e.target.previousSibling;
      prevInput.focus();
    }
  };

  // Handle back to login
  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  // Handle send OTP
  const handleSendOtp = async () => {
    const result: any = await resetPassword({
      userId: email,
      type: "generate-otp",
    });

    if (result) {
      setStep(2);
      setCountdown(60); // 30 seconds countdown
      startCountdown();
    }
  };

  // Start countdown for resend OTP
  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    const result: any = await resetPassword({
      userId: email,
      type: "verify-otp",
      otp: otp.join(""),
    });
    if (result) {
      setStep(3);
    }
  };

  // Handle password reset
  const handleResetPassword = async (values: any) => {
    const result: any = await resetPassword({
      userId: email,
      type: "reset-password",
      otp: otp.join(""),
      password: values.password,
    });
    if (result) {
      setResData(result.createdAt);
      setStep(4);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-violet-100 via-indigo-100 to-slate-100 p-4"
    >
      <div className="w-full max-w-md">
        {/* <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Account Recovery</h1>
          <p className="text-indigo-200 mt-2">
            Follow the steps to reset your password
          </p>
        </div> */}

        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-900">
                {step === 1 && "Forgot Password"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "Set New Password"}
                {step === 4 && "Password Reset Successful"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToLogin}
                className="h-8 w-8 text-gray-700 hover:text-indigo-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-600">
              {step === 1 &&
                "Enter your email address to receive a verification code"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Create a new password for your account"}
              {step === 4 && "Your password has been successfully reset"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <Progress value={step * 25} className="h-2 bg-gray-200" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Step {step} of 4</span>
                <span>{step * 25}% Complete</span>
              </div>
            </div>

            {/* Step 1: Email Input */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleSendOtp}
                  disabled={!email || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Verification Code</Label>
                  <div className="flex justify-between space-x-2">
                    {otp.map((data, index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                        className="text-center h-12 text-lg font-semibold bg-white"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 6-digit code sent to{" "}
                    <span className="text-blue-500">{email}</span>
                  </p>
                  <p className="text-xs text-amber-600 text-center font-medium">
                    Can't find the email? Check your spam folder.
                  </p>
                </div>

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleVerifyOtp}
                  disabled={otp.some((digit) => digit === "") || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Verify Code
                    </>
                  )}
                </Button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend code in{" "}
                      <span className="text-blue-500">{countdown} seconds</span>
                    </p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Resend Verification Code
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <div className="space-y-4">
                <ForgetPassword
                  loading={isLoading}
                  onSubmit={handleResetPassword}
                />
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-6 space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Password Reset Successful
                </h3>
                <p className="text-gray-600">
                  Your password has been successfully reset. You can now log in
                  with your new password.
                </p>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {step !== 4 && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Need help?
                    </span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Contact support at{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-indigo-600 hover:underline"
                  >
                    cricvista247@gmail.com
                  </a>
                </p>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
