// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Trophy,
//   Mail,
//   Phone,
//   Lock,
//   User,
//   Sparkles,
//   Check,
//   Key,
//   ArrowLeft,
//   RefreshCw,
//   ShieldCheck,
//   Clock,
//   Loader2,
// } from "lucide-react";
// import { loginSuccess } from "@/store/slices/authSlice";
// import toast from "react-hot-toast";
// import { Field, Form, Formik } from "formik";
// import * as Yup from "yup";
// import {
//   FormikCheckBox,
//   FormikTextInput,
//   FormikTextPassword,
// } from "@/components/CustomField";
// import {
//   UserRegister,
//   SendVerificationCode,
//   VerifyEmailCode,
// } from "@/app/MainService";
// import CustomLoader from "@/components/ui/CustomLoader";

// // Validation schemas
// const emailValidationSchema = Yup.object({
//   email: Yup.string()
//     .trim()
//     .required("Email is required")
//     .email("Invalid email address"),
// });

// const verificationSchema = Yup.object({
//   verificationCode: Yup.string()
//     .required("Verification code is required")
//     .matches(/^[0-9]{6}$/, "Code must be 6 digits"),
// });

// const registrationSchema = Yup.object({
//   username: Yup.string()
//     .trim()
//     .required("Username is required")
//     .min(3, "Username must be at least 3 characters")
//     .max(20, "Username cannot exceed 20 characters"),

//   name: Yup.string()
//     .trim()
//     .required("Name is required")
//     .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

//   mobileNumber: Yup.string()
//     .trim()
//     .required("Mobile number is required")
//     .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters"),

//   confirmPassword: Yup.string()
//     .required("Confirm password is required")
//     .oneOf([Yup.ref("password")], "Passwords must match"),

//   agreeToTerms: Yup.boolean().oneOf(
//     [true],
//     "You must accept the terms and conditions"
//   ),
// });

// const RegisterPage = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [step, setStep] = useState(1); // 1: Email, 2: Verification, 3: Registration
//   const [email, setEmail] = useState("");
//   const [verificationSent, setVerificationSent] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [resendEnabled, setResendEnabled] = useState(false);

//   const dispatch = useDispatch();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     sessionStorage.setItem("currentPath", pathname);
//   }, [pathname]);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     } else if (countdown === 0 && verificationSent) {
//       setResendEnabled(true);
//     }
//     return () => clearTimeout(timer);
//   }, [countdown, verificationSent]);

//   const handleSendVerification = async (email: string) => {
//     setIsLoading(true);
//     try {
//       await SendVerificationCode({ email });
//       setEmail(email);
//       setVerificationSent(true);
//       setCountdown(60); // 60 seconds countdown
//       setResendEnabled(false);
//       setStep(2);
//       toast.success("Verification code sent to your email!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to send verification code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyCode = async (code: string) => {
//     setIsLoading(true);
//     try {
//       await VerifyEmailCode({ email, code });
//       toast.success("Email verified successfully!");
//       setStep(3);
//     } catch (error: any) {
//       toast.error(error.message || "Invalid verification code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendCode = async () => {
//     setIsLoading(true);
//     try {
//       await SendVerificationCode({ email });
//       setCountdown(60);
//       setResendEnabled(false);
//       toast.success("New verification code sent!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to resend code");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRegister = async (values: any) => {
//     setIsLoading(true);
//     try {
//       const formData = {
//         username: values.username.trim(),
//         name: values.name.trim(),
//         email: email.trim().toLowerCase(),
//         mobileNumber: values.mobileNumber.trim(),
//         password: values.password,
//         agreeToTerms: values.agreeToTerms,
//       };

//       const res = await UserRegister(formData);
//       const userData = {
//         id: res.data.user._id,
//         username: res.data.user.username,
//         email: res.data.user.email,
//         mobile: res.data.user.mobileNumber,
//         credits: res.data.user.role === "admin" ? 999 : res.data.user.credits,
//         role: res.data.user.role,
//         isActive: res.data.user.isActive,
//         token: res.data.token,
//         subscription: res.data.user.subscription ?? [],
//       };
//       sessionStorage.setItem("token", res.data.token);
//       dispatch(loginSuccess(userData));
//       toast.success("Account created successfully!");
//       router.push("/matches");
//     } catch (error: any) {
//       toast.error(error.message || "Registration failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderProgressSteps = () => (
//     <div className="flex items-center justify-center mb-8">
//       <div className="flex items-center space-x-2 sm:space-x-4">
//         {[1, 2, 3].map((stepNumber) => (
//           <div key={stepNumber} className="flex items-center">
//             <div
//               className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
//                 step >= stepNumber
//                   ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                   : "bg-gray-200 dark:bg-gray-700 text-gray-500"
//               }`}
//             >
//               {step > stepNumber ? (
//                 <Check className="h-4 w-4 sm:h-5 sm:w-5" />
//               ) : (
//                 stepNumber
//               )}
//             </div>
//             {stepNumber < 3 && (
//               <div
//                 className={`w-4 sm:w-8 h-1 transition-all duration-300 ${
//                   step > stepNumber
//                     ? "bg-gradient-to-r from-blue-600 to-purple-600"
//                     : "bg-gray-200 dark:bg-gray-700"
//                 }`}
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderStepContent = () => {
//     switch (step) {
//       case 1: // Email step
//         return (
//           <Formik
//             initialValues={{ email: "" }}
//             validationSchema={emailValidationSchema}
//             onSubmit={(values) => handleSendVerification(values.email)}
//           >
//             {({ handleSubmit }) => (
//               <Form onSubmit={handleSubmit}>
//                 <div className="space-y-6">
//                   <div>
//                     <div className="mb-2 text-center">
//                       <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-3">
//                         <Mail className="h-8 w-8 text-blue-600" />
//                       </div>
//                       <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                         Start with your email
//                       </h2>
//                       <p className="text-gray-600 dark:text-gray-400 mt-1">
//                         We'll send a verification code to confirm your email
//                       </p>
//                     </div>

//                     <Field
//                       label="Email Address"
//                       component={FormikTextInput}
//                       name="email"
//                       type="email"
//                       placeholder="Enter your email address"
//                       icon={
//                         <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       }
//                     />
//                   </div>

//                   <Button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
//                   >
//                     {isLoading ? (
//                       <div className="flex items-center justify-center">
//                         <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                         Sending Code...
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-center">
//                         Send Verification Code
//                         <Key className="ml-2 h-5 w-5" />
//                       </div>
//                     )}
//                   </Button>

//                   <div className="text-center">
//                     <p className="text-gray-600 dark:text-gray-400">
//                       Already have an account?{" "}
//                       <Link
//                         href="/auth/login"
//                         className="text-blue-600 hover:underline font-medium"
//                       >
//                         Sign in here
//                       </Link>
//                     </p>
//                   </div>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         );

//       case 2: // Verification step
//         return (
//           <Formik
//             initialValues={{ verificationCode: "" }}
//             validationSchema={verificationSchema}
//             onSubmit={(values) => handleVerifyCode(values.verificationCode)}
//           >
//             {({ handleSubmit, values }) => (
//               <Form onSubmit={handleSubmit}>
//                 <div className="space-y-6">
//                   <div className="text-center">
//                     <button
//                       type="button"
//                       onClick={() => setStep(1)}
//                       className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//                     >
//                       <ArrowLeft className="h-4 w-4 mr-1" />
//                       Change email
//                     </button>

//                     <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-50 dark:bg-green-900/20 mb-3">
//                       <ShieldCheck className="h-8 w-8 text-green-600" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                       Check your email
//                     </h2>
//                     <p className="text-gray-600 dark:text-gray-400 mt-1">
//                       Enter the 6-digit code sent to
//                     </p>
//                     <p className="font-medium text-blue-600 dark:text-blue-400 break-all">
//                       {email}
//                     </p>
//                   </div>

//                   <div>
//                     <Field
//                       label="Verification Code"
//                       component={FormikTextInput}
//                       name="verificationCode"
//                       placeholder="Enter 6-digit code"
//                       maxLength={6}
//                       icon={
//                         <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       }
//                     />
//                     <div className="flex items-center justify-between mt-2">
//                       <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//                         <Clock className="h-4 w-4 mr-1" />
//                         {countdown > 0
//                           ? `Resend in ${countdown}s`
//                           : "Code expired"}
//                       </div>
//                       <button
//                         type="button"
//                         onClick={handleResendCode}
//                         disabled={!resendEnabled || isLoading}
//                         className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
//                       >
//                         <div className="flex items-center">
//                           <RefreshCw className="h-4 w-4 mr-1" />
//                           Resend Code
//                         </div>
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => setStep(1)}
//                       disabled={isLoading}
//                       className="py-3"
//                     >
//                       Back
//                     </Button>
//                     <Button
//                       type="submit"
//                       disabled={
//                         isLoading || values.verificationCode.length !== 6
//                       }
//                       className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
//                     >
//                       {isLoading ? (
//                         <div className="flex items-center justify-center">
//                           <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                           Verifying...
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center">
//                           Verify & Continue
//                           <Check className="ml-2 h-5 w-5" />
//                         </div>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         );

//       case 3: // Registration step
//         return (
//           <Formik
//             initialValues={{
//               username: "",
//               name: "",
//               mobileNumber: "",
//               password: "",
//               confirmPassword: "",
//               agreeToTerms: false,
//             }}
//             validationSchema={registrationSchema}
//             onSubmit={handleRegister}
//           >
//             {({ handleSubmit, isSubmitting }) => (
//               <Form onSubmit={handleSubmit}>
//                 <div className="space-y-6">
//                   <div className="text-center">
//                     <button
//                       type="button"
//                       onClick={() => setStep(2)}
//                       className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//                     >
//                       <ArrowLeft className="h-4 w-4 mr-1" />
//                       Back to verification
//                     </button>

//                     <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 mb-3">
//                       <User className="h-8 w-8 text-purple-600" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                       Complete Your Profile
//                     </h2>
//                     <p className="text-gray-600 dark:text-gray-400 mt-1">
//                       Verified email:{" "}
//                       <span className="font-medium text-green-600">
//                         {email}
//                       </span>
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4">
//                     <Field
//                       label="Username"
//                       component={FormikTextInput}
//                       name="username"
//                       placeholder="Choose a unique username"
//                       icon={
//                         <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       }
//                     />

//                     <Field
//                       label="Full Name"
//                       component={FormikTextInput}
//                       name="name"
//                       placeholder="Enter your full name"
//                       icon={
//                         <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       }
//                     />

//                     <Field
//                       label="Mobile Number"
//                       component={FormikTextInput}
//                       name="mobileNumber"
//                       placeholder="10-digit mobile number"
//                       maxLength={10}
//                       icon={
//                         <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       }
//                     />

//                     <Field
//                       label="Password"
//                       component={FormikTextPassword}
//                       name="password"
//                       placeholder="Create a strong password"
//                       icon={
//                         <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       }
//                     />

//                     <Field
//                       label="Confirm Password"
//                       component={FormikTextPassword}
//                       name="confirmPassword"
//                       placeholder="Confirm your password"
//                       icon={
//                         <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                       }
//                     />

//                     <div className="mt-2">
//                       <Field
//                         label={
//                           <span className="text-sm">
//                             I agree to the{" "}
//                             <Link
//                               href="/terms"
//                               className="text-blue-600 hover:underline font-medium"
//                               target="_blank"
//                             >
//                               Terms of Service
//                             </Link>{" "}
//                             and{" "}
//                             <Link
//                               href="/privacy"
//                               className="text-blue-600 hover:underline font-medium"
//                               target="_blank"
//                             >
//                               Privacy Policy
//                             </Link>
//                           </span>
//                         }
//                         component={FormikCheckBox}
//                         name="agreeToTerms"
//                       />
//                     </div>
//                   </div>

//                   <Button
//                     type="submit"
//                     disabled={isLoading || isSubmitting}
//                     className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
//                   >
//                     {isLoading || isSubmitting ? (
//                       <div className="flex items-center justify-center">
//                         <Loader2 className="h-5 w-5 animate-spin mr-2" />
//                         Creating Account...
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-center">
//                         <Sparkles className="h-5 w-5 mr-2" />
//                         Complete Registration
//                       </div>
//                     )}
//                   </Button>

//                   <div className="text-center pt-4 border-t">
//                     <p className="text-gray-600 dark:text-gray-400 text-sm">
//                       By registering, you confirm that your email{" "}
//                       <span className="font-medium">{email}</span> is verified
//                       and you agree to our terms.
//                     </p>
//                   </div>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       {isLoading && <CustomLoader message="Processing..." />}
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
//           <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-indigo-200 dark:bg-indigo-900/20 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>
//         </div>

//         <div className="w-full max-w-md z-10">
//           {/* Logo */}
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center space-x-2 mb-4">
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
//                 <Trophy className="h-8 w-8 text-white" />
//               </div>
//               <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 CricVista
//               </span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//               {step === 1 && "Join Our Prediction Community"}
//               {step === 2 && "Verify Your Email"}
//               {step === 3 && "Complete Your Profile"}
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               {step === 1 && "Start your winning journey with us"}
//               {step === 2 && "Enter the code we sent to your email"}
//               {step === 3 && "Fill in your details to get started"}
//             </p>
//           </div>

//           {/* Progress Steps */}
//           {step > 1 && renderProgressSteps()}

//           <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
//             <CardHeader className="pb-4">
//               <CardTitle className="text-center text-xl">
//                 {step === 1 && "Email Verification"}
//                 {step === 2 && "Enter Verification Code"}
//                 {step === 3 && "Create Your Account"}
//               </CardTitle>
//               <CardDescription className="text-center">
//                 {step === 1 && "Step 1 of 3: Verify your email"}
//                 {step === 2 && "Step 2 of 3: Enter 6-digit code"}
//                 {step === 3 && "Step 3 of 3: Complete registration"}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>{renderStepContent()}</CardContent>
//           </Card>

//           {/* Bottom Links */}
//           <div className="text-center mt-6">
//             <p className="text-gray-600 dark:text-gray-400 text-sm">
//               {step === 1 ? (
//                 <>
//                   Already have an account?{" "}
//                   <Link
//                     href="/auth/login"
//                     className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
//                   >
//                     Sign in here
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   Having trouble?{" "}
//                   <button
//                     onClick={() => setStep(1)}
//                     className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
//                   >
//                     Start over
//                   </button>
//                 </>
//               )}
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RegisterPage;
