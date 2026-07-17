/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ShoppingCart,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Mail,
  Phone,
  MapPin,
  Package,
  FileText,
  AlertCircle,
  Receipt,
  Sparkles,
  Wallet,
  IndianRupee,
} from "lucide-react";

import toast from "react-hot-toast";
import { OrderDetails } from "../../AdminService";
import CustomLoader from "@/components/ui/CustomLoader";
import moment from "moment";

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [order, setOrder] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const orderId = params.id as string;

  const GetDetails = () => {
    setLoading(true);
    OrderDetails(orderId)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err.message || "Failed to fetch details. Please try again."
        );
      });
  };

  useEffect(() => {
    GetDetails();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "refunded":
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
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

  const getPaymentStatusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getPaymentGatewayStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatIndianDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("DD MMM YYYY, hh:mm A");
  };

  // Get payment details from the response
  const paymentDetails = order?.paymentDetails?.[0];
  const user = order?.user;

  const timeline = [
    {
      status: "Order Placed",
      timestamp: order?.createdAt,
      description: "Customer placed the order",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      status: "Payment Initiated",
      timestamp: paymentDetails?.payment_time || order?.createdAt,
      description: "Payment process started",
      icon: CreditCard,
      color: "text-yellow-600",
    },
    {
      status: order?.paymentStatus ? "Payment Confirmed" : "Payment Pending",
      timestamp: paymentDetails?.payment_completion_time || order?.createdAt,
      description: order?.paymentStatus
        ? "Payment confirmed successfully"
        : "Payment pending - awaiting confirmation",
      icon: order?.paymentStatus ? CheckCircle : Clock,
      color: order?.paymentStatus ? "text-green-600" : "text-yellow-600",
    },
    {
      status: "Order Completed",
      timestamp: order?.updatedAt,
      description: "Order processing completed",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  return (
    <>
      {loading && <CustomLoader />}
      <AdminLayout>
        {Object.keys(order).length > 0 ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Order Details
                  </h1>
                  <p className="text-gray-600 mt-1">{order?.orderNumber}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(order?.status)}
                    </div>
                    <Badge className={getStatusColor(order?.status)}>
                      {order?.status?.charAt(0)?.toUpperCase() +
                        order?.status?.slice(1)}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">Order Status</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {order?.price}
                    </div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 capitalize">
                      {order?.ordertype}
                    </div>
                    <p className="text-sm text-gray-600">Order Type</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatDate(order?.createdAt)}
                    </div>
                    <p className="text-sm text-gray-600">Order Date</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="sm:grid sm:grid-cols-4">
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="customer">Customer Info</TabsTrigger>
                  <TabsTrigger value="payment">Payment Details</TabsTrigger>
                  <TabsTrigger value="timeline">Order Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          <span>Order Information</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Number:</span>
                          <span className="font-medium">
                            {order?.orderNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Type:</span>
                          <span className="font-medium capitalize">
                            {order?.ordertype}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {order?.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credits:</span>
                          <span className="font-medium">{order?.credits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-medium">
                            {formatDate(order?.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="font-medium">
                            {formatDate(order?.updatedAt)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={getStatusColor(order?.status)}>
                            {order?.status?.charAt(0)?.toUpperCase() +
                              order?.status?.slice(1)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Wallet className="h-5 w-5 text-green-600" />
                          <span>Credit Information</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Credits Purchased:
                          </span>
                          <span className="font-medium">{order?.credits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Value:</span>
                          <span className="font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {order?.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credit Rate:</span>
                          <span className="font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {order?.price && order?.credits
                              ? (order.price / order.credits).toFixed(2)
                              : "0.00"}
                            /credit
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <Badge
                            className={getPaymentStatusColor(
                              order?.paymentStatus
                            )}
                          >
                            {order?.paymentStatus ? "Success" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Match ID:</span>
                          <span className="font-medium">
                            {order?.matchId || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remarks:</span>
                          <span className="font-medium">
                            {order?.remarks || "No remarks"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="customer" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-purple-600" />
                        <span>Customer Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            Contact Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{user?.name}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{user?.mobileNumber}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>India</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            Customer Stats
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Member Since:
                              </span>
                              <span className="font-medium">
                                {formatDate(user?.createdAt)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Username:</span>
                              <span className="font-medium">
                                {user?.username}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Current Credits:
                              </span>
                              <span className="font-medium">
                                {user?.credits}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Role:</span>
                              <Badge variant="secondary" className="capitalize">
                                {user?.role}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Account Status:
                              </span>
                              <Badge
                                variant={
                                  user?.isActive ? "default" : "secondary"
                                }
                              >
                                {user?.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Terms Accepted:
                              </span>
                              <span className="font-medium">
                                {user?.agreeToTerms ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <span>Payment Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            Transaction Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment ID:</span>
                              <span className="font-medium">
                                {paymentDetails?.cf_payment_id || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order ID:</span>
                              <span className="font-medium">
                                {paymentDetails?.order_id}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Payment Method:
                              </span>
                              <span className="font-medium capitalize">
                                {paymentDetails?.payment_group === "upi"
                                  ? "UPI"
                                  : paymentDetails?.payment_group}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Payment Status:
                              </span>
                              <Badge
                                className={getPaymentGatewayStatusColor(
                                  paymentDetails?.payment_status
                                )}
                              >
                                {paymentDetails?.payment_status || "N/A"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Payment Date:
                              </span>
                              <span className="font-medium">
                                {formatIndianDate(paymentDetails?.payment_time)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Completion Time:
                              </span>
                              <span className="font-medium">
                                {formatIndianDate(
                                  paymentDetails?.payment_completion_time
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            Payment Gateway
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gateway:</span>
                              <span className="font-medium">
                                {
                                  paymentDetails?.payment_gateway_details
                                    ?.gateway_name
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Settlement:</span>
                              <span className="font-medium">
                                {
                                  paymentDetails?.payment_gateway_details
                                    ?.gateway_settlement
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Bank Reference:
                              </span>
                              <span className="font-medium">
                                {paymentDetails?.bank_reference || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Captured:</span>
                              <span className="font-medium">
                                {paymentDetails?.is_captured ? "Yes" : "No"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                International:
                              </span>
                              <span className="font-medium">
                                {paymentDetails?.international_payment
                                  ?.international
                                  ? "Yes"
                                  : "No"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* UPI Details */}
                      {paymentDetails?.payment_method?.upi && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-lg mb-3">
                            UPI Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">UPI ID:</span>
                              <span className="font-medium">
                                {paymentDetails.payment_method.upi.upi_id}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Channel:</span>
                              <span className="font-medium capitalize">
                                {paymentDetails.payment_method.upi.channel}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Instrument:</span>
                              <span className="font-medium">
                                {
                                  paymentDetails.payment_method.upi
                                    .upi_instrument
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Receipt className="h-5 w-5 text-blue-600" />
                        <span>Amount Breakdown</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-w-md">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Amount:</span>
                          <span className="font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {paymentDetails?.order_amount || order?.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Amount:</span>
                          <span className="font-medium flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {paymentDetails?.payment_amount || order?.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span className="font-medium">
                            {paymentDetails?.order_currency || "INR"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Service Charge:</span>
                          <span className="flex items-center">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {paymentDetails?.payment_surcharge
                              ?.payment_surcharge_service_charge || "0.00"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Service Tax:</span>
                          <span className="flex items-center">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {paymentDetails?.payment_surcharge
                              ?.payment_surcharge_service_tax || "0.00"}
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total Amount:</span>
                            <span className="flex items-center">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              {order?.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span>Order Timeline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {timeline?.map((event, index) => {
                          const Icon = event?.icon;
                          return (
                            <div
                              key={index}
                              className="flex items-start space-x-4"
                            >
                              <div
                                className={`p-2 rounded-full bg-gray-100 ${event?.color}`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-gray-900">
                                    {event?.status}
                                  </h3>
                                  <span className="text-sm text-gray-500">
                                    {formatIndianDate(event?.timestamp)}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">
                                  {event?.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Order Not Found
                </h3>
                <p className="text-gray-600">
                  The order you're looking for doesn't exist or has been
                  removed.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default OrderDetailsPage;
