"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Tag,
  FileText,
  Download,
  Paperclip,
  ThumbsUp,
  Sparkles,
  X,
  ChevronDown,
  Star,
  Zap,
  Headphones,
  Shield,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import { FormikTextArea } from "@/components/CustomField";
import * as Yup from "yup";
import CustomLoader from "@/components/ui/CustomLoader";
import { TicketList, TicketUpdate } from "@/app/MainService";
import {
  getSocket,
  connectToTicket,
  disconnectFromTicket,
} from "@/lib/socketClient";

const validationSchema = Yup.object().shape({
  message: Yup.string()
    .required("Message is required")
    .min(3, "Message must be at least 3 characters"),
});

const SupportUserChat = ({ data }: any) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // useRef so socket handlers always read the latest user.id without stale closure
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [socketStatus, setSocketStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    fetchTicketDetails();
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!data?.ticketId) return;
    const socket = getSocket();
    connectToTicket(data.ticketId);

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
      console.log("USER RECEIVED SOCKET MESSAGE:", data);

      const newMsg = data?.message;
      if (!newMsg) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    };

    const handleStatusUpdated = (statusData: any) => {
      setTicket((prev: any) =>
        prev ? { ...prev, status: statusData.status } : prev,
      );
    };

    socket.on("new:message", handleNewMessage);
    socket.on("status:updated", handleStatusUpdated);

    // If socket is already connected, trigger connect callback manually
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      disconnectFromTicket(data.ticketId);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("new:message", handleNewMessage);
      socket.off("status:updated", handleStatusUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.ticketId]);

  const fetchTicketDetails = () => {
    setIsLoading(true);
    TicketList({ ticketId: data.ticketId })
      .then((res) => {
        let ticketData = res.data[0];
        setTicket({
          _id: ticketData._id,
          category: ticketData.category,
          subject: ticketData.subject,
          description: ticketData.description,
          ticketNumber: ticketData.ticketNumber,
          status: ticketData.status,
          priority: ticketData.priority || "medium",
          user: ticketData.user,
          createdAt: ticketData.createdAt,
          updatedAt: ticketData.updatedAt,
        });
        setMessages(ticketData.message ?? []);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Failed to get details. Please try again.");
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Determine if message is from current viewer
  const isCurrentUserMessage = (message: any) => {
    return message.replyBy._id === user?.id;
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-slate-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
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
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const emitNewMessage = (ticketId: string, msg: any) => {
    const socket = getSocket();
    socket.emit("send:message", { ticketId, message: msg });
  };

  const emitStatusChange = (ticketId: string, status: string) => {
    const socket = getSocket();
    socket.emit("status:changed", { ticketId, status });
  };

  const handleFormSubmit = (values: any, { resetForm }: any) => {
    if (!values.message.trim()) return;

    setIsTyping(true);
    setIsSubmitting(true);

    TicketUpdate({
      ticketId: ticket._id,
      status: ticket.status,
      ticketStatus: ticket.status,
      text: values.message.trim(),
    })
      .then((res) => {
        const serverMsgs = res.data.message ?? [];
        setTicket({
          ...res.data,
          user: ticket.user,
        });
        setMessages((prev) => {
          const merged = [...prev];
          for (const m of serverMsgs) {
            if (!merged.some((x) => x._id === m._id)) merged.push(m);
          }
          return merged;
        });
        const newMsg =
          serverMsgs.length > 0 ? serverMsgs[serverMsgs.length - 1] : null;
        if (newMsg) emitNewMessage(ticket._id, newMsg);
        setIsSubmitting(false);
        setIsTyping(false);
        resetForm();
      })
      .catch((err) => {
        setIsSubmitting(false);
        setIsTyping(false);
        toast.error(err.message || "Failed to send message. Please try again.");
      });
  };

  const closeTicket = () => {
    setIsLoading(true);
    TicketUpdate({
      ticketId: ticket._id,
      status: "closed",
      ticketStatus: "closed",
    })
      .then((res) => {
        setTicket({
          ...res.data,
          user: ticket.user,
        });
        setMessages(res.data.message ?? []);
        emitStatusChange(ticket._id, "closed");
        toast.success("Ticket closed successfully");
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(
          err.message || "Failed to update ticket. Please try again.",
        );
      });
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  if (isLoading) {
    return <CustomLoader message="Loading conversation..." />;
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ticket not found
          </h2>
          <p className="text-gray-600">
            The requested ticket could not be loaded.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 md:py-8">
      <div className="container mx-auto px-2 md:px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 p-3 bg-white rounded-xl shadow-sm">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-2 md:mr-4 hover:bg-gray-100"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Back to Tickets</span>
            </Button>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Support Ticket
              </h1>
              <div className="flex items-center space-x-1.5 mt-1 md:mt-0">
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
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden flex items-center"
          >
            {showSidebar ? (
              <X className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="ml-2">Details</span>
          </Button>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-6">
          {/* Ticket Info Sidebar */}
          {showSidebar && (
            <div className="lg:w-80 space-y-4 md:space-y-6">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Ticket Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Status
                    </p>
                    <Badge className={getStatusColor(ticket.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(ticket.status)}
                        <span className="capitalize">
                          {ticket.status.replace("-", " ")}
                        </span>
                      </div>
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Priority
                    </p>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span className="capitalize">{ticket.priority}</span>
                      </div>
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Category
                    </p>
                    <Badge className={getCategoryColor(ticket.category)}>
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span className="capitalize">{ticket.category}</span>
                      </div>
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Ticket Number
                    </p>
                    <p className="text-gray-900 font-mono bg-gray-100 p-2 rounded-lg text-sm">
                      #{ticket.ticketNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Created By
                    </p>
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {getUserInitials(ticket.user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ticket.user.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {ticket.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Created
                    </p>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Last Updated
                    </p>
                    <p className="text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>

                  {ticket.status !== "resolved" &&
                    ticket.status !== "closed" && (
                      <Button
                        onClick={closeTicket}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Close Ticket
                      </Button>
                    )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Main Content */}
          <div className="flex-1">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm h-full flex flex-col rounded-2xl">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg md:text-xl">
                        {ticket.subject}
                      </CardTitle>
                      <Badge
                        className={
                          getStatusColor(ticket.status) + " hidden md:flex"
                        }
                      >
                        {ticket.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 p-3 md:p-4 overflow-y-auto max-h-96 md:max-h-[500px] bg-gray-50">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      messages.map((msg: any, index: number) => {
                        const isMe = isCurrentUserMessage(msg);
                        return (
                          <div key={msg._id} className="space-y-2">
                            {/* Date separator if needed */}
                            {index === 0 ||
                            formatDate(msg.replyAt) !==
                              formatDate(messages[index - 1].replyAt) ? (
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
                                } items-start space-x-3 max-w-[85%] sm:max-w-[75%] lg:max-w-md`}
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
                                      <span>{msg.replyBy.name}</span>
                                    </span>
                                    <span>•</span>
                                    <span>{formatTime(msg.replyAt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-md border border-gray-100">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                              <Headphones className="h-3 w-3" />
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Reply Form */}
                <div className="p-3 md:p-4 border-t bg-white rounded-b-2xl">
                  {ticket.status === "resolved" ||
                  ticket.status === "closed" ? (
                    <div className="text-center py-6 bg-green-50 rounded-xl border border-green-200">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Ticket{" "}
                        {ticket.status === "closed" ? "Closed" : "Resolved"}{" "}
                        Successfully
                      </h3>
                      <p className="text-green-700 text-sm">
                        This conversation has been marked as {ticket.status}. If
                        you have further issues, please create a new support
                        ticket.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Formik
                        initialValues={{ message: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleFormSubmit}
                      >
                        {({ handleSubmit, values, isValid }) => (
                          <Form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                              <Field
                                name="message"
                                component={FormikTextArea}
                                placeholder="Type your message here..."
                                rows={3}
                                className="resize-none rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                              />
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
                                  <span>
                                    Support typically replies within 2 hours
                                  </span>
                                </div>
                                <Button
                                  type="submit"
                                  disabled={
                                    isSubmitting ||
                                    !values.message.trim() ||
                                    !isValid
                                  }
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      Send Reply
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>

                      <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span>Please be respectful in your communication</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Rating prompt for resolved/closed tickets */}
            {(ticket.status === "resolved" || ticket.status === "closed") && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 mt-4 md:mt-6 rounded-2xl">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Star className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          How was your support experience?
                        </h3>
                        <p className="text-sm text-gray-600">
                          Please rate your interaction with our support team
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white border-gray-300 hover:bg-amber-100 hover:text-amber-500 transition-colors"
                        >
                          <Star className="h-5 w-5" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportUserChat;
