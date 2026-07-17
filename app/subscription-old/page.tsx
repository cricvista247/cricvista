/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Zap,
  Shield,
  Users,
  Trophy,
  Play,
  Coins,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setOrderHistory, setPlans } from "@/store/slices/subscriptionSlice";
import { DailyCreditAd } from "@/components/GetDailyCredit";
import {
  CheckBoostToken,
  PaymentCreate,
  SubscriptionList,
  UserOrderCredit,
} from "../MainService";
import { loginSuccess } from "@/store/slices/authSlice";
import { load } from "@cashfreepayments/cashfree-js";
import CustomLoader from "@/components/ui/CustomLoader";
import * as Icons from "lucide-react";

const SubscriptionPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [customTokens, setCustomTokens] = useState(1);
  const [dailyCredit, setDailyCredit] = useState(false);
  const [dailyCreditRes, setDailyCreditRes] = useState<any>({
    message: "",
    isSuccess: null,
  });
  const [dailyFreeCredit, setDailyFreeCredit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenPackages, setTokenPackages] = useState([]);
  const [isPurchasable, setIsPurchasable] = useState(false);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/auth/login");
  //     return;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (user?.id) {
      userBoostToken(user?.id);
    }
    planList();
  }, []);

  const userBoostToken = (id: any) => {
    CheckBoostToken(id)
      .then((res) => {
        setIsPurchasable(res.data.isBuyAble);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to get list. Please try again.");
      });
  };

  const planList = () => {
    setLoading(true);
    SubscriptionList()
      .then((res) => {
        const a = res.data.filter((item: any) => item.isActive);
        setTokenPackages(a);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message || "Failed to get list. Please try again.");
      });
  };

  const handleTokenChange = (value: string) => {
    const tokens = parseInt(value) || 1;
    setCustomTokens(Math.min(Math.max(tokens, 1), 1000)); // Limit between 1-1000
  };

  const initiatePayment = async (data: any) => {
    setLoading(true);
    let cashfree;
    cashfree = await load({
      mode: process.env.NEXT_PUBLIC_CASH_MODE, // or "sandbox" for testing
    });

    PaymentCreate({
      orderNumber:
        Date.now().toString(36) + Math.random().toString(36).substring(2),
      orderAmount: Number(data.price),
    })
      .then((response) => {
        dispatch(setOrderHistory(response.data));
        let checkoutOptions = {
          paymentSessionId: response.data.payment_session_id, // Get this from your backend
          redirectTarget: "_self", // or "_blank", "_top", "_modal", or a DOM element
        };

        cashfree.checkout(checkoutOptions).then(() => {});
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handlePurchase = async (
    packageId: string,
    tokens: number,
    price: number,
  ) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (packageId === "free") {
      setDailyFreeCredit(tokens);
      setDailyCredit(true);

      return;
    }

    if (packageId === "starter" && !isPurchasable) {
      toast.error("Only 1 time per day per user");
      return;
    }

    if (packageId === "custom" && customTokens < 1) {
      toast.error("Please select at least 1 token");
      return;
    }

    const packageData: any = tokenPackages.find(
      (pkg: any) => pkg.type === packageId,
    );
    if (!packageData) return;

    const actualPrice = packageId === "custom" ? customTokens * price : price;

    // Save chosen plan before redirect and call payment
    const prepareData = {
      ...packageData,
      price: actualPrice,
      credits: packageId === "custom" ? customTokens : packageData.credits,
    };
    const { icon, ...serializableData }: any = prepareData;

    // dispatch(setPlans(serializableData));
    initiatePayment({
      _id: packageData._id,
      type: packageData.type,
      price: actualPrice,
      credits: packageId === "custom" ? customTokens : packageData.credits,
      name: packageData.name,
    });
  };

  const calculateSavings = (packageId: string) => {
    if (packageId === "basic") {
      return "Save ₹201";
    } else if (packageId === "pro") {
      return "Save ₹601";
    }
    return null;
  };

  const handleCreditAdd = () => {
    let payload = {
      ordertype: "credit",
      userId: user!.id,
      credits: Number(dailyFreeCredit ?? 1),
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

  return (
    <>
      {loading && <CustomLoader />}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Buy Prediction Tokens
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Unlock AI Predictions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              1 Token = 1 Prediction. Choose your perfect token package and
              start winning!
            </p>

            {/* Current Token Balance */}
            {user && (
              <div className="inline-flex items-center space-x-4 bg-white rounded-2xl px-6 py-4 shadow-lg border">
                <div className="flex items-center space-x-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-900">
                    {user.credits || 0} Tokens Available
                  </span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  Each prediction costs 1 token
                </div>
              </div>
            )}
          </div>

          {/* Token Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
            {tokenPackages.map((pkg: any, index) => {
              const IconComponent =
                pkg.icon && Icons[pkg.icon as keyof typeof Icons];
              const savings = calculateSavings(pkg.type);

              return (
                <Card
                  key={pkg._id}
                  className={`relative group transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    pkg.bgColor
                  } border-2 ${pkg.borderColor} ${
                    pkg.popular ? "ring-2 ring-blue-500 shadow-xl" : "shadow-lg"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {savings && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-500 text-white">
                        {savings}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 text-center">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${pkg.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    {/* Package Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pkg.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4">
                      {pkg.description}
                    </p>

                    {/* Custom Token Input */}
                    {pkg.type === "custom" && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Number of Tokens
                        </label>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleTokenChange(String(customTokens - 1))
                            }
                            disabled={customTokens <= 1}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={customTokens}
                            onChange={(e) => handleTokenChange(e.target.value)}
                            className="text-center w-20"
                            min="1"
                            max="1000"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleTokenChange(String(customTokens + 1))
                            }
                            disabled={customTokens >= 1000}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-4">
                      {pkg.price === 0 ? (
                        <div className="text-3xl font-bold text-green-600">
                          FREE
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-gray-900">
                            ₹
                            {pkg.type === "custom"
                              ? customTokens * pkg.price
                              : pkg.price}
                          </div>
                          {pkg.type !== "custom" && (
                            <div className="text-sm text-gray-600">
                              ₹{Math.round(pkg.price / pkg.credits)} per token
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Tokens */}
                    <div className="mb-6">
                      <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                        {pkg.type === "custom" ? customTokens : pkg.credits}
                      </div>
                      <div className="text-gray-600 font-medium">
                        PREDICTION TOKENS
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature: any, featureIndex: any) => (
                        <li
                          key={featureIndex}
                          className="flex items-center justify-center text-sm text-gray-600"
                        >
                          <Zap className="h-3 w-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <Button
                      className={`w-full ${
                        pkg.price === 0
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          : pkg.popular
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            : "bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600"
                      } text-white font-semibold py-3`}
                      onClick={() => {
                        handlePurchase(pkg.type, pkg.credits, pkg.price);
                        const { icon, ...serializableData }: any = pkg;

                        dispatch(setPlans(serializableData));
                      }}
                    >
                      {pkg.price === 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Watch Ad & Get Token
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Buy Now
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Why Use Prediction Tokens?
                </CardTitle>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Get AI-powered insights that give you the winning edge
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      95% Accuracy
                    </h3>
                    <p className="text-gray-600">
                      Proven prediction success rate across thousands of matches
                    </p>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      Instant Access
                    </h3>
                    <p className="text-gray-600">
                      Get predictions immediately after token purchase
                    </p>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      Lifetime Tokens
                    </h3>
                    <p className="text-gray-600">
                      Purchased tokens never expire, use them anytime
                    </p>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      50K+ Winners
                    </h3>
                    <p className="text-gray-600">
                      Join our community of successful fantasy players
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    How do tokens work?
                  </h3>
                  <p className="text-gray-600">
                    Each prediction costs 1 token. Buy tokens in packages and
                    use them for AI-powered match predictions, winner forecasts,
                    and Dream11 team suggestions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    Do tokens expire?
                  </h3>
                  <p className="text-gray-600">
                    No! All purchased tokens are valid forever. Only free daily
                    tokens expire after 24 hours if not used.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    Can I get free tokens?
                  </h3>
                  <p className="text-gray-600">
                    Yes! Watch one ad daily to get 1 free token. Perfect for
                    trying out our predictions before purchasing.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    What payment methods?
                  </h3>
                  <p className="text-gray-600">
                    We accept UPI, credit/debit cards, net banking, and all
                    major digital wallets. 100% secure payments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
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

export default SubscriptionPage;
