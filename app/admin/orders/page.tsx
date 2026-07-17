"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  DollarSign,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { OrderList } from "../AdminService";
import moment from "moment";
import CustomLoader from "@/components/ui/CustomLoader";
import DataTable from "react-data-table-component";
import { CustomStyles } from "@/lib/utils";
import SearchPage from "./SearchPage";

const AdminOrdersPage = () => {
  const router = useRouter();

  const [isSearch, setIsSearch] = useState(false);
  const [searchData, setSearchData] = useState({});

  const {
    data = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order-list", searchData],
    queryFn: async () => {
      const apiResponse = await OrderList({
        ...searchData,
      });
      return apiResponse || {};
    },

    // enabled: !!dateRange.from && !!dateRange.to,
  });

  const handleViewOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClose = () => {
    setIsSearch(false);
    // refetch();
  };

  const handleSearchData = (searchParams: any) => {
    setSearchData(searchParams);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Safe data access with fallbacks
  const ordersData = data?.data || [];
  const overviewData = Array.isArray(data?.overview) ? data?.overview : [];

  const columns: any[] = [
    {
      name: "Order Number",
      selector: (row: any) => row?.orderNumber || "N/A",
      sortable: true,
      width: "160px",
      cell: (row: any) => (
        <span className="font-medium text-blue-600">
          {row?.orderNumber || "N/A"}
        </span>
      ),
    },
    {
      name: "Amount",
      selector: (row: any) => row?.price || 0,
      sortable: true,
      cell: (row: any) => (
        <span className="font-semibold">
          ₹{typeof row?.price === "number" ? row?.price?.toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      name: "Username",
      selector: (row: any) => row?.user?.username || "N/A",
      sortable: true,
      cell: (row: any) => <span>{row?.user?.username || "N/A"}</span>,
    },
    {
      name: "Type",
      selector: (row: any) => row?.ordertype || "N/A",
      sortable: true,
      cell: (row: any) => (
        <span className="capitalize">{row?.ordertype || "N/A"}</span>
      ),
    },
    {
      name: "Payment",
      selector: (row: any) => row?.paymentStatus,
      sortable: true,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row?.paymentStatus
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row?.paymentStatus ? "Paid" : "Failed"}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: any) => row?.status || "pending",
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
              row.status
            )}`}
          >
            {row?.status || "pending"}
          </span>
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row: any) => row?.createdAt,
      sortable: true,
      cell: (row: any) => moment(row?.createdAt).format("Do MMM, YYYY HH:mm"),
      width: "160px",
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewOrder(row?._id)}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
            title="View Order"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
      width: "80px",
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      {isLoading && <CustomLoader message="Order List Loading" />}
      <AdminLayout>
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Management
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage all subscription orders
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {overviewData.map((item: any, index: number) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {item.name}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {item.value}
                      </p>
                    </div>
                    {item.name === "Total Orders" ? (
                      <div className="p-3 rounded-full bg-blue-100">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                      </div>
                    ) : item.name === "Completed" ? (
                      <div className="p-3 rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    ) : item.name === "Failed" ? (
                      <div className="p-3 rounded-full bg-red-100">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="p-3 rounded-full bg-purple-100">
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search Page */}
          {isSearch && (
            <SearchPage
              onClose={handleClose}
              setSearchData={handleSearchData}
            />
          )}

          {/* Orders Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Orders ({ordersData.length})
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 w-full md:w-auto"
                    onClick={() => setIsSearch(!isSearch)}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-1">
              <DataTable
                columns={columns}
                data={ordersData}
                pagination
                highlightOnHover
                striped
                fixedHeader
                fixedHeaderScrollHeight="500px"
                customStyles={CustomStyles}
                responsive
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                noDataComponent={
                  <div className="text-center py-8 text-gray-500">
                    No orders found
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminOrdersPage;
