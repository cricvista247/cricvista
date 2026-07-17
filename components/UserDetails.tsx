/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Target,
  CreditCard,
  Star,
  Clock,
  CheckCircle,
  Gift,
  Zap,
  Activity,
  DollarSign,
  RefreshCw,
  XCircle,
  Smartphone,
  Building,
  QrCode,
  User as UserIcon,
  ArrowLeft,
  BarChart3,
  Mail,
  Phone,
  Settings,
  ChevronRight,
  Award,
  Coins,
  Calendar,
  IndianRupee,
  MoreVertical,
  Shield,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditUser from "./EditUser";
import { fetchUserDetails } from "@/app/admin/AdminService";
import toast from "react-hot-toast";
import CustomLoader from "./ui/CustomLoader";
import ResetPassword from "@/app/dashboard/ResetPassword";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import moment from "moment";

export const UserDetails = ({ userId }: { userId: any }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFullStats, setShowFullStats] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    GetUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editOpen]);

  const GetUserDetails = () => {
    setLoading(true);
    fetchUserDetails({ userId: userId })
      .then((res) => {
        setLoading(false);
        setUserData(res.data[0]);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to fetch users. Please try again.");
      });
  };

  // Helper functions
  const getOrderTypeIcon = (ordertype: string) => {
    switch (ordertype) {
      case "purchase":
        return <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />;
      case "prediction":
        return <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />;
      case "credit":
        return <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
      default:
        return <Star className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />;
    }
  };

  const getOrderTypeColor = (ordertype: string) => {
    switch (ordertype) {
      case "purchase":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "prediction":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "credit":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />;
      case "refunded":
        return <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />;
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "refunded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPaymentModeIcon = (paymentMode: string | null) => {
    if (!paymentMode)
      return <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;

    switch (paymentMode.toUpperCase()) {
      case "UPI":
        return <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />;
      case "NETBANKING":
        return <Building className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />;
      case "QRCODE":
        return <QrCode className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />;
      case "PROMOTION":
        return <Gift className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />;
      case "DEDUCTION":
        return <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />;
      default:
        return <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;
    }
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "banned":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "employee":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "user":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Calculate dashboard stats from real data
  const orderDetails =
    userData?.orderDetails?.sort(
      (a: any, b: any) =>
        moment(b.paymentDate).valueOf() - moment(a.paymentDate).valueOf()
    ) || [];
  const totalOrders = orderDetails.length;
  const completedOrders = orderDetails.filter(
    (o: any) => o.status === "completed"
  ).length;
  const totalSpent = orderDetails
    .filter((o: any) => o.status === "completed" && o.price)
    .reduce((sum: any, order: any) => sum + (order.price || 0), 0);

  const creditsEarned = orderDetails
    .filter((o: any) => o.status === "completed" && o.credits > 0)
    .reduce((sum: any, order: any) => sum + (order.credits || 0), 0);

  const purchaseOrders = orderDetails.filter(
    (o: any) => o.ordertype === "purchase"
  ).length;
  const predictionOrders = orderDetails.filter(
    (o: any) => o.ordertype === "prediction"
  ).length;
  const creditOrders = orderDetails.filter(
    (o: any) => o.ordertype === "credit"
  ).length;

  const dashboardStats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: `${completedOrders} completed`,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100",
    },
    {
      title: "Current Credits",
      value: (userData?.credits || 0).toLocaleString(),
      change: "Available balance",
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      change: `${purchaseOrders} purchases`,
      icon: IndianRupee,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-100",
    },
    {
      title: "Analyses Used",
      value: predictionOrders.toString(),
      change: `${creditsEarned} credits earned`,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-100",
    },
    {
      title: "Success Rate",
      value: `${
        totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
      }%`,
      change: "Order completion",
      icon: Award,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      iconBg: "bg-indigo-100",
    },
    {
      title: "Member Since",
      value: userData.createdAt
        ? moment(userData.createdAt).format("MMM YYYY")
        : "N/A",
      change: "Account age",
      icon: Calendar,
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
      iconBg: "bg-rose-100",
    },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD MMM YYYY, hh:mm A");
  };

  const formatShortDate = (dateString: string) => {
    return moment(dateString).format("DD MMM YY");
  };

  // Mobile breadcrumb navigation
  const MobileBreadcrumb = () => (
    <div className="flex items-center gap-2 mb-4 sm:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="p-1 h-8 w-8"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        User Profile
      </div>
      <ChevronRight className="h-3 w-3 text-gray-400" />
      <div className="text-sm font-medium truncate max-w-[120px]">
        {userData.name?.split(" ")[0] || "User"}
      </div>
    </div>
  );

  return (
    <>
      {loading && <CustomLoader message="Loading user details..." />}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Mobile Breadcrumb */}
          <MobileBreadcrumb />

          {/* Header - Desktop & Mobile */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            {/* Desktop Title */}
            <div className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mb-2 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                User Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage user account and view activity
              </p>
            </div>

            {/* Mobile Title */}
            <div className="sm:hidden">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Profile
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu */}
              <div className="sm:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                    <div className="space-y-4 pt-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={userData.avatar}
                            alt={userData.name}
                          />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {userData.name
                              ?.split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{userData.name}</h3>
                          <p className="text-sm text-gray-500">
                            {userData.email}
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          onClick={() => {
                            setEditOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <UserIcon className="h-4 w-4" />
                          Edit Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          onClick={() => {
                            setIsOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                          Change Password
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          asChild
                        >
                          <Link href="/subscription">
                            <Coins className="h-4 w-4" />
                            Buy Credits
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setEditOpen(true)}
                >
                  <UserIcon className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                  Password
                </Button>
              </div>
            </div>
          </div>

          {Object.keys(userData).length > 0 ? (
            <>
              {/* User Profile Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Main Profile Info */}
                <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                      <div className="relative">
                        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={userData.avatar}
                            alt={userData.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl">
                            {userData.name
                              ?.split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1">
                          <Badge
                            className={`${getUserStatusColor(userData.status)}`}
                          >
                            {userData.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="mb-3">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {userData.name}
                          </h2>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                            <Badge
                              className={`text-xs ${getRoleColor(
                                userData.role
                              )}`}
                            >
                              {userData.role}
                            </Badge>
                            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {userData.email}
                            </div>
                          </div>
                          <div className="text-sm flex items-center justify-center sm:justify-start gap-4">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{userData.mobileNumber}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Joined{" "}
                                {moment(userData.createdAt).format("MMM YYYY")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Credit Balance */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Credits Balance
                              </p>
                              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {userData.credits?.toLocaleString()}
                              </p>
                            </div>
                            <Button size="sm" className="gap-2" asChild>
                              <Link href="/subscription">
                                <Coins className="h-4 w-4" />
                                Buy More
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total Orders
                        </span>
                        <Badge variant="secondary">{totalOrders}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Completed
                        </span>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200"
                        >
                          {completedOrders}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total Spent
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₹{totalSpent}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Success Rate
                        </span>
                        <span
                          className={`font-medium ${
                            totalOrders > 0 ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {totalOrders > 0
                            ? Math.round((completedOrders / totalOrders) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Grid - Responsive */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Statistics
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="sm:hidden"
                    onClick={() => setShowFullStats(!showFullStats)}
                  >
                    {showFullStats ? "Show Less" : "Show All"}
                    {showFullStats ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div
                  className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 transition-all duration-300 ${
                    showFullStats
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-32 opacity-100 sm:max-h-none"
                  } overflow-hidden p-2`}
                >
                  {dashboardStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card
                        key={index}
                        className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 ${
                          index >= 4 && !showFullStats
                            ? "hidden sm:block"
                            : "block"
                        }`}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                {stat.title}
                              </p>
                              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                {stat.change}
                              </p>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                              <Icon
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Tabs Section - Responsive */}
              <div className="mb-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  {/* Tab List - Responsive */}
                  <div className="relative mb-4">
                    <TabsList className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 p-1 overflow-x-auto flex sm:inline-flex">
                      <TabsTrigger
                        value="overview"
                        className="flex-1 sm:flex-none min-w-[80px] sm:min-w-0"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Overview</span>
                        <span className="sm:hidden">Overview</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="activity"
                        className="flex-1 sm:flex-none min-w-[80px] sm:min-w-0"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Activity</span>
                        <span className="sm:hidden">Activity</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="credits"
                        className="flex-1 sm:flex-none min-w-[80px] sm:min-w-0"
                      >
                        <Coins className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Credits</span>
                        <span className="sm:hidden">Credits</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="profile"
                        className="flex-1 sm:flex-none min-w-[80px] sm:min-w-0"
                      >
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Profile</span>
                        <span className="sm:hidden">Profile</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Tab Content */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Overview Tab */}
                    <TabsContent
                      value="overview"
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Order Summary */}
                        <Card className="lg:col-span-2 border-0 shadow-lg">
                          <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl">
                              Order Summary
                            </CardTitle>
                            <CardDescription>
                              Distribution of order types
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-3">
                              {[
                                {
                                  type: "purchase",
                                  label: "Credit Purchases",
                                  count: purchaseOrders,
                                  icon: Coins,
                                  color: "purple",
                                },
                                {
                                  type: "prediction",
                                  label: "Analyses",
                                  count: predictionOrders,
                                  icon: Target,
                                  color: "blue",
                                },
                                {
                                  type: "credit",
                                  label: "Free Credits",
                                  count: creditOrders,
                                  icon: Gift,
                                  color: "green",
                                },
                              ].map((item) => (
                                <div
                                  key={item.type}
                                  className={`p-3 sm:p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-lg`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-800 rounded-lg`}
                                      >
                                        <item.icon
                                          className={`h-4 w-4 sm:h-5 sm:w-5 text-${item.color}-600`}
                                        />
                                      </div>
                                      <div>
                                        <p className="font-medium">
                                          {item.label}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {item.count} orders
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                      {item.count}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl">
                              Achievement
                            </CardTitle>
                            <CardDescription>
                              Performance summary
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Success Rate</span>
                                  <span className="font-bold text-green-600">
                                    {totalOrders > 0
                                      ? Math.round(
                                          (completedOrders / totalOrders) * 100
                                        )
                                      : 0}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    totalOrders > 0
                                      ? (completedOrders / totalOrders) * 100
                                      : 0
                                  }
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">
                                    Order Completion
                                  </span>
                                  <span className="font-bold text-blue-600">
                                    {completedOrders}/{totalOrders}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    totalOrders > 0
                                      ? (completedOrders / totalOrders) * 100
                                      : 0
                                  }
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recent Activity Preview */}
                      <Card className="border-0 shadow-lg">
                        <CardHeader className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <CardTitle className="text-lg sm:text-xl">
                                Recent Activity
                              </CardTitle>
                              <CardDescription>
                                Your latest transactions
                              </CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("activity")}
                              className="w-full sm:w-auto"
                            >
                              View All
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          {orderDetails.slice(0, 3).map((order: any) => (
                            <div
                              key={order._id}
                              className="p-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                  {getOrderTypeIcon(order.ordertype)}
                                  <div>
                                    <p className="font-medium">
                                      {order.ordertype === "purchase"
                                        ? "Credit Purchase"
                                        : order.ordertype === "prediction"
                                        ? "Match Analysis"
                                        : "Free Credit"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      #{order.orderNumber} •{" "}
                                      {moment(order.paymentDate).format(
                                        "Do MMM,YYYY HH:mm"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={getStatusColor(order.status)}
                                  >
                                    {order.status}
                                  </Badge>
                                  <span className="font-bold">
                                    {order.price
                                      ? `₹${order.price}`
                                      : `${order.credits} credits`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent
                      value="activity"
                      className="space-y-4 sm:space-y-6"
                    >
                      <Card className="border-0 shadow-lg">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="text-lg sm:text-xl">
                            All Activity
                          </CardTitle>
                          <CardDescription>
                            Complete order history
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          {orderDetails.map((order: any) => (
                            <div
                              key={order._id}
                              className="p-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                  {getOrderTypeIcon(order.ordertype)}
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <p className="font-medium">
                                        {order.ordertype === "purchase"
                                          ? "Credit Purchase"
                                          : order.ordertype === "prediction"
                                          ? "Match Analysis"
                                          : "Free Credit"}
                                      </p>
                                      <Badge
                                        className={getOrderTypeColor(
                                          order.ordertype
                                        )}
                                      >
                                        {order.ordertype}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      #{order.orderNumber} •{" "}
                                      {order.paymentMode || "N/A"} •{" "}
                                      {formatDate(order.paymentDate)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={getStatusColor(order.status)}
                                  >
                                    {order.status}
                                  </Badge>
                                  <span className="font-bold">
                                    {order.price
                                      ? `₹${order.price}`
                                      : `${order.credits} credits`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Credits Tab */}
                    <TabsContent
                      value="credits"
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        <Card className="lg:col-span-2 border-0 shadow-lg">
                          <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl">
                              Credit History
                            </CardTitle>
                            <CardDescription>
                              Your credit transactions
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Current Balance
                                  </p>
                                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    {userData.credits?.toLocaleString()} credits
                                  </p>
                                </div>
                                <Button asChild className="gap-2">
                                  <Link href="/subscription">
                                    <Zap className="h-4 w-4" />
                                    Buy Credits
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            {/* Recent Credit Transactions */}
                            <div className="space-y-3">
                              {orderDetails
                                .filter((o: any) => o.credits && o.credits > 0)
                                .slice(0, 5)
                                .map((order: any) => (
                                  <div
                                    key={order._id}
                                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        {getOrderTypeIcon(order.ordertype)}
                                        <div>
                                          <p className="font-medium">
                                            {order.ordertype === "purchase"
                                              ? "Credit Purchase"
                                              : order.ordertype === "prediction"
                                              ? "Analysis Used"
                                              : "Free Credit"}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {moment(order.paymentDate).format(
                                              "Do MMM,YYYY HH:mm"
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p
                                          className={`font-bold ${
                                            order.ordertype === "prediction"
                                              ? "text-red-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          {order.ordertype === "prediction"
                                            ? "-"
                                            : "+"}
                                          {order.credits} credits
                                        </p>
                                        <Badge
                                          className={getStatusColor(
                                            order.status
                                          )}
                                        >
                                          {order.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                          <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl">
                              Purchase History
                            </CardTitle>
                            <CardDescription>Credit purchases</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-3">
                              {orderDetails
                                .filter((o: any) => o.ordertype === "purchase")
                                .slice(0, 5)
                                .map((order: any) => (
                                  <div
                                    key={order._id}
                                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                  >
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <p className="font-medium">
                                          {order.credits} Credits
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {moment(order.paymentDate).format(
                                            "Do MMM,YYYY HH:mm"
                                          )}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold">
                                          ₹{order.price}
                                        </p>
                                        <Badge
                                          className={getStatusColor(
                                            order.status
                                          )}
                                        >
                                          {order.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent
                      value="profile"
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        <Card className="lg:col-span-2 border-0 shadow-lg">
                          <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-lg sm:text-xl">
                              Personal Information
                            </CardTitle>
                            <CardDescription>
                              Account details and preferences
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                              {[
                                {
                                  label: "Full Name",
                                  value: userData.name,
                                  icon: UserIcon,
                                },
                                {
                                  label: "Username",
                                  value: userData.username,
                                  icon: UserCheck,
                                },
                                {
                                  label: "Email Address",
                                  value: userData.email,
                                  icon: Mail,
                                },
                                {
                                  label: "Phone Number",
                                  value: userData.mobileNumber,
                                  icon: Phone,
                                },
                                {
                                  label: "Account Status",
                                  value: userData.status,
                                  badge: true,
                                  color: getUserStatusColor(userData.status),
                                },
                                {
                                  label: "User Role",
                                  value: userData.role,
                                  badge: true,
                                  color: getRoleColor(userData.role),
                                },
                                {
                                  label: "Member Since",
                                  value: formatDate(userData.createdAt),
                                  icon: Calendar,
                                },
                                {
                                  label: "Last Updated",
                                  value: formatDate(userData.updatedAt),
                                  icon: Clock,
                                },
                              ].map((item, index) => (
                                <div key={index} className="space-y-1">
                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.label}
                                  </label>
                                  {item.badge ? (
                                    <Badge className={item.color}>
                                      {item.value}
                                    </Badge>
                                  ) : (
                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                      {item.icon && (
                                        <item.icon className="h-4 w-4 text-gray-500" />
                                      )}
                                      {item.value}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <div className="space-y-4 sm:space-y-6">
                          <Card className="border-0 shadow-lg">
                            <CardHeader className="p-4 sm:p-6">
                              <CardTitle className="text-lg sm:text-xl">
                                Quick Actions
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                              <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                onClick={() => setEditOpen(true)}
                              >
                                <UserIcon className="h-4 w-4" />
                                Edit Profile
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                onClick={() => setIsOpen(true)}
                              >
                                <Settings className="h-4 w-4" />
                                Change Password
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                asChild
                              >
                                <Link href="/subscription">
                                  <Coins className="h-4 w-4" />
                                  Buy Credits
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Account Status */}
                          <Card className="border-0 shadow-lg">
                            <CardContent className="p-4 sm:p-6">
                              <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                                  <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <h4 className="font-semibold mb-1">
                                  Account Status
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  Your account is {userData.status}
                                </p>
                                <Badge
                                  className={getUserStatusColor(
                                    userData.status
                                  )}
                                >
                                  {userData.status.charAt(0).toUpperCase() +
                                    userData.status.slice(1)}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No User Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                User information could not be loaded
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isOpen && (
        <ResetPassword
          modalOpen={isOpen}
          onClose={() => setIsOpen(false)}
          username={userData.username}
        />
      )}
      {editOpen && (
        <EditUser
          data={{
            username: userData.username || "",
            name: userData.name || "",
            email: userData.email || "",
            mobileNumber: userData.mobileNumber || "",
            isActive: userData.isActive,
            status: userData.status || "",
            remarks: userData.remarks || "",
            role: userData.role || "",
            _id: userData._id || "",
          }}
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
};
