/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  Home,
  ArrowRight,
  Wallet,
  Smartphone,
  Clock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DailyCreditAd } from "@/components/GetDailyCredit";
import { UserOrderCredit } from "../MainService";
import { loginSuccess } from "@/store/slices/authSlice";

const SubscriptionPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const [dailyCredit, setDailyCredit] = useState(false);
  const [dailyCreditRes, setDailyCreditRes] = useState<any>({
    message: "",
    isSuccess: null,
  });
  const [loading, setLoading] = useState(false);

  const staticPlans = [
    {
      id: "starter",
      name: "Starter",
      tokens: 1,
      price: 49,
      description: "Perfect for a single analysis",
      features: ["1 AI Analysis Credit", "Standard Support", "Instant Access"],
      color: "from-blue-500 to-blue-600",
      icon: Zap,
      popular: false,
    },
    {
      id: "standard",
      name: "Pro Analytics",
      tokens: 5,
      price: 199,
      description: "Best for weekend match analysis",
      features: [
        "5 AI Analysis Credits",
        "Priority Support",
        "Lifetime Validity",
        "Save ₹46",
      ],
      color: "from-violet-500 to-violet-600",
      icon: Coins,
      popular: true,
    },
    {
      id: "premium",
      name: "Elite Analytics",
      tokens: 15,
      price: 599,
      description: "For the ultimate analyst",
      features: [
        "15 AI Analysis Credits",
        "VIP Support",
        "Lifetime Validity",
        "Save ₹136",
      ],
      color: "from-amber-500 to-amber-600",
      icon: Crown,
      popular: false,
    },
  ];

  const handleWhatsAppPayment = (plan: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      router.push("/auth/login");
      return;
    }

    const whatsappNumber = "918981374643";
    const message = `Hello! I would like to purchase the *${plan.name}* (${plan.tokens} Credits) for *₹${plan.price}*.

*My Details:*
- Name: ${user?.username || "N/A"}
- Email: ${user?.email || "N/A"}
- User ID: ${user?.id || "N/A"}

I am sending this message to confirm my payment. Please add the credits to my account.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleFreeToken = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setDailyCredit(true);
  };

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
        toast.success("Credit added successfully!");
      })
      .catch((error) => {
        setDailyCreditRes({ message: error.message, isSuccess: false });
        toast.error(error.message || "Failed to add credit");
      });
  };

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 text-xs font-semibold tracking-wide"
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              AI-Powered Analytics
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Get Premium{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Analytics Credits
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
              Unlock AI-powered sports analytics. Each credit gives you one
              premium match analysis.
            </p>
          </div>

          {/* Balance Card */}
          {user && (
            <div className="max-w-lg mx-auto mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl p-4 md:p-5 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-1">
                      Your Analytics Credits
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {user.credits || 0}{" "}
                      <span className="text-lg font-normal text-blue-200">
                        credits
                      </span>
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <Wallet className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-blue-100 text-xs">
                  <BarChart3 className="h-3.5 w-3.5" />1 credit = 1 AI
                  analysis
                </div>
              </div>
            </div>
          )}

          {/* Contact / Trust Section */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
                Need Help?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        WhatsApp
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        8981374643
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-green-50 text-green-600 shrink-0"
                    onClick={() =>
                      copyToClipboard("8981374643", "WhatsApp number")
                    }
                  >
                    {copiedText === "WhatsApp number" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        cricvista247@gmail.com
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-blue-50 text-blue-600 shrink-0"
                    onClick={() =>
                      copyToClipboard(
                        "cricvista247@gmail.com",
                        "Email support",
                      )
                    }
                  >
                    {copiedText === "Email support" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-3">
                After payment, share the transaction screenshot on WhatsApp for
                instant credit activation.
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-16">
            {staticPlans.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <Card
                  key={pkg.id}
                  className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${
                    pkg.popular
                      ? "border-blue-200 shadow-blue-100/50 shadow-lg scale-[1.02] md:scale-105 z-10"
                      : "border-gray-200 shadow-sm hover:border-gray-300"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 shadow-lg px-4 py-1">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader
                    className={`pb-0 text-center ${pkg.popular ? "pt-8" : "pt-6"}`}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${pkg.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {pkg.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.description}
                    </p>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1 pt-6">
                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-sm text-muted-foreground">₹</span>
                        <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                          {pkg.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pkg.tokens} credit{pkg.tokens > 1 ? "s" : ""}
                        {pkg.tokens > 1 && (
                          <span className="text-blue-600 font-medium ml-1">
                            · ₹{(pkg.price / pkg.tokens).toFixed(0)}/credit
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <Button
                      className={`w-full h-12 text-base font-semibold gap-2 shadow-md hover:shadow-lg transition-all ${
                        pkg.popular
                          ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                      onClick={() => handleWhatsAppPayment(pkg)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Buy via WhatsApp
                      <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* How It Works */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10 tracking-tight">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose Your Plan",
                  desc: "Select the plan that fits your analysis needs.",
                  icon: Coins,
                },
                {
                  step: "02",
                  title: "Pay Securely",
                  desc: "Send payment and receive credits within minutes.",
                  icon: Smartphone,
                },
                {
                  step: "03",
                  title: "Start Analyzing",
                  desc: "Use credits to unlock premium AI analysis.",
                  icon: BarChart3,
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.step} className="text-center">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                      <ItemIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                      Step {item.step}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Free Trial Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 md:p-8 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Want a Free Trial?
              </h2>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Watch a short ad and get 1 free analysis credit every day.
              </p>
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold h-12 px-8 shadow-lg hover:shadow-green-200 transition-all rounded-xl"
                onClick={handleFreeToken}
              >
                <Play className="h-4 w-4 mr-2 fill-current" />
                Get Free Credit
              </Button>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10 tracking-tight">
              Why Choose Our Analytics?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Trophy,
                  title: "95% Model Accuracy",
                  desc: "Advanced statistical modeling",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Zap,
                  title: "Real-time Data",
                  desc: "Live form & pitch analysis",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  icon: Shield,
                  title: "100% Secure",
                  desc: "Manual credit verification",
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                },
                {
                  icon: Users,
                  title: "Expert Team",
                  desc: "Analysts + AI developers",
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
              ].map((feat) => {
                const FeatIcon = feat.icon;
                return (
                  <Card
                    key={feat.title}
                    className="border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <CardContent className="p-5 text-center">
                      <div
                        className={`w-10 h-10 ${feat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}
                      >
                        <FeatIcon className={`h-5 w-5 ${feat.color}`} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feat.desc}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  CricVista provides AI-powered sports analytics and
                  statistical insights for informational and entertainment
                  purposes only. We do not facilitate betting, gambling,
                  wagering, or real-money gaming. AI-generated insights are
                  statistical forecasts and should not be interpreted as
                  betting advice or guarantees of future outcomes.
                </p>
              </div>
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
