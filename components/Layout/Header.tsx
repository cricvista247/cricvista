"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { loginSuccess, logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Trophy,
  CreditCard,
  LogOut,
  Home,
  Calendar,
  LayoutDashboard,
  SwitchCamera,
  HandCoins,
  Sparkles,
  ChevronDown,
  Shield,
  Info,
  HelpCircle,
  Download,
  Smartphone,
  ExternalLink,
  RefreshCcw,
  Bell,
  MessageSquare,
  Gift,
  CheckCircle2,
  Clock,
  Zap,
  Trash2,
} from "lucide-react";
import MarqueeNotice from "../ui/marquee-notice";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { DailyCreditAd } from "../GetDailyCredit";
import {
  CornMatchList,
  CornMatchStatus,
  UserOrderCredit,
  NotificationList,
  NotificationRead,
  NotificationDelete,
} from "@/app/MainService";
import {
  setNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} from "@/store/slices/notificationSlice";
import toast from "react-hot-toast";
import { set } from "mongoose";
import CustomLoader from "../ui/CustomLoader";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [dailyCredit, setDailyCredit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dailyCreditRes, setDailyCreditRes] = useState<any>({
    message: "",
    isSuccess: null,
  });
  const [notifOpen, setNotifOpen] = useState(false);

  const { items: notifItems, unreadCount } = useSelector(
    (state: RootState) => state.notification,
  );

  const isAuthPage = pathname.startsWith("/auth/");

  const fetchNotifications = () => {
    if (isAuthPage || !localStorage.getItem("token")) return;
    NotificationList()
      .then((res) => {
        dispatch(
          setNotifications({
            data: res.data || [],
            unreadCount: res.unreadCount || 0,
          }),
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!isAuthenticated || isAuthPage) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch, isAuthPage]);

  // useEffect(() => {
  //   matchStatusUpdate();
  // }, []);

  const matchStatusUpdate = () => {
    CornMatchStatus()
      .then((res) => {
        console.log(res.message);
      })
      .catch((error) => {
        console.log(
          error.message || "Failed to update status. Please try again.",
        );
      });
  };
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/matches", label: "Matches", icon: Calendar },
    { href: "/subscription", label: "Premium", icon: CreditCard },
    { href: "/about", label: "About", icon: Info },
    { href: "/blog", label: "Blog", icon: MessageSquare },
    { href: "/support", label: "Support", icon: HelpCircle },
  ];

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      description: "Your personal dashboard",
    },
    {
      label: "Token",
      href: "/subscription",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
      description: "Manage your token",
    },
  ];

  const handleCreditAdd = () => {
    let payload = {
      ordertype: "credit",
      userId: user!.id,
      credits: 1,
      status: "completed",
      paymentMode: "PROMOTION",
      paymentDate: new Date(),
    };

    UserOrderCredit(payload)
      .then((res) => {
        const prepareUser: any = user
          ? { ...user, credits: user.credits + 1 }
          : null;

        setDailyCreditRes({ message: res.message, isSuccess: true });
        dispatch(loginSuccess({ ...prepareUser }));
      })
      .catch((error) => {
        setDailyCreditRes({ message: error.message, isSuccess: false });
      });
  };

  const handelMatchListCorn = () => {
    setLoading(true);
    CornMatchList()
      .then((res) => {
        setLoading(false);
        toast.success(res.message);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(
          error.message || "Failed to update status. Please try again.",
        );
      });
  };

  return (
    <>
      {loading && <CustomLoader message="Loading to insert matchlist" />}
      {showNotice && !pathname.startsWith("/admin") && (
        <MarqueeNotice onClose={() => setShowNotice(false)} />
      )}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/90 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 md:space-x-3 group flex-shrink-0"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 sm:p-2 rounded-lg md:rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CricVista
                </span>
                <span className="text-[9px] xs:text-xs sm:text-xs md:text-sm text-gray-500 leading-tight">
                  AI Cricket Intelligence & Analytics
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Desktop App Download Dropdown */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="ml-1 xl:ml-2 px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <Download className="h-3 w-3 xl:h-4 xl:w-4 mr-1.5 xl:mr-2" />
                    <span className="hidden xl:inline">Download App</span>
                    <span className="xl:hidden">App</span>
                    <ChevronDown className="ml-1.5 xl:ml-2 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 xl:w-64" align="end">
                  <DropdownMenuLabel className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm xl:text-base">
                      Download Mobile App
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleAppDownload("android")}
                    className="cursor-pointer py-2.5 xl:py-3 hover:bg-green-50"
                  >
                    <div className="flex items-center w-full">
                      <div className="bg-green-100 p-1.5 xl:p-2 rounded-lg mr-2 xl:mr-3">
                        <svg
                          className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-green-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-1.995 3.458c-1.443-1.031-3.1993-1.63-5.1256-1.63-1.9276 0-3.6845.6-5.1278 1.631l-1.996-3.458a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592c-2.572 1.756-4.3058 4.755-4.3058 8.152 0 .552.4477 1 1 1h16.9998c.5523 0 1-.448 1-1 0-3.397-1.7338-6.396-4.3058-8.152" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm xl:text-base">
                          Android App
                        </div>
                        <div className="text-xs text-gray-500">
                          Download for Android devices
                        </div>
                      </div>
                      <ExternalLink className="h-3 w-3 xl:h-3.5 xl:w-3.5 text-gray-400" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {isAuthenticated && user ? (
                <>
                  {/* User Credits Badge - Mobile */}
                  <div className="lg:hidden">
                    <Badge
                      variant="secondary"
                      className="font-semibold text-xs sm:text-sm px-2 py-1"
                    >
                      <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      {user.credits}
                    </Badge>
                  </div>

                  {/* Notifications */}
                  <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-gray-50"
                      >
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center px-1">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-80 sm:w-96 p-0 rounded-xl shadow-xl border max-h-[70vh] overflow-hidden"
                    >
                      <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-gray-900 text-sm">
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 text-xs"
                            >
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                        {notifItems.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              NotificationDelete();
                              dispatch(clearAllNotifications());
                            }}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto max-h-[50vh]">
                        {notifItems.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="h-8 w-8 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500 font-medium">
                              No notifications yet
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Notifications will appear here
                            </p>
                          </div>
                        ) : (
                          notifItems.map((n: any) => (
                            <div
                              key={n._id}
                              className={`group relative w-full px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${
                                !n.isRead ? "bg-blue-50/50" : ""
                              }`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNotifOpen(false);
                                  if (!n.isRead) {
                                    NotificationRead({ notificationId: n._id });
                                    dispatch(markAsRead(n._id));
                                  }
                                  if (n.link) router.push(n.link);
                                }}
                                className="flex items-start space-x-3 flex-1 min-w-0 text-left"
                              >
                                <div
                                  className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    n.type === "support"
                                      ? "bg-green-100"
                                      : n.type === "payment"
                                        ? "bg-blue-100"
                                        : n.type === "credit"
                                          ? "bg-amber-100"
                                          : "bg-gray-100"
                                  }`}
                                >
                                  {n.type === "support" ? (
                                    <MessageSquare className="h-4 w-4 text-green-600" />
                                  ) : n.type === "payment" ? (
                                    <CreditCard className="h-4 w-4 text-blue-600" />
                                  ) : n.type === "credit" ? (
                                    <Gift className="h-4 w-4 text-amber-600" />
                                  ) : (
                                    <Zap className="h-4 w-4 text-gray-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p
                                      className={`text-sm ${
                                        !n.isRead
                                          ? "font-semibold text-gray-900"
                                          : "font-medium text-gray-700"
                                      } truncate`}
                                    >
                                      {n.title}
                                    </p>
                                    {!n.isRead && (
                                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                    {n.message}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    {new Date(n.createdAt).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </p>
                                </div>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  NotificationDelete({
                                    notificationId: n._id,
                                  });
                                  dispatch(removeNotification(n._id));
                                }}
                                className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete notification"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 sm:h-10 px-2 lg:px-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        <Avatar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mr-1.5 sm:mr-2 border border-blue-100">
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:flex flex-col items-start">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {user.username}
                            </span>
                            {user.role === "admin" && (
                              <Shield className="h-3 w-3 ml-1 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center mt-0.5">
                            <Sparkles className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs font-bold text-blue-600">
                              {user.credits} Credits
                            </span>
                          </div>
                        </div>
                        <ChevronDown className="hidden lg:block ml-1 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 sm:w-72 lg:w-80 shadow-xl rounded-xl border"
                      align="end"
                    >
                      <DropdownMenuLabel className="flex items-center justify-between p-3 sm:p-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 mr-3">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base">
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">
                              {user.username}
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-500">
                              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                              {user.credits} Credits
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "outline"
                          }
                          className="ml-2 text-xs"
                        >
                          {user.role}
                        </Badge>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* <DropdownMenuItem
                        className="cursor-pointer flex items-center py-2.5 sm:py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                        onClick={() => {
                          setTimeout(() => setDailyCredit(true), 50);
                        }}
                      >
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                          <HandCoins className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm sm:text-base">
                            Get Daily Credits
                          </div>
                          <div className="text-xs text-gray-500">
                            Claim your free daily credits
                          </div>
                        </div>
                      </DropdownMenuItem> */}

                      {/* App Download in User Dropdown */}
                      {/* <DropdownMenuItem
                        className="cursor-pointer flex items-center py-2.5 sm:py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                        onClick={() => handleAppDownload("android")}
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm sm:text-base">
                            Download App
                          </div>
                          <div className="text-xs text-gray-500">
                            Get mobile app for better experience
                          </div>
                        </div>
                      </DropdownMenuItem> */}

                      {user.role === "admin" && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin"
                              className="cursor-pointer flex items-center py-2.5 sm:py-3 hover:bg-gray-50"
                            >
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                                <SwitchCamera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-sm sm:text-base">
                                  Admin Panel
                                </div>
                                <div className="text-xs text-gray-500">
                                  Switch to admin interface
                                </div>
                              </div>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer flex items-center py-2.5 sm:py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                            onClick={() => {
                              setTimeout(() => handelMatchListCorn(), 50);
                            }}
                          >
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                              <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm sm:text-base">
                                Match List Insert
                              </div>
                              <div className="text-xs text-gray-500">
                                Daily match list insert corn
                              </div>
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer flex items-center py-2.5 sm:py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                            onClick={() => {
                              setTimeout(() => matchStatusUpdate(), 50);
                            }}
                          >
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                              <RefreshCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm sm:text-base">
                                Match Status update
                              </div>
                              <div className="text-xs text-gray-500">
                                Daily match status update corn
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </>
                      )}

                      {menuItems.map((item) => (
                        <DropdownMenuItem asChild key={item.href}>
                          <Link
                            href={item.href}
                            className="cursor-pointer flex items-center py-2 sm:py-2.5 hover:bg-gray-50"
                          >
                            <div className="mr-2 sm:mr-3">{item.icon}</div>
                            <div>
                              <div className="font-medium text-sm sm:text-base">
                                {item.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer py-2.5 sm:py-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <div className="bg-red-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        <div className="font-medium text-sm sm:text-base">
                          Logout
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Desktop App Download Button for Non-Authenticated Users */}
                  {/* <div className="hidden lg:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 border border-gray-200"
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-sm">App</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48" align="end">
                        <DropdownMenuLabel className="flex items-center">
                          <Smartphone className="h-3.5 w-3.5 mr-2" />
                          <span className="text-sm">Download Mobile App</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleAppDownload("android")}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center w-full">
                            <svg
                              className="h-3.5 w-3.5 mr-2 text-green-600"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-1.995 3.458c-1.443-1.031-3.1993-1.63-5.1256-1.63-1.9276 0-3.6845.6-5.1278 1.631l-1.996-3.458a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592c-2.572 1.756-4.3058 4.755-4.3058 8.152 0 .552.4477 1 1 1h16.9998c.5523 0 1-.448 1-1 0-3.397-1.7338-6.396-4.3058-8.152" />
                            </svg>
                            <span className="text-sm">Android App</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div> */}

                  {/* Auth Buttons */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <Button
                      variant="ghost"
                      asChild
                      size="sm"
                      className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 border border-gray-200 text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-3"
                    >
                      <Link href="/auth/login">Login</Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm"
                    >
                      <Link href="/auth/register" className="flex items-center">
                        <span>Join</span>
                        <Sparkles className="ml-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-gray-100 ml-0.5 sm:ml-1"
                  >
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[85vw] max-w-sm sm:max-w-md p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Sheet Header */}
                    <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                      {isAuthenticated && user ? (
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg">
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-gray-900 text-sm sm:text-base">
                              {user.username}
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {user.credits} Credits
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            CricVista
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            AI Cricket Intelligence & Analytics
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 overflow-y-auto py-3 sm:py-4">
                      <div className="space-y-0.5 sm:space-y-1 px-1 sm:px-2">
                        {[
                          {
                            label: "Dashboard",
                            href: "/dashboard",
                            icon: LayoutDashboard,
                          },
                          ...navItems,
                        ].map((item) => {
                          const Icon = item.icon;
                          const isActive =
                            pathname === item.href ||
                            (item.href !== "/" &&
                              pathname.startsWith(item.href));
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center space-x-3 p-2.5 sm:p-3 rounded-lg mx-1 sm:mx-2 transition-all ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="font-medium text-sm sm:text-base">
                                {item.label}
                              </span>
                            </Link>
                          );
                        })}

                        {/* Mobile App Download Section */}
                        {/* <div className="p-2.5 sm:p-3 mx-1 sm:mx-2 border-t mt-3 sm:mt-4">
                          <div className="flex items-center mb-2">
                            <Download className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">
                              Download App
                            </span>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <button
                              onClick={() => {
                                handleAppDownload("android");
                                setMobileMenuOpen(false);
                              }}
                              className="flex items-center justify-between w-full p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <div className="flex items-center">
                                <svg
                                  className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 sm:mr-3"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-1.995 3.458c-1.443-1.031-3.1993-1.63-5.1256-1.63-1.9276 0-3.6845.6-5.1278 1.631l-1.996-3.458a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592c-2.572 1.756-4.3058 4.755-4.3058 8.152 0 .552.4477 1 1 1h16.9998c.5523 0 1-.448 1-1 0-3.397-1.7338-6.396-4.3058-8.152" />
                                </svg>
                                <div>
                                  <div className="font-medium text-sm sm:text-base">
                                    Android App
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    Google Play / APK
                                  </div>
                                </div>
                              </div>
                              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                            </button>
                          </div>
                        </div> */}
                      </div>

                      {/* Mobile Auth Actions */}
                      {isAuthenticated && user ? (
                        <div className="mt-4 sm:mt-6 space-y-1.5 sm:space-y-2 px-1 sm:px-2">
                          {/* <button
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setTimeout(() => setDailyCredit(true), 50);
                            }}
                            className="flex items-center justify-between w-full p-2.5 sm:p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                          >
                            <div className="flex items-center">
                              <HandCoins className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2 sm:mr-3" />
                              <div>
                                <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                  Get Daily Credits
                                </div>
                                <div className="text-xs text-gray-600">
                                  Claim free credits
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                              Free
                            </Badge>
                          </button> */}

                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full p-2.5 sm:p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                            <span className="font-medium text-sm sm:text-base">
                              Logout
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4 sm:mt-6 px-2 sm:px-4">
                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <Button
                              variant="outline"
                              asChild
                              className="w-full h-9 sm:h-10 text-sm"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Link href="/auth/login">Login</Link>
                            </Button>
                            <Button
                              className="w-full h-9 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-sm"
                              asChild
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Link href="/auth/register">Sign Up</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      {dailyCredit && (
        <DailyCreditAd
          isOpen={dailyCredit}
          onClose={() => setDailyCredit(false)}
          onCreditAdd={handleCreditAdd}
          dailyCreditRes={dailyCreditRes}
        />
      )}
    </>
  );
};

export default Header;
