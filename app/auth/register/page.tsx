/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Mail,
  Phone,
  Lock,
  User,
  Sparkles,
  Check,
  Key,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { loginSuccess } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  FormikCheckBox,
  FormikTextInput,
  FormikTextPassword,
} from "@/components/CustomField";
import {
  UserRegister,
  SendVerificationCode,
  VerifyEmailCode,
} from "@/app/MainService";

// Validation schemas
const emailValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Invalid email address"),
});

const verificationSchema = Yup.object({
  verificationCode: Yup.string()
    .required("Verification code is required")
    .matches(/^[0-9]{6}$/, "Code must be 6 digits"),
});

const registrationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),

  name: Yup.string()
    .trim()
    .required("Name is required")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  mobileNumber: Yup.string()
    .trim()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),

  agreeToTerms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions",
  ),
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Registration, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [resData, setResData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem("currentPath", pathname);
  }, [pathname]);

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

  // Handle send verification code
  const handleSendVerification = async (values: any) => {
    setIsLoading(true);
    try {
      await SendVerificationCode({ email: values.email, type: "generate" });
      setEmail(values.email);
      setIsLoading(false);
      setStep(2);
      setCountdown(60); // 60 seconds countdown
      startCountdown();
      toast.success("Verification code sent to your email!");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || "Failed to send verification code");
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      await VerifyEmailCode({
        email,
        otp: otp.join(""),
        type: "verified",
      });
      setIsLoading(false);
      toast.success("Email verified successfully!");
      setStep(3);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || "Invalid verification code");
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await SendVerificationCode({ email, type: "generate" });
      setCountdown(60);
      startCountdown();
      toast.success("New verification code sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (values: any) => {
    setIsLoading(true);
    try {
      const formData = {
        username: values.username.trim(),
        name: values.name.trim(),
        email: email.trim().toLowerCase(),
        mobileNumber: values.mobileNumber.trim(),
        password: values.password,
        agreeToTerms: values.agreeToTerms,
        type: "finalize",
        otp: otp.join(""),
      };

      const res = await UserRegister(formData);
      const userData = {
        id: res.data.user._id,
        username: res.data.user.username,
        email: res.data.user.email,
        mobile: res.data.user.mobileNumber,
        credits: res.data.user.role === "admin" ? 999 : res.data.user.credits,
        role: res.data.user.role,
        isActive: res.data.user.isActive,
        token: res.data.token,
        subscription: res.data.user.subscription ?? [],
      };

      localStorage.setItem("token", res.data.token);
      dispatch(loginSuccess(userData));
      toast.success("Account created successfully!");
      setUserData(userData);
      setStep(4);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/matches");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-violet-100 via-indigo-100 to-slate-100 p-4"
    >
      <div className="w-full max-w-md">
        {/* <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">CricVista</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
          <p className="text-indigo-200 mt-2">
            Join our prediction community and start winning
          </p>
        </div> */}

        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gray-900">
                {step === 1 && "Email Verification"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "Complete Profile"}
                {step === 4 && "Registration Successful"}
              </CardTitle>
              {step !== 4 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToLogin}
                  className="h-8 w-8 text-gray-700 hover:text-indigo-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardDescription className="text-gray-600">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && "Enter the 6-digit code sent to your email"}
              {step === 3 && "Fill in your details to complete registration"}
              {step === 4 && "Your account has been successfully created"}
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
                <Formik
                  initialValues={{ email: email }}
                  validationSchema={emailValidationSchema}
                  onSubmit={handleSendVerification}
                >
                  {({ handleSubmit, isSubmitting, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700">
                            Email/Gmail Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              id="email"
                              type="email"
                              name="email"
                              placeholder="dummy123@gmail.com"
                              className="pl-10 bg-white"
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setFieldValue("email", e.target.value.trim());
                              }}
                              value={email}
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                          disabled={!email || isLoading || isSubmitting}
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
                    </Form>
                  )}
                </Formik>
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
                        name="otp"
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
                      Resend code in {countdown} seconds
                    </p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Code
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Registration Form */}
            {step === 3 && (
              <div className="space-y-4">
                <Formik
                  initialValues={{
                    username: "",
                    name: "",
                    mobileNumber: "",
                    password: "",
                    confirmPassword: "",
                    agreeToTerms: false,
                  }}
                  validationSchema={registrationSchema}
                  onSubmit={handleRegister}
                >
                  {({ handleSubmit, isSubmitting, setFieldValue }) => (
                    <Form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Field
                            label="Username"
                            component={FormikTextInput}
                            name="username"
                            placeholder="Choose a unique username"
                            onChange={(e: any) =>
                              setFieldValue(
                                "username",
                                e?.target?.value?.trim(),
                              )
                            }
                            icon={
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Field
                            label="Full Name"
                            component={FormikTextInput}
                            name="name"
                            placeholder="Enter your full name"
                            icon={
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Field
                            label="Mobile Number"
                            component={FormikTextInput}
                            name="mobileNumber"
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            icon={
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Field
                            label="Password"
                            component={FormikTextPassword}
                            name="password"
                            placeholder="Create a strong password"
                            icon={
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Field
                            label="Confirm Password"
                            component={FormikTextPassword}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            icon={
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            }
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Field
                            label={
                              <span className="text-sm">
                                I agree to the{" "}
                                <Link
                                  href="/terms"
                                  className="text-indigo-600 hover:underline"
                                >
                                  Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                  href="/privacy"
                                  className="text-indigo-600 hover:underline"
                                >
                                  Privacy Policy
                                </Link>
                              </span>
                            }
                            component={FormikCheckBox}
                            name="agreeToTerms"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        disabled={isLoading || isSubmitting}
                      >
                        {isLoading ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Complete Registration
                          </>
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
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
                  Registration Successful!
                </h3>
                <p className="text-gray-600">
                  Welcome to CricVista, {userData?.username}! Your account
                  has been created successfully. You will be redirected to the
                  matches page shortly.
                </p>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => router.push("/matches")}
                >
                  Go to Matches
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
                      Already have an account?
                    </span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Sign in to your account{" "}
                  <Link
                    href="/auth/login"
                    className="text-indigo-600 hover:underline"
                  >
                    here
                  </Link>
                </p>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
