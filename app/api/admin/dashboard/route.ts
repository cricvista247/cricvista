import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../db";
import { FormatErrorMessage } from "@/lib/utils";
import Order from "../../order/OrderModel";
import User from "../../users/UserModel";

export const GET = async (request: NextRequest) => {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const yearParam = url.searchParams.get("year");
    const currentYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    // 1. Total Users
    const totalUsers = await User.countDocuments();

    // 2. Month-wise Users for Current Year
    const monthWiseUsersData = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Total Income (price where paymentStatus is true)
    const totalIncomeResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: true,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);
    const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

    // 4. Month-wise Income for Current Year
    const monthWiseIncomeData = await Order.aggregate([
      {
        $match: {
          paymentStatus: true,
          status: "completed",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          income: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format Bar Chart Data (Jan to Dec)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const userBarChart = months.map((month, index) => {
      const match = monthWiseUsersData.find((item) => item._id === index + 1);
      return {
        month,
        users: match ? match.count : 0,
      };
    });

    const incomeBarChart = months.map((month, index) => {
      const match = monthWiseIncomeData.find((item) => item._id === index + 1);
      return {
        month,
        income: match ? match.income : 0,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          totalUsers,
          totalIncome,
          userBarChart,
          incomeBarChart,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: FormatErrorMessage(error),
      },
      { status: 500 }
    );
  }
};
