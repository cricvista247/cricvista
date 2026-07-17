"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setFinanceStats, setOrders } from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  CreditCard,
  RefreshCw,
  BarChart3,
  PieChart,
  Target,
  Users,
  ShoppingCart,
} from "lucide-react";

const AdminFinancePage = () => {
  const { financeStats, orders } = useSelector(
    (state: RootState) => state.admin
  );
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Mock finance data
    const mockFinanceStats = {
      totalRevenue: 125000,
      monthlyRevenue: 15000,
      totalOrders: 450,
      pendingPayments: 5,
      refunds: 2,
      averageOrderValue: 350,
    };

    const mockOrders = [
      {
        id: "ORD-001",
        userId: "1",
        userName: "cricket_fan",
        plan: "Pro",
        amount: 299,
        date: "2025-01-15",
        status: "completed" as const,
        paymentMethod: "UPI",
      },
      {
        id: "ORD-002",
        userId: "3",
        userName: "dream11_pro",
        plan: "Elite",
        amount: 599,
        date: "2025-01-14",
        status: "pending" as const,
        paymentMethod: "Credit Card",
      },
      {
        id: "ORD-003",
        userId: "2",
        userName: "sports_lover",
        plan: "Pro",
        amount: 299,
        date: "2025-01-13",
        status: "failed" as const,
        paymentMethod: "Net Banking",
      },
      {
        id: "ORD-004",
        userId: "5",
        userName: "cricket_master",
        plan: "Pro",
        amount: 299,
        date: "2025-01-12",
        status: "completed" as const,
        paymentMethod: "UPI",
      },
      {
        id: "ORD-005",
        userId: "4",
        userName: "fantasy_king",
        plan: "Elite",
        amount: 599,
        date: "2025-01-11",
        status: "refunded" as const,
        paymentMethod: "Credit Card",
      },
    ];

    dispatch(setFinanceStats(mockFinanceStats));
    dispatch(setOrders(mockOrders));
  }, [dispatch]);

  const completedOrders = orders.filter((o) => o.status === "completed");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const failedOrders = orders.filter((o) => o.status === "failed");
  const refundedOrders = orders.filter((o) => o.status === "refunded");

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );
  const pendingRevenue = pendingOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );
  const refundedAmount = refundedOrders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  const revenueStats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      change: "+12%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Monthly Revenue",
      value: `₹${financeStats.monthlyRevenue.toLocaleString()}`,
      change: "+8%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Payments",
      value: `₹${pendingRevenue.toLocaleString()}`,
      change: `${pendingOrders.length} orders`,
      changeType: "neutral",
      icon: CreditCard,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Refunds",
      value: `₹${refundedAmount.toLocaleString()}`,
      change: `${refundedOrders.length} refunds`,
      changeType: "negative",
      icon: RefreshCw,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const paymentMethodStats = [
    {
      method: "UPI",
      count: orders.filter((o) => o.paymentMethod === "UPI").length,
      percentage: 45,
    },
    {
      method: "Credit Card",
      count: orders.filter((o) => o.paymentMethod === "Credit Card").length,
      percentage: 30,
    },
    {
      method: "Debit Card",
      count: orders.filter((o) => o.paymentMethod === "Debit Card").length,
      percentage: 15,
    },
    {
      method: "Net Banking",
      count: orders.filter((o) => o.paymentMethod === "Net Banking").length,
      percentage: 10,
    },
  ];

  const planStats = [
    {
      plan: "Pro",
      count: orders.filter((o) => o.plan === "Pro").length,
      revenue: orders
        .filter((o) => o.plan === "Pro" && o.status === "completed")
        .reduce((sum, o) => sum + o.amount, 0),
    },
    {
      plan: "Elite",
      count: orders.filter((o) => o.plan === "Elite").length,
      revenue: orders
        .filter((o) => o.plan === "Elite" && o.status === "completed")
        .reduce((sum, o) => sum + o.amount, 0),
    },
    { plan: "Free", count: 0, revenue: 0 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Finance Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor revenue, payments, and financial metrics
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenueStats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon =
              stat.changeType === "positive"
                ? TrendingUp
                : stat.changeType === "negative"
                ? TrendingDown
                : Target;

            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <div
                        className={`flex items-center mt-2 text-sm ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : stat.changeType === "negative"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        <TrendIcon className="h-4 w-4 mr-1" />
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Finance Tabs */}
        <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="sm:grid sm:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Methods */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span>Payment Methods</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethodStats.map((method, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="font-medium text-gray-900">
                              {method.method}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {method.count} orders
                            </div>
                            <div className="text-sm text-gray-600">
                              {method.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Revenue */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-purple-600" />
                      <span>Revenue by Plan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {planStats.map((plan, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                plan.plan === "Pro"
                                  ? "bg-blue-600"
                                  : plan.plan === "Elite"
                                  ? "bg-purple-600"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                            <span className="font-medium text-gray-900">
                              {plan.plan} Plan
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              ₹{plan.revenue.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {plan.count} orders
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    <span>Recent Transactions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-lg ${
                              order.status === "completed"
                                ? "bg-green-100"
                                : order.status === "pending"
                                ? "bg-yellow-100"
                                : order.status === "failed"
                                ? "bg-red-100"
                                : "bg-blue-100"
                            }`}
                          >
                            <DollarSign
                              className={`h-5 w-5 ${
                                order.status === "completed"
                                  ? "text-green-600"
                                  : order.status === "pending"
                                  ? "text-yellow-600"
                                  : order.status === "failed"
                                  ? "text-red-600"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.userName} - {order.plan} Plan
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ₹{order.amount}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Revenue Analytics
                  </h3>
                  <p className="text-gray-600">
                    Detailed revenue charts and analytics will be displayed here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Analytics
                  </h3>
                  <p className="text-gray-600">
                    Payment method analysis and transaction details will be
                    shown here
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Financial Reports
                  </h3>
                  <p className="text-gray-600">
                    Generate and download comprehensive financial reports
                  </p>
                  <div className="mt-6 space-y-3">
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Monthly Report
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Custom Date Range Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFinancePage;
