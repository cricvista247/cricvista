/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateTicketStatus } from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Flag,
  Send,
  Paperclip,
  Phone,
  Mail,
  MapPin,
  Edit,
  MoreHorizontal,
  FileText,
  Tag,
  Shield,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { TicketList, TicketUpdate } from "@/app/MainService";
import {
  getSocket,
  connectToTicket,
  disconnectFromTicket,
} from "@/lib/socketClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, Form, Formik } from "formik";
import {
  FormikSelectField,
  FormikTextArea,
  FormikTextInput,
} from "@/components/CustomField";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  subject: Yup.string()
    .required("Subject is required")
    .min(3, "Subject must be at least 3 characters"),
  category: Yup.string().required("Category is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  username: Yup.string().required("User name is required"),
});
const TicketDetailsPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("details");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socketStatus, setSocketStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const [socketError, setSocketError] = useState<string | null>(null);

  // useRef so socket handlers always read the latest user.id without stale closure
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    fetchTicketDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ticketId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    if (!ticketId) return;
    const socket = getSocket();
    connectToTicket(ticketId);

    // Initial status check
    setSocketStatus(socket.connected ? "connected" : "connecting");

    const handleConnect = () => {
      setSocketStatus("connected");
      setSocketError(null);
    };

    const handleDisconnect = (reason: string) => {
      setSocketStatus("disconnected");
      setSocketError(`Disconnected: ${reason}`);
    };

    const handleConnectError = (err: any) => {
      setSocketStatus("disconnected");
      setSocketError(err.message || "Connection error");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    const handleNewMessage = (data: any) => {
      console.log("ADMIN RECEIVED SOCKET MESSAGE:", data);

      const newMsg = data?.message;
      if (!newMsg) return;

      setTicket((prev: any) => {
        if (!prev) return prev;

        const current = prev.message || [];

        if (current.some((m: any) => m._id === newMsg._id)) {
          return prev;
        }

        return {
          ...prev,
          message: [...current, newMsg],
        };
      });
    };

    const handleStatusUpdated = (data: any) => {
      setTicket((prev: any) =>
        prev ? { ...prev, status: data.status } : prev,
      );
    };

    socket.on("new:message", handleNewMessage);
    socket.on("status:updated", handleStatusUpdated);

    // If socket is already connected, trigger connect callback manually
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      disconnectFromTicket(ticketId);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("new:message", handleNewMessage);
      socket.off("status:updated", handleStatusUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const fetchTicketDetails = () => {
    setIsLoading(true);
    TicketList({ ticketId: params.id })
      .then((res) => {
        setTicket(res.data[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Failed to get details. Please try again.");
      });
  };

  const emitStatusChange = (ticketId: string, status: string) => {
    const socket = getSocket();
    socket.emit("status:changed", { ticketId, status });
  };

  const handleStatusChange = (newStatus: string) => {
    if (ticket) {
      let reqData: any = { ticketId: ticket._id, status: newStatus };
      if (newStatus === "resolved" || newStatus === "closed") {
        reqData.ticketStatus = newStatus;
      }
      if (newStatus === "open") {
        reqData.status = "in-progress";
        reqData.ticketStatus = "in-progress";
        reqData.text = "Issue not resolved, ticket re-open";
      }
      setIsLoading(true);
      TicketUpdate(reqData)
        .then((res) => {
          setTicket(res.data);
          emitStatusChange(ticket._id, newStatus);
          toast.success(`Ticket status updated to ${newStatus}`);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          toast.error(err.message || "Failed to update ticket status");
        });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "closed":
        return <CheckCircle className="h-5 w-5 text-slate-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "technical":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "account":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "prediction":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSendMessage = () => {
    console.log("1. Admin clicked Send");

    setIsSubmitting(true);

    TicketUpdate({
      ticketId: ticket._id,
      status: ticket.status,
      ticketStatus: ticket.status,
      text: newMessage,
    })
      .then((res) => {
        console.log("2. TicketUpdate Success", res.data);

        setTicket({ ...res.data });

        const msgs = res.data.message ?? [];
        const newMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

        console.log("3. New Message:", newMsg);

        const socket = getSocket();
        console.log("4. Socket Connected:", socket.connected);

        if (newMsg) {
          console.log("5. Emitting Socket Event");

          socket.emit("send:message", {
            ticketId: res.data._id || ticket._id,
            message: newMsg,
          });

          console.log("6. Emit Completed");
        }

        setNewMessage("");
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.log("ERROR:", err);

        setIsSubmitting(false);
        toast.error(err.message || "Failed to update ticket.");
      });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ticket details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </div>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ticket Not Found
              </h3>
              <p className="text-gray-600">
                The ticket you're looking for doesn't exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const handleFormSubmit = (values: any) => {
    setIsLoading(true);
    const payload = {
      subject: values.subject,
      description: values.description,
      category: values.category,
      status: "open",
      priority: values.priority || "medium",
      username: values.username,
      ticketId: params.id,
    };
    TicketUpdate(payload)
      .then((res) => {
        toast.success(res.message);
        setIsLoading(false);
        setIsCreateTicketOpen(false);
        fetchTicketDetails();
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Failed to save details. Please try again.");
      });
  };

  // Function to determine if message is from user or admin
  const isCurrentUserMessage = (message: any) => {
    return message?.replyBy?._id === user?.id;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Ticket Details
                </h1>
                <div className="flex items-center space-x-1.5 bg-white px-2 py-1 rounded-lg border shadow-sm">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      socketStatus === "connected"
                        ? "bg-green-500 animate-pulse"
                        : socketStatus === "connecting"
                          ? "bg-yellow-500 animate-pulse"
                          : "bg-red-500"
                    }`}
                  />
                  <span className="text-xs text-gray-500 font-medium">
                    {socketStatus === "connected"
                      ? "Live Sync Active"
                      : socketStatus === "connecting"
                        ? "Connecting to Live Sync..."
                        : `Live Sync Offline (${socketError || "Disconnect"})`}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Ticket #{ticket.ticketNumber}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {ticket.status === "open" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("in-progress")}
                    className="cursor-pointer"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    In Progress
                  </DropdownMenuItem>
                )}
                {ticket.status === "in-progress" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("resolved")}
                    className="cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </DropdownMenuItem>
                )}
                {ticket.status === "resolved" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("closed")}
                      className="cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Close Ticket
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange("open")}
                      className="cursor-pointer"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Reopen Ticket
                    </DropdownMenuItem>
                  </>
                )}
                {ticket.status === "closed" && (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("open")}
                    className="cursor-pointer"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Reopen Ticket
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    // Delay opening the dialog so dropdown can close
                    setTimeout(() => setIsCreateTicketOpen(true), 50);
                  }}
                  className="cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Ticket
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Ticket Summary Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(ticket.status)}
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.charAt(0).toUpperCase() +
                    ticket.status.slice(1).replace("-", " ")}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Status</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flag className="h-5 w-5 text-orange-600" />
                </div>
                <Badge
                  className={getPriorityColor(ticket.priority || "medium")}
                >
                  {(ticket.priority || "medium").charAt(0).toUpperCase() +
                    (ticket.priority || "medium").slice(1)}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Priority</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Tag className="h-5 w-5 text-purple-600" />
                </div>
                <Badge className={getCategoryColor(ticket.category)}>
                  {ticket.category.charAt(0).toUpperCase() +
                    ticket.category.slice(1)}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Category</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                <p className="text-sm text-gray-600">Created</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {ticket.subject}
              </h2>
              <p className="text-gray-700">{ticket.description}</p>
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
            <TabsList className="sm:grid sm:grid-cols-3">
              <TabsTrigger value="details">Ticket Details</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="customer">Customer Info</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Ticket Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ticket ID:</span>
                      <span className="font-medium">{ticket.ticketNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subject:</span>
                      <span className="font-medium">{ticket.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Badge className={getCategoryColor(ticket.category)}>
                        {ticket.category.charAt(0).toUpperCase() +
                          ticket.category.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge
                        className={getPriorityColor(
                          ticket.priority || "medium",
                        )}
                      >
                        {(ticket.priority || "medium").charAt(0).toUpperCase() +
                          (ticket.priority || "medium").slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.charAt(0).toUpperCase() +
                          ticket.status.slice(1).replace("-", " ")}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(ticket.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <span>Issue Description</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">
                        {ticket.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="conversation" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span>Conversation History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                          Conversation History
                        </h3>
                      </div>

                      <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                        {ticket.message.map((msg: any, index: number) => {
                          const isMe = isCurrentUserMessage(msg);
                          return (
                            <div key={msg._id} className="space-y-2">
                              {/* Date separator if needed */}
                              {index === 0 ||
                              formatDate(msg.replyAt) !==
                                formatDate(
                                  ticket.message[index - 1].replyAt,
                                ) ? (
                                <div className="flex justify-center">
                                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                    {formatDate(msg.replyAt)}
                                  </span>
                                </div>
                              ) : null}

                              <div
                                className={`flex ${
                                  isMe ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`flex ${
                                    isMe ? "flex-row-reverse" : "flex-row"
                                  } items-start space-x-3 max-w-xs lg:max-w-md`}
                                >
                                  {/* Avatar */}
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isMe
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                        : "bg-gradient-to-r from-green-400 to-blue-500"
                                    }`}
                                  >
                                    {isMe ? (
                                      <Shield className="h-4 w-4 text-white" />
                                    ) : (
                                      <User className="h-4 w-4 text-white" />
                                    )}
                                  </div>

                                  {/* Message Bubble */}
                                  <div className="space-y-1">
                                    <div
                                      className={`px-4 py-3 rounded-2xl ${
                                        isMe
                                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm"
                                          : "bg-gray-100 text-gray-900 rounded-bl-sm"
                                      } shadow-sm`}
                                    >
                                      <p className="text-sm leading-relaxed">
                                        {msg.text}
                                      </p>
                                    </div>

                                    {/* Message Info */}
                                    <div
                                      className={`flex items-center space-x-2 text-xs ${
                                        isMe ? "text-gray-400" : "text-gray-500"
                                      } ${isMe ? "mr-0 justify-end" : "ml-0"}`}
                                    >
                                      <span className="flex items-center space-x-1">
                                        {isMe ? (
                                          <Shield className="h-3 w-3" />
                                        ) : (
                                          <UserCheck className="h-3 w-3" />
                                        )}
                                        <span>{msg?.replyBy?.name}</span>
                                      </span>
                                      <span>•</span>
                                      <span>
                                        {formatTime(msg?.replyAt ?? new Date())}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reply Section */}
                      <div className="p-6 border-t border-gray-200 bg-gray-50">
                        {ticket.status === "resolved" ||
                        ticket.status === "closed" ? (
                          <div className="text-center py-6 bg-green-50 rounded-xl border border-green-200">
                            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                              Ticket{" "}
                              {ticket.status === "closed"
                                ? "Closed"
                                : "Resolved"}{" "}
                              Successfully
                            </h3>
                            <p className="text-green-700">
                              This conversation has been marked as{" "}
                              {ticket.status}.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative">
                              <textarea
                                placeholder="Type your reply as admin..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <Paperclip className="h-4 w-4" />
                                <span>Attach File</span>
                              </button>
                              <button
                                onClick={handleSendMessage}
                                disabled={isSubmitting || !newMessage.trim()}
                                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                              >
                                <Send className="h-4 w-4" />
                                <span>Send Reply</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <h3 className="font-semibold text-lg">Contact Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{ticket.user.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{ticket.user.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>+91 ••••••••••</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>India</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">
                        Account Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Username:</span>
                          <span className="font-medium">
                            @{ticket.user.username}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">User ID:</span>
                          <span className="font-medium">{ticket.user._id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Tickets Created:
                          </span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since:</span>
                          <span className="font-medium">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Edit Support Ticket
            </DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={{
              subject: ticket.subject,
              description: ticket.description,
              category: ticket.category,
              priority: ticket.priority,
              username: ticket.user.username,
            }}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* User Name */}
                  <div className="col-span-2">
                    <Field
                      label="User Name"
                      component={FormikTextInput}
                      name="username"
                      placeholder="Enter username"
                      disabled
                    />
                  </div>

                  {/* Subject */}
                  <div className="col-span-2">
                    <Field
                      label="Subject"
                      component={FormikTextInput}
                      name="subject"
                      placeholder="Brief description of the issue"
                    />
                  </div>

                  {/* Category and Priority */}
                  <div className="col-span-1">
                    <Field
                      label="Category"
                      name="category"
                      component={FormikSelectField}
                      options={[
                        { label: "General", value: "general" },
                        { label: "Payment", value: "payment" },
                        { label: "Analytics", value: "prediction" },
                        { label: "Technical", value: "technical" },
                        { label: "Account", value: "account" },
                      ]}
                    />
                  </div>

                  <div className="col-span-1">
                    <Field
                      label="Priority"
                      name="priority"
                      component={FormikSelectField}
                      options={[
                        { label: "Low", value: "low" },
                        { label: "Medium", value: "medium" },
                        { label: "High", value: "high" },
                        { label: "Urgent", value: "urgent" },
                      ]}
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <Field
                      label="Description"
                      component={FormikTextArea}
                      name="description"
                      rows={4}
                      placeholder="Please provide detailed information about the issue..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateTicketOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? "Updating..." : "Update Ticket"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TicketDetailsPage;
