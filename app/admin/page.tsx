"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";

import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Users,
  ShoppingCart,
  Ticket,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { fetchDashboardStats } from "./AdminService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const AdminDashboard = () => {
  const [dbStats, setDbStats] = React.useState<any>(null);
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());

  const { users, tickets, financeStats } = useSelector(
    (state: RootState) => state.admin
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchDashboardStats(selectedYear);
        if (res.success) {
          setDbStats(res.data);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      }
    };
    loadStats();
  }, [dispatch, selectedYear]);

  const openTickets = tickets.filter((t) => t.status === "open").length;

  const dashboardStats = [
    {
      title: "Total Users",
      value: dbStats
        ? dbStats.totalUsers.toString()
        : users.length.toString(),
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Revenue",
      value: `₹${(
        dbStats ? dbStats.totalIncome : financeStats.totalRevenue
      ).toLocaleString()}`,
      change: "+8%",
      changeType: "positive",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: financeStats.totalOrders.toString(),
      change: "+15%",
      changeType: "positive",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Open Tickets",
      value: openTickets.toString(),
      change: "-5%",
      changeType: "negative",
      icon: Ticket,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Overview of your CricVista platform
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center shadow-sm">
            <span className="mr-3 text-sm font-medium text-gray-700">Filter Year :</span>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-12 gap-6">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon =
              stat.changeType === "positive"
                ? TrendingUp
                : TrendingDown;

            return (
              <div
                key={index}
                className="col-span-12 sm:col-span-6 lg:col-span-3"
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <div
                          className={`flex items-center mt-2 text-sm ${stat.changeType === "positive"
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        >
                          <TrendIcon className="h-4 w-4 mr-1" />
                          {stat.change}
                        </div>
                      </div>

                      <div
                        className={`p-3 rounded-full ${stat.bgColor}`}
                      >
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        {dbStats && (
          <div className="grid grid-cols-12 gap-8">

            {/* USERS CHART */}
            <div className="col-span-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Month-wise Users</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dbStats.userBarChart}
                        barCategoryGap="30%"
                        barGap={4}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />

                        <Bar
                          dataKey="users"
                          fill="#3b82f6"
                          barSize={18}
                        >
                          <LabelList
                            dataKey="users"
                            position="top"
                          />
                        </Bar>

                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* INCOME CHART */}
            <div className="col-span-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>Month-wise Income</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dbStats.incomeBarChart}
                        barCategoryGap="30%"
                        barGap={4}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />

                        <Bar
                          dataKey="income"
                          fill="#10b981"
                          barSize={18}
                        >
                          <LabelList
                            dataKey="income"
                            position="top"
                          />
                        </Bar>

                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;