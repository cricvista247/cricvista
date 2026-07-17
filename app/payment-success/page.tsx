"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Coins, ExternalLink } from "lucide-react";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { UserOrderCredit } from "../MainService";
import { loginSuccess } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { setOrderHistory, setPlans } from "@/store/slices/subscriptionSlice";

const PaymentSuccessPage = () => {
  const dispatch = useDispatch();
  const { orderHistory, plans } = useSelector(
    (state: RootState) => state.subscription
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();
  const [countdown, setCountdown] = useState(2);

  // Get transaction details from URL parameters or CashFree response
  const transactionId = orderHistory?.order_id || "N/A";
  const amount = orderHistory?.order_amount || "N/A";
  const tokens = plans?.credits || "N/A";
  const packageName = plans?.name || "N/A";

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    let payload = {
      ordertype: "purchase",
      userId: user!.id,
      credits: plans?.credits || 0,
      status: "completed",
      price: Number(orderHistory?.order_amount) || 0,
      paymentIntentId: orderHistory?.order_id,
    };

    UserOrderCredit(payload)
      .then((res) => {
        const prepareUser: any = user
          ? { ...user, credits: user.credits + (plans?.credits || 0) }
          : null;

        dispatch(loginSuccess({ ...prepareUser }));
        dispatch(setPlans(null));
        dispatch(setOrderHistory(null));
      })
      .catch((error) => {
        toast.error(error.message || "Error submit order. Please try again.");
      });

    // Countdown timer for automatic redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // router.push("/matches");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      // Trigger the route change only when countdown state is finalized at 0
      router.push("/matches");
    }
    // The router and countdown are the only necessary dependencies here
  }, [countdown, router]);

  const handleManualRedirect = () => {
    router.push("/matches");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your tokens have been added to your account
          </p>
        </div>

        {/* Transaction Details Card */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Coins className="h-6 w-6 text-yellow-500" />
              <span>Transaction Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Package Info */}
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Package:</span>
              <Badge className="bg-green-100 text-green-800">
                {packageName}
              </Badge>
            </div>

            {/* Tokens Added */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Tokens Added:</span>
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="font-bold text-gray-900">+{tokens}</span>
              </div>
            </div>

            {/* Amount Paid */}
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700 font-medium">Amount Paid:</span>
              <span className="font-bold text-gray-900">₹{amount}</span>
            </div>

            {/* Transaction ID */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Transaction ID:</span>
              <span className="font-mono text-sm text-gray-600">
                {transactionId}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-gray-700 font-medium">Status:</span>
              <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Completed</span>
              </Badge>
            </div>

            {/* Date & Time */}
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700 font-medium">Date & Time:</span>
              <span className="text-sm text-gray-600">
                {new Date(orderHistory?.created_at).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Countdown & Redirect Info */}
        <Card className="shadow-lg border-0 bg-blue-50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                Redirecting to matches in {countdown} second
                {countdown !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              You will be automatically redirected to start using your tokens
            </p>

            <Button
              onClick={handleManualRedirect}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Matches Now
            </Button>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:cricvista247@gmail.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
