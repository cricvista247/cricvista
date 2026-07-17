/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Clock, Lock, LockKeyhole, Shield, Eye, EyeOff } from "lucide-react";
import { FormikTextPassword } from "@/components/CustomField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { UserResetPassword } from "../MainService";
import toast from "react-hot-toast";

const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Password is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const ResetPassword = ({
  modalOpen,
  onClose,
  username,
}: {
  modalOpen: boolean;
  onClose: any;
  username: string;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = (values: any) => {
    setLoading(true);
    UserResetPassword({
      userId: username,
      type: "reset-password",
      password: values.password,
      oldPassword: values.oldPassword,
    })
      .then((res) => {
        toast.success(res.message);
        setLoading(false);
        dispatch(logout());
        router.push("/matches");
      })
      .catch((err) => {
        toast.error(err.message || "Failed update details. Please try again.");
        setLoading(false);
      });
  };

  return (
    <Dialog open={modalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] w-full mx-auto p-0 rounded-2xl overflow-hidden bg-white">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-6 sm:py-8 text-white">
          <DialogHeader className="text-center space-y-3 sm:space-y-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-sm sm:text-base">
              Secure your account with a new password
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Section */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 bg-white">
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
              oldPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ handleSubmit, errors, touched }) => (
              <Form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Password Fields Grid */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Field
                      label="Old Password"
                      component={FormikTextPassword}
                      name="oldPassword"
                      placeholder="Enter your current password"
                      className="pl-10 sm:pl-11 pr-10 sm:pr-12 py-3 sm:py-3.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
                      icon={
                        <Lock className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      }
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Field
                      label="New Password"
                      component={FormikTextPassword}
                      name="password"
                      placeholder="Enter your new password"
                      className="pl-10 sm:pl-11 pr-10 sm:pr-12 py-3 sm:py-3.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
                      icon={
                        <LockKeyhole className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      }
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Field
                      label="Confirm New Password"
                      component={FormikTextPassword}
                      name="confirmPassword"
                      placeholder="Confirm your new password"
                      className="pl-10 sm:pl-11 pr-10 sm:pr-12 py-3 sm:py-3.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 text-sm sm:text-base"
                      icon={
                        <LockKeyhole className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      }
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 sm:pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-3.5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span className="font-medium">
                          Resetting Password...
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <LockKeyhole className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium">Reset Password</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Security Note */}
                <div className="text-center pt-2 sm:pt-4">
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200 leading-relaxed">
                    🔒 After resetting your password, you'll be logged out for
                    security reasons and need to sign in again.
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
