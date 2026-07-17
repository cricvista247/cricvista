/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
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
import { Mail, Lock, ChevronRight } from "lucide-react";
import { loginSuccess } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { FormikTextInput, FormikTextPassword } from "@/components/CustomField";
import { UserLogin } from "@/app/MainService";
import CustomLoader from "@/components/ui/CustomLoader";
import Image from "next/image";
import SportLogo from "@/components/assests/new sport logo.png";
import { connectUserSocket } from "@/lib/socketClient";

// Validation Schema
const loginValidationSchema = Yup.object({
  userId: Yup.string().required("User Id is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const initialValues = {
    userId: "",
    password: "",
  };

  const handleEmailLogin = (e: any) => {
    setIsLoading(true);
    UserLogin({ ...e })
      .then((res) => {
        const userData = {
          id: res.data.user._id,
          username: res.data.user.username,
          email: res.data.user.email,
          mobile: res.data.user.mobileNumber,
          credits: res.data.user.credits,
          role: res.data.user.role,
          isActive: res.data.user.isActive,
          token: res.data.token,
          subscription: res.data.user.subscription ?? [],
        };
        localStorage.setItem("token", res.data.token);
        dispatch(loginSuccess(userData));
        connectUserSocket(userData.id);
        setIsLoading(false);
        toast.success("Login successful!");

        const storedPath = localStorage.getItem("currentPath");

        if (
          storedPath === "/auth/register" ||
          storedPath === "/auth/forgot-password"
        ) {
          localStorage.setItem("currentPath", "");
          router.push("/matches");
        } else {
          localStorage.setItem("currentPath", "");
          // router.back();
          router.push("/matches");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message || "Login failed. Please try again.");
      });
  };

  return (
    <>
      {/* {isLoading && <CustomLoader message="Logging in..." />} */}
      <div
        className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-violet-100 via-indigo-100 to-slate-100 p-4"
      >
        <div className="w-full max-w-md">
          {/* Logo Section */}
          {/* <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
              <div className="bg-white  rounded-3xl shadow-xl">
                <div className="relative w-14 h-14">
                  <Image
                    src={SportLogo}
                    alt="CricVista Logo"
                    className="object-contain"
                    fill
                    priority
                  />
                </div>
              </div>

              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  CricVista
                </h1>
                <p className="text-gray-600 mt-1">
                  Cricket Analytics Platform
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">
              Sign in to your account to continue
            </p>
          </div> */}

          {/* Card */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-gray-900">
                Login to Your Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Formik
                initialValues={initialValues}
                validationSchema={loginValidationSchema}
                onSubmit={handleEmailLogin}
              >
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                      {/* Username */}
                      <Field
                        label="Username/Email/Mobile"
                        component={FormikTextInput}
                        name="userId"
                        icon={
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        }
                      />

                      {/* Password */}
                      <Field
                        label="Password"
                        component={FormikTextPassword}
                        name="password"
                        icon={
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        }
                      />

                      <div className="flex justify-end items-center">
                        <Link
                          href="/auth/forgot-password"
                          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          Forgot Password?
                          <ChevronRight className="inline h-3 w-3 ml-1" />
                        </Link>
                      </div>

                      {/* Login Button */}
                      <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>

              {/* Sign Up Button */}
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-50"
              >
                Create New Account
              </Link>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-0">
              <p className="text-sm text-gray-600 text-center">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-indigo-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-indigo-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>

              <p className="text-sm text-gray-600 text-center">
                Need help? Contact us at{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                  className="text-indigo-600 hover:underline"
                >
                  {process.env.NEXT_PUBLIC_EMAIL}
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
