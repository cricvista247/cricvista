/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Send,
  Ticket,
  Users,
  BookOpen,
  Zap,
  ChevronRight,
  User,
  Eye,
  Calendar,
  Tag,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  Copy,
  Check,
  HeadphonesIcon,
  Star,
  Shield,
  LifeBuoy,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { Field, Form, Formik } from "formik";
import {
  FormikSelectField,
  FormikTextArea,
  FormikTextInput,
} from "@/components/CustomField";
import * as Yup from "yup";
import { TicketCreate, TicketList, TicketUpdate } from "../MainService";
import CustomLoader from "@/components/ui/CustomLoader";

const validationSchema = Yup.object().shape({
  subject: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  category: Yup.string().required("Category is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
});

const SupportPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const router = useRouter();

  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [supportListData, setSupportListData] = useState<any>([]);

  useEffect(() => {
    if (isAuthenticated) fetchTicketList();
  }, [isAuthenticated]);

  const fetchTicketList = () => {
    setIsLoading(true);
    TicketList({ userId: user?.id })
      .then((res) => {
        const prepareData = res.data.map((item: any) => {
          let ticketUnread = item.message.filter(
            (elm: any) => elm.isRead === false && elm.replyBy._id !== user?.id,
          );
          return { ...item, ticketUnread: ticketUnread.length ?? 0 };
        });
        setSupportListData(prepareData);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-slate-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-50 text-red-700 border-red-200";
      case "in-progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200";
      case "closed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "payment":
        return <Zap className="h-4 w-4 text-purple-500" />;
      case "technical":
        return <Zap className="h-4 w-4 text-blue-500" />;
      case "account":
        return <User className="h-4 w-4 text-indigo-500" />;
      case "prediction":
        return <BookOpen className="h-4 w-4 text-amber-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "technical":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "account":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "prediction":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const hasSupportReplies = (ticket: any) => {
    return (
      ticket.message &&
      ticket.message.some(
        (msg: any) => msg.replyBy && msg.replyBy._id !== ticket.user._id,
      )
    );
  };

  const getLatestSupportReply = (ticket: any) => {
    if (!ticket.message) return null;
    const supportReplies = ticket.message.filter(
      (msg: any) => msg.replyBy && msg.replyBy._id !== ticket.user._id,
    );
    return supportReplies.length > 0
      ? supportReplies[supportReplies.length - 1]
      : null;
  };

  const filteredTickets = supportListData.filter((ticket: any) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "open" &&
        (ticket.status === "open" || ticket.status === "in-progress")) ||
      (activeTab === "close" &&
        (ticket.status === "resolved" || ticket.status === "closed"));
    return matchesSearch && matchesStatus;
  });

  const openTickets = supportListData.filter(
    (c: any) => c.status === "open" || c.status === "in-progress",
  ).length;
  const closeTickets = supportListData.filter(
    (c: any) => c.status === "resolved" || c.status === "closed",
  ).length;

  const handelFormSubmit = (values: any) => {
    setIsSubmitting(true);
    const payload = {
      subject: values.subject,
      description: values.description,
      category: values.category,
      status: "open",
      priority: "low",
    };
    TicketCreate(payload)
      .then((res) => {
        toast.success(res.message);
        setIsSubmitting(false);
        setIsCreateTicketOpen(false);
        fetchTicketList();
      })
      .catch((err) => {
        setIsSubmitting(false);
        toast.error(err.message || "Failed to save details. Please try again.");
      });
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <>
      {isLoading && <CustomLoader message="Loading" />}
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left max-w-xl">
                <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-1.5 backdrop-blur-sm">
                  <HeadphonesIcon className="h-3.5 w-3.5 mr-1.5" />
                  24/7 Support Available
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                  How can we <span className="text-blue-200">help you?</span>
                </h1>
                <p className="text-blue-100 text-base md:text-lg max-w-md leading-relaxed">
                  Get quick answers to your questions. Create a ticket and our
                  support team will respond within minutes.
                </p>
                <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-semibold h-12 px-6 shadow-xl"
                    onClick={() =>
                      document
                        .getElementById("tickets-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    View My Tickets
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-blue-700 hover:bg-white/10 h-12 px-6"
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/auth/login");
                        return;
                      }
                      setIsCreateTicketOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket
                  </Button>
                </div>
              </div>

              {/* Quick Contact Cards */}
              <div className="w-full max-w-sm space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-400/20 p-2 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-green-300" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider">
                          WhatsApp
                        </p>
                        <p className="text-sm font-bold text-white">
                          8981374643
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-white/10 text-blue-200 shrink-0"
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
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-400/20 p-2 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider">
                          Email
                        </p>
                        <p className="text-sm font-bold text-white">
                          cricvista247@gmail.com
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-white/10 text-blue-200 shrink-0"
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
              </div>
            </div>
          </div>
        </div>

        <div
          className="max-w-6xl mx-auto px-4 py-8 md:py-12"
          id="tickets-section"
        >
          {/* Stats Cards */}
          {isAuthenticated && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Tickets",
                  value: supportListData.length,
                  icon: Ticket,
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
                {
                  label: "Open",
                  value: openTickets,
                  icon: AlertCircle,
                  color: "text-red-500",
                  bg: "bg-red-50",
                },
                {
                  label: "Closed",
                  value: closeTickets,
                  icon: CheckCircle,
                  color: "text-green-500",
                  bg: "bg-green-50",
                },
                {
                  label: "Avg Response",
                  value: "2h",
                  icon: Zap,
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
              ].map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <Card key={stat.label} className="border-gray-100 shadow-sm">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-0.5">
                            {stat.label}
                          </p>
                          <p className="text-xl md:text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                        <div className={`${stat.bg} p-2.5 rounded-lg`}>
                          <StatIcon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tickets Section */}
              {isAuthenticated ? (
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-blue-600" />
                        My Support Tickets
                      </CardTitle>
                      <Dialog
                        open={isCreateTicketOpen}
                        onOpenChange={setIsCreateTicketOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                          >
                            <Plus className="h-4 w-4 mr-1.5" />
                            New Ticket
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center text-lg">
                              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                              Create Support Ticket
                            </DialogTitle>
                          </DialogHeader>
                          <Formik
                            initialValues={{
                              subject: "",
                              description: "",
                              category: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handelFormSubmit}
                          >
                            {({ handleSubmit }) => (
                              <Form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-4">
                                  <Field
                                    label="Subject"
                                    component={FormikTextInput}
                                    name="subject"
                                    placeholder="Brief description of your issue"
                                  />
                                  <Field
                                    label="Category"
                                    name="category"
                                    component={FormikSelectField}
                                    options={[
                                      { label: "General", value: "general" },
                                      { label: "Payment", value: "payment" },
                                      {
                                        label: "Prediction",
                                        value: "prediction",
                                      },
                                      {
                                        label: "Technical",
                                        value: "technical",
                                      },
                                      { label: "Account", value: "account" },
                                    ]}
                                  />
                                  <Field
                                    label="Description"
                                    component={FormikTextArea}
                                    name="description"
                                    rows={4}
                                    placeholder="Please provide detailed information about your issue..."
                                  />
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
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    {isSubmitting
                                      ? "Creating..."
                                      : "Create Ticket"}
                                  </Button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-5">
                    <div className="flex flex-col md:flex-row gap-4 mb-5">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search tickets by subject or ticket number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 h-10 text-sm"
                        />
                      </div>
                    </div>

                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="w-full sm:w-auto grid grid-cols-2 bg-gray-100 p-1 rounded-lg mb-5 max-w-[200px]">
                        <TabsTrigger
                          value="open"
                          className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                        >
                          Open ({openTickets})
                        </TabsTrigger>
                        <TabsTrigger
                          value="close"
                          className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                        >
                          Closed ({closeTickets})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={activeTab} className="space-y-3 mt-0">
                        {filteredTickets.length > 0 ? (
                          filteredTickets.map((ticket: any) => {
                            const supportReplied = hasSupportReplies(ticket);
                            const latestSupportReply =
                              getLatestSupportReply(ticket);
                            return (
                              <div
                                key={ticket._id}
                                className="p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() =>
                                  router.push(`/support/${ticket._id}`)
                                }
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 min-w-0">
                                    <div className="p-2 bg-blue-50 rounded-lg shrink-0 mt-0.5">
                                      {getCategoryIcon(ticket.category)}
                                    </div>
                                    <div className="min-w-0">
                                      <h3 className="font-semibold text-gray-900 text-sm">
                                        {ticket.subject}
                                      </h3>
                                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        <Badge
                                          className={`${getStatusColor(ticket.status)} text-[10px] px-2 py-0`}
                                          variant="outline"
                                        >
                                          <span className="flex items-center gap-1">
                                            {getStatusIcon(ticket.status)}
                                            <span className="capitalize">
                                              {ticket.status.replace("-", " ")}
                                            </span>
                                          </span>
                                        </Badge>
                                        <Badge
                                          className={`${getCategoryColor(ticket.category)} text-[10px] px-2 py-0`}
                                          variant="outline"
                                        >
                                          <span className="capitalize">
                                            {ticket.category}
                                          </span>
                                        </Badge>
                                        <span className="text-[11px] text-muted-foreground">
                                          #{ticket.ticketNumber}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-2" />
                                </div>

                                <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                                  {ticket.description}
                                </p>

                                {supportReplied && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                                      <span className="text-xs font-medium text-blue-700">
                                        Support has replied
                                      </span>
                                    </div>
                                    {latestSupportReply && (
                                      <>
                                        <p className="text-xs text-gray-600 line-clamp-1">
                                          {latestSupportReply.text}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                          {formatDate(
                                            latestSupportReply.replyAt,
                                          )}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground mt-3 pt-3 border-t border-gray-50 gap-1">
                                  <span className="flex items-center gap-1 min-w-0 shrink">
                                    <Calendar className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{formatDate(ticket.createdAt)}</span>
                                  </span>
                                  {ticket.ticketUnread !== 0 && (
                                    <span className="flex items-center gap-1 font-medium text-blue-600 shrink-0">
                                      <MessageCircle className="h-3 w-3" />
                                      {ticket.ticketUnread} unread
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-12">
                            <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Ticket className="h-7 w-7 text-blue-500" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              No tickets found
                            </h3>
                            <p className="text-sm text-muted-foreground mb-5">
                              {searchTerm
                                ? "Try adjusting your search"
                                : "You haven't created any support tickets yet"}
                            </p>
                            {!searchTerm && (
                              <Button
                                size="sm"
                                onClick={() => setIsCreateTicketOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-4 w-4 mr-1.5" />
                                Create First Ticket
                              </Button>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gray-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-7 w-7 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Login Required
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5">
                      Please login to view and manage your support tickets
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <a href="/auth/login">Login to Continue</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Contact Card */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <LifeBuoy className="h-4 w-4 text-blue-600" />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        cricvista247@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        WhatsApp
                      </p>
                      <p className="text-xs font-semibold text-gray-900">
                        8981374643
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <MapPin className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-xs font-semibold text-gray-900">
                        Kolkata, India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex justify-between items-center py-1.5 text-xs">
                    <span className="text-muted-foreground">Mon - Fri</span>
                    <span className="font-medium text-gray-900">
                      9 AM - 6 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 text-xs border-t border-gray-50">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium text-gray-900">
                      10 AM - 4 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 text-xs border-t border-gray-50">
                    <span className="text-muted-foreground">Sunday</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-red-600 border-red-200 bg-red-50 px-2 py-0"
                    >
                      Closed
                    </Badge>
                  </div>
                  <div className="mt-3 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Urgent issues are handled 24/7 via WhatsApp.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Email Tip */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                      <Star className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 mb-1">
                        Pro Tip
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Include your username and order ID in the subject line
                        for faster resolution.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportPage;
