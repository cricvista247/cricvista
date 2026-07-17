/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setUsers, updateUserStatus } from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Crown,
  User,
  Download,
  MoreVertical,
  Coins,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { fetchUserDetails, UserSendCredit } from "../AdminService";
import { useRouter } from "next/navigation";
import CustomLoader from "@/components/ui/CustomLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserUpdate } from "@/app/MainService";

// Memoized User Info Component
const UserInfoGrid = React.memo(
  ({
    selectedUser,
    getStatusColor,
  }: {
    selectedUser: any;
    getStatusColor: (status: string) => string;
  }) => (
    <div className="space-y-2">
      <Label>User Information</Label>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Email - Full width */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email:
              </span>
            </div>
            <p className="font-medium text-gray-900 dark:text-gray-100 text-right break-all text-sm">
              {selectedUser?.email || "N/A"}
            </p>
          </div>
        </div>

        {/* Name, Status, Credits - Grid on desktop, stacked on mobile */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Name */}
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Name
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <p className="font-medium text-sm">
                  {selectedUser?.name || selectedUser?.username || "N/A"}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Status
              </p>
              <div className="flex justify-center sm:justify-start">
                <Badge
                  className={getStatusColor(selectedUser?.status || "active")}
                >
                  {selectedUser?.status || "active"}
                </Badge>
              </div>
            </div>

            {/* Credits */}
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Credits
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <p className="font-medium text-lg">
                  {selectedUser?.credits || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

UserInfoGrid.displayName = "UserInfoGrid";

// Memoized Dialogs
const SendCreditsDialog = React.memo(
  ({
    open,
    onOpenChange,
    selectedUser,
    creditType,
    onCreditTypeChange,
    creditsAmount,
    onCreditsAmountChange,
    depositAmount,
    onDepositAmountChange,
    sendingCredits,
    onSendCredits,
    getStatusColor,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedUser: any;
    creditType: string;
    onCreditTypeChange: (type: string) => void;
    creditsAmount: number;
    onCreditsAmountChange: (amount: number) => void;
    depositAmount: number;
    onDepositAmountChange: (amount: number) => void;
    sendingCredits: boolean;
    onSendCredits: () => void;
    getStatusColor: (status: string) => string;
  }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-600" />
            Add Credits
          </DialogTitle>
          <DialogDescription>
            Add credits to user&apos;s account. Select type and enter details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <UserInfoGrid
            selectedUser={selectedUser}
            getStatusColor={getStatusColor}
          />

          {/* Credit Type */}
          <div className="space-y-2">
            <Label>Credit Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="creditType"
                  value="offer"
                  checked={creditType === "offer"}
                  onChange={(e) => onCreditTypeChange(e.target.value)}
                  className="accent-green-600"
                />
                <span className="text-sm font-medium">Offer (Free)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="creditType"
                  value="deposit"
                  checked={creditType === "deposit"}
                  onChange={(e) => onCreditTypeChange(e.target.value)}
                  className="accent-blue-600"
                />
                <span className="text-sm font-medium">Deposit</span>
              </label>
            </div>
          </div>

          {/* Deposit Amount */}
          {creditType === "deposit" && (
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Amount (₹) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 font-medium">
                  ₹
                </span>
                <Input
                  id="depositAmount"
                  type="number"
                  min="1"
                  value={depositAmount || ""}
                  onChange={(e) =>
                    onDepositAmountChange(Number(e.target.value))
                  }
                  className="pl-8"
                  placeholder="Enter amount in rupees"
                />
              </div>
            </div>
          )}

          {/* Credits Amount */}
          <div className="space-y-2">
            <Label htmlFor="credits">Credits *</Label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="credits"
                type="number"
                min="1"
                max="100000"
                value={creditsAmount}
                onChange={(e) => onCreditsAmountChange(Number(e.target.value))}
                className="pl-10"
                placeholder="Enter credits amount"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 20, 30].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onCreditsAmountChange(amount)}
                  className={
                    creditsAmount === amount ? "bg-blue-50 border-blue-200" : ""
                  }
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {creditType === "deposit" && depositAmount > 0 && creditsAmount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              User will receive <strong>{creditsAmount} tokens</strong> for{" "}
              <strong>₹{depositAmount.toLocaleString("en-IN")}</strong>. A
              deposit confirmation email will be sent to the user.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onCreditsAmountChange(5);
              onDepositAmountChange(0);
              onCreditTypeChange("offer");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onSendCredits}
            disabled={
              sendingCredits ||
              !creditsAmount ||
              (creditType === "deposit" && !depositAmount)
            }
            className="bg-green-600 hover:bg-green-700"
          >
            {sendingCredits ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {creditType === "deposit" ? "Confirm Deposit" : "Send Credits"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
);

SendCreditsDialog.displayName = "SendCreditsDialog";

const ActionDialog = React.memo(
  ({
    open,
    onOpenChange,
    selectedUser,
    reason,
    onReasonChange,
    actionLoading,
    onAction,
    type,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedUser: any;
    reason: string;
    onReasonChange: (reason: string) => void;
    actionLoading: boolean;
    onAction: () => void;
    type: "suspend" | "ban";
  }) => {
    const config = {
      suspend: {
        title: "Suspend User",
        icon: <Clock className="h-5 w-5" />,
        color: "text-yellow-600",
        description:
          "This will temporarily suspend the user's account. They won't be able to login or use the platform.",
        buttonText: "Suspend User",
        warning:
          "⚠️ The user will be notified about this suspension. They can contact support for more information.",
        warningClass:
          "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300",
      },
      ban: {
        title: "Ban User Permanently",
        icon: <Ban className="h-5 w-5" />,
        color: "text-red-600",
        description:
          "This will permanently ban the user's account. This action cannot be undone.",
        buttonText: "Ban User Permanently",
        warning:
          "⚠️ Warning: This action is permanent and cannot be undone. The user will be permanently blocked from the platform.",
        warningClass:
          "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300",
      },
    }[type];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[500px]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${config.color}`}>
              {config.icon}
              {config.title}
            </DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>User Information</Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="font-medium">
                  {selectedUser?.name || selectedUser?.username || "N/A"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for {type === "suspend" ? "Suspension" : "Ban"} *
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                placeholder={`Enter reason for ${
                  type === "suspend" ? "suspension" : "permanent ban"
                }`}
                rows={3}
                required
              />
              <p className="text-sm text-gray-500">
                This reason will be logged
                {type === "suspend"
                  ? " and may be shown to the user"
                  : " for audit purposes"}
                .
              </p>
            </div>

            <div className={`p-3 ${config.warningClass} border rounded-md`}>
              <p className="text-sm">{config.warning}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={onAction}
              disabled={!reason.trim() || actionLoading}
              variant={type === "ban" ? "destructive" : "default"}
              className={type === "ban" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {actionLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  {type === "suspend" ? "Suspending..." : "Banning..."}
                </>
              ) : (
                <>
                  {type === "suspend" ? (
                    <Clock className="h-4 w-4 mr-2" />
                  ) : (
                    <Ban className="h-4 w-4 mr-2" />
                  )}
                  {config.buttonText}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

ActionDialog.displayName = "ActionDialog";

// User Row Component
const UserRow = React.memo(
  ({
    user,
    onView,
    onSendCredits,
    onSuspend,
    onActivate,
    onBan,
    getStatusIcon,
    getStatusColor,
    getRoleColor,
    formatDate,
    getInitials,
    actionLoading,
  }: {
    user: any;
    onView: () => void;
    onSendCredits: () => void;
    onSuspend: () => void;
    onActivate: () => void;
    onBan: () => void;
    getStatusIcon: (status: string) => React.ReactNode;
    getStatusColor: (status: string) => string;
    getRoleColor: (role: string) => string;
    formatDate: (date: string) => string;
    getInitials: (name: string) => string;
    actionLoading: string | null;
  }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0">
              <AvatarFallback className="bg-blue-600 text-white text-sm sm:text-base">
                {getInitials(user.name || user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate">
                  {user.name || user.username}
                </h3>
                <div className="flex flex-wrap gap-1">
                  <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(user.status)}
                      <span className="capitalize">{user.status}</span>
                    </div>
                  </Badge>
                  {user.role === "admin" && (
                    <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                      <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  {user.role === "employee" && (
                    <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                      <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      Employee
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{user.mobileNumber || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{user.credits || 0} Credits</span>
                </div>
              </div>

              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                {user.lastAdCreditDate && (
                  <div className="flex items-center gap-2">
                    <span>
                      Last Ad Credit: {formatDate(user.lastAdCreditDate)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="h-3 w-3 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSendCredits}>
                  <Coins className="h-3 w-3 mr-2" />
                  Send Free Credits
                </DropdownMenuItem>
                {user.status === "active" && (
                  <DropdownMenuItem onClick={onSuspend}>
                    <Clock className="h-3 w-3 mr-2" />
                    Suspend User
                  </DropdownMenuItem>
                )}
                {user.status === "suspended" && (
                  <DropdownMenuItem onClick={onActivate}>
                    <CheckCircle className="h-3 w-3 mr-2" />
                    Activate User
                  </DropdownMenuItem>
                )}
                {user.status !== "banned" && (
                  <DropdownMenuItem onClick={onBan} className="text-red-600">
                    <Ban className="h-3 w-3 mr-2" />
                    Ban User
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="hidden sm:flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Terms:</span>{" "}
            {user.agreeToTerms ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                Agreed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 text-xs">
                Not Agreed
              </Badge>
            )}
            <span className="mx-2">•</span>
            <span className="font-medium">Active:</span>{" "}
            {user.isActive ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                Yes
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs">
                No
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onView}
              className="gap-1 sm:gap-2"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>View</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSendCredits}
              className="gap-1 sm:gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
            >
              <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Send Credits</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user.status === "active" && (
                  <DropdownMenuItem onClick={onSuspend}>
                    <Clock className="h-4 w-4 mr-2" />
                    Suspend User
                  </DropdownMenuItem>
                )}
                {user.status === "suspended" && (
                  <DropdownMenuItem onClick={onActivate}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate User
                  </DropdownMenuItem>
                )}
                {user.status !== "banned" && (
                  <DropdownMenuItem onClick={onBan} className="text-red-600">
                    <Ban className="h-4 w-4 mr-2" />
                    Ban User
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
);

UserRow.displayName = "UserRow";

const AdminUsersPage = () => {
  const router = useRouter();
  const { users } = useSelector((state: RootState) => state.admin);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [sendingCredits, setSendingCredits] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [creditsAmount, setCreditsAmount] = useState<number>(5);
  const [creditType, setCreditType] = useState<string>("offer");
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [suspendReason, setSuspendReason] = useState<string>("");
  const [banReason, setBanReason] = useState<string>("");
  const [sendCreditsOpen, setSendCreditsOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);

  // Memoized computations
  const activeUsers = useMemo(
    () => users.filter((u) => u.status === "active").length,
    [users]
  );

  const suspendedUsers = useMemo(
    () => users.filter((u) => u.status === "suspended").length,
    [users]
  );

  const bannedUsers = useMemo(
    () => users.filter((u) => u.status === "banned").length,
    [users]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter((user: any) => {
        const matchesSearch =
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.mobileNumber?.includes(searchTerm);

        const matchesStatus = activeTab === "all" || user.status === activeTab;

        return matchesSearch && matchesStatus;
      }),
    [users, searchTerm, activeTab]
  );

  // Callbacks for stable references
  const GetUserDetails = useCallback(() => {
    setLoading(true);
    fetchUserDetails({})
      .then((res) => {
        setLoading(false);
        dispatch(setUsers(res.data ?? []));
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to fetch users. Please try again.");
      });
  }, [dispatch]);

  const UserUpdateStatus = useCallback(
    async (values: any) => {
      let reqData: any = { userId: values._id };

      if (authUser?.role === "admin") {
        reqData.isActive = JSON.parse(values.isActive);
        reqData.status = values.status;
        reqData.remarks = values.remarks;
      }

      try {
        const res = await UserUpdate(reqData);
        return { message: res.message, isSuccess: true };
      } catch (err: any) {
        return {
          message: err.message || "Failed to save details. Please try again.",
          isSuccess: false,
        };
      }
    },
    [authUser?.role]
  );

  const handleSendCredits = useCallback(
    async (userId: string) => {
      if (!creditsAmount || creditsAmount <= 0) {
        toast.error("Please enter a valid credit amount");
        return;
      }
      if (creditType === "deposit" && !depositAmount) {
        toast.error("Please enter the deposit amount");
        return;
      }

      setSendingCredits(true);

      try {
        const payload: any = { userId, credits: creditsAmount, type: creditType };
        if (creditType === "deposit") {
          payload.amount = depositAmount;
        }
        await UserSendCredit(payload);
        toast.success(
          `Successfully added ${creditsAmount} credits to user account`
        );
        GetUserDetails();
        setSendCreditsOpen(false);
        setCreditsAmount(5);
        setDepositAmount(0);
        setCreditType("offer");
      } catch (error: any) {
        toast.error(error.message || "Failed to send credits");
      } finally {
        setSendingCredits(false);
      }
    },
    [creditsAmount, creditType, depositAmount, GetUserDetails]
  );

  const handleSuspendUser = useCallback(
    async (userId: string) => {
      if (!suspendReason.trim()) {
        toast.error("Please provide a reason for suspension");
        return;
      }

      setActionLoading(`suspend-${userId}`);

      try {
        const result: any = await UserUpdateStatus({
          _id: userId,
          isActive: false,
          status: "suspended",
          remarks: suspendReason,
        });

        if (result.isSuccess) {
          toast.success("User suspended successfully");
          dispatch(updateUserStatus({ id: userId, status: "suspended" }));
          setSuspendDialogOpen(false);
          setSuspendReason("");
          GetUserDetails();
        } else {
          toast.error(result.message || "Failed to suspend user");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to suspend user");
      } finally {
        setActionLoading(null);
      }
    },
    [UserUpdateStatus, dispatch, suspendReason]
  );

  const handleBanUser = useCallback(
    async (userId: string) => {
      if (!banReason.trim()) {
        toast.error("Please provide a reason for ban");
        return;
      }

      setActionLoading(`ban-${userId}`);

      try {
        const result: any = await UserUpdateStatus({
          _id: userId,
          isActive: false,
          status: "banned",
          remarks: banReason,
        });

        if (result.isSuccess) {
          toast.success("User banned successfully");
          dispatch(updateUserStatus({ id: userId, status: "banned" }));
          setBanDialogOpen(false);
          setBanReason("");
          GetUserDetails();
        } else {
          toast.error(result.message || "Failed to banned user");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to banned user");
      } finally {
        setActionLoading(null);
      }
    },
    [UserUpdateStatus, dispatch, banReason]
  );

  const handleActivateUser = useCallback(
    async (userId: string) => {
      setActionLoading(`activate-${userId}`);

      try {
        const result: any = await UserUpdateStatus({
          _id: userId,
          isActive: true,
          status: "active",
          remarks: "Issue resolved, reactivating account.",
        });

        if (result.isSuccess) {
          toast.success("User activated successfully");
          dispatch(updateUserStatus({ id: userId, status: "active" }));
          GetUserDetails();
        } else {
          toast.error(result.message || "Failed to activate user");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to activate user");
      } finally {
        setActionLoading(null);
      }
    },
    [UserUpdateStatus, dispatch]
  );

  // Stable helper functions
  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />;
      case "suspended":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />;
      case "banned":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "banned":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }, []);

  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "employee":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const getInitials = useCallback((name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Event handlers with stable references
  const handleViewUser = useCallback(
    (user: any) => {
      router.push(`/admin/users/${user._id}`);
    },
    [router]
  );

  const handleOpenSendCredits = useCallback((user: any) => {
    setSelectedUser(user);
    setSendCreditsOpen(true);
  }, []);

  const handleOpenSuspend = useCallback((user: any) => {
    setSelectedUser(user);
    setSuspendDialogOpen(true);
  }, []);

  const handleOpenBan = useCallback((user: any) => {
    setSelectedUser(user);
    setBanDialogOpen(true);
  }, []);

  useEffect(() => {
    GetUserDetails();
  }, [GetUserDetails]);

  return (
    <>
      {loading && <CustomLoader message="User details loading" />}
      <AdminLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* Header - Optimized with stable components */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage all registered users and their accounts
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base px-3 sm:px-4">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export Users</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards - Memoized values */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Users
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {users.length}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Active
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {activeUsers}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Suspended
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {suspendedUsers}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Banned
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {bannedUsers}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                    <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-0 shadow-lg dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-11"
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 sm:h-11 text-sm sm:text-base"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">More Filters</span>
                  <span className="sm:hidden">Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-0 shadow-lg dark:bg-gray-800">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span>All Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-4 sm:mb-6 h-auto p-1">
                  <TabsTrigger value="all" className="py-2 text-xs sm:text-sm">
                    All
                    <span className="ml-1">({users.length})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="py-2 text-xs sm:text-sm"
                  >
                    Active
                    <span className="ml-1">({activeUsers})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="suspended"
                    className="py-2 text-xs sm:text-sm"
                  >
                    Suspended
                    <span className="ml-1">({suspendedUsers})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="banned"
                    className="py-2 text-xs sm:text-sm"
                  >
                    Banned
                    <span className="ml-1">({bannedUsers})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value={activeTab}
                  className="space-y-3 sm:space-y-4"
                >
                  {filteredUsers.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {filteredUsers.map((user: any) => (
                        <UserRow
                          key={user._id}
                          user={user}
                          onView={() => handleViewUser(user)}
                          onSendCredits={() => {
                            setTimeout(() => handleOpenSendCredits(user), 50);
                          }}
                          onSuspend={() => {
                            setTimeout(() => handleOpenSuspend(user), 50);
                          }}
                          onActivate={() => handleActivateUser(user._id)}
                          onBan={() => {
                            setTimeout(() => handleOpenBan(user), 50);
                          }}
                          getStatusIcon={getStatusIcon}
                          getStatusColor={getStatusColor}
                          getRoleColor={getRoleColor}
                          formatDate={formatDate}
                          getInitials={getInitials}
                          actionLoading={actionLoading}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        No users found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No users match the selected filter"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Memoized Dialogs */}
        <SendCreditsDialog
          open={sendCreditsOpen}
          onOpenChange={setSendCreditsOpen}
          selectedUser={selectedUser}
          creditType={creditType}
          onCreditTypeChange={setCreditType}
          creditsAmount={creditsAmount}
          onCreditsAmountChange={setCreditsAmount}
          depositAmount={depositAmount}
          onDepositAmountChange={setDepositAmount}
          sendingCredits={sendingCredits}
          onSendCredits={() => handleSendCredits(selectedUser?._id)}
          getStatusColor={getStatusColor}
        />

        <ActionDialog
          open={suspendDialogOpen}
          onOpenChange={setSuspendDialogOpen}
          selectedUser={selectedUser}
          reason={suspendReason}
          onReasonChange={setSuspendReason}
          actionLoading={actionLoading === `suspend-${selectedUser?._id}`}
          onAction={() => handleSuspendUser(selectedUser?._id)}
          type="suspend"
        />

        <ActionDialog
          open={banDialogOpen}
          onOpenChange={setBanDialogOpen}
          selectedUser={selectedUser}
          reason={banReason}
          onReasonChange={setBanReason}
          actionLoading={actionLoading === `ban-${selectedUser?._id}`}
          onAction={() => handleBanUser(selectedUser?._id)}
          type="ban"
        />
      </AdminLayout>
    </>
  );
};

export default AdminUsersPage;
