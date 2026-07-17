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
    (state: RootState) => state.auth
  );

  const router = useRouter();

  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [supportListData, setSupportListData] = useState<any>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    fetchTicketList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTicketList = () => {
    setIsLoading(true);
    TicketList({ userId: user?.id })
      .then((res) => {
        const prepareData = res.data.map((item: any) => {
          let ticketUnread = item.message.filter(
            (elm: any) => elm.isRead === false && elm.replyBy._id !== user?.id
          );
          return { ...item, ticketUnread: ticketUnread.length ?? 0 };
        });
        setSupportListData(prepareData);

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Failed to get details. Please try again.");
      });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "payment":
        return <Zap className="h-4 w-4 text-purple-600" />;
      case "technical":
        return <Zap className="h-4 w-4 text-blue-600" />;
      case "account":
        return <User className="h-4 w-4 text-indigo-600" />;
      case "prediction":
        return <BookOpen className="h-4 w-4 text-amber-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const hasSupportReplies = (ticket: any) => {
    return (
      ticket.message &&
      ticket.message.some(
        (msg: any) => msg.replyBy && msg.replyBy._id !== ticket.user._id
      )
    );
  };

  const getLatestSupportReply = (ticket: any) => {
    if (!ticket.message) return null;

    const supportReplies = ticket.message.filter(
      (msg: any) => msg.replyBy && msg.replyBy._id !== ticket.user._id
    );

    return supportReplies.length > 0
      ? supportReplies[supportReplies.length - 1]
      : null;
  };

  const filteredTickets = supportListData.filter((ticket: any) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeTab === "all" || ticket.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const openTickets = supportListData.filter(
    (c: any) => c.status === "open"
  ).length;
  const inProgressTickets = supportListData.filter(
    (c: any) => c.status === "in-progress"
  ).length;
  const resolvedTickets = supportListData.filter(
    (c: any) => c.status === "resolved"
  ).length;

  const handelFormSubmit = (values: any) => {
    setIsLoading(true);
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
        setIsLoading(false);
        setIsCreateTicketOpen(false);
        fetchTicketList();
      })
      .catch((err) => {
        setIsLoading(false);
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

  return (
    <>
      {isLoading && <CustomLoader message="Loading" />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Support Center
                  </h1>
                </div>
                <p className="text-lg text-gray-600 ml-11">
                  Get help with your CricVista experience
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Dialog
                  open={isCreateTicketOpen}
                  onOpenChange={setIsCreateTicketOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md rounded-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
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
                            {/* Title */}
                            <div>
                              <Field
                                label="Subject"
                                component={FormikTextInput}
                                name="subject"
                                placeholder="Brief description of your issue"
                              />
                            </div>

                            {/* Category */}
                            <div>
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

                            {/* Description */}
                            <div>
                              <Field
                                label="Description"
                                component={FormikTextArea}
                                name="description"
                                rows={4}
                                placeholder="Please provide detailed information about your issue..."
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
                              {isLoading ? "Creating..." : "Create Ticket"}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Open Tickets
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {openTickets}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-red-100">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {inProgressTickets}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Resolved
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {resolvedTickets}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Avg Response
                    </p>
                    <p className="text-2xl font-bold text-gray-900">2h</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tickets */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Tickets */}
              {isAuthenticated ? (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                      <Ticket className="h-5 w-5 text-blue-600" />
                      <span>My Support Tickets</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search tickets by subject or ticket number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </Button>
                    </div>
                    <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
                      <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <TabsList className="sm:grid sm:grid-cols-4 mb-6 bg-gray-100 p-1 rounded-lg">
                          <TabsTrigger
                            value="all"
                            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            All ({supportListData.length})
                          </TabsTrigger>
                          <TabsTrigger
                            value="open"
                            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            Open ({openTickets})
                          </TabsTrigger>
                          <TabsTrigger
                            value="in-progress"
                            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            In Progress ({inProgressTickets})
                          </TabsTrigger>
                          <TabsTrigger
                            value="resolved"
                            className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            Resolved ({resolvedTickets})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="space-y-4">
                          {filteredTickets.length > 0 ? (
                            <div className="space-y-4">
                              {filteredTickets.map((ticket: any) => {
                                const supportReplied =
                                  hasSupportReplies(ticket);
                                const latestSupportReply =
                                  getLatestSupportReply(ticket);

                                return (
                                  <div
                                    key={ticket._id}
                                    className="cursor-pointer p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                                    onClick={() =>
                                      router.push(`/support/${ticket._id}`)
                                    }
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-blue-50 rounded-lg mt-1">
                                          {getCategoryIcon(ticket.category)}
                                        </div>
                                        <div className="flex-1">
                                          <h3 className="font-semibold text-gray-900 text-lg">
                                            {ticket.subject}
                                          </h3>
                                          <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <Badge
                                              className={getStatusColor(
                                                ticket.status
                                              )}
                                              variant="outline"
                                            >
                                              <div className="flex items-center space-x-1">
                                                {getStatusIcon(ticket.status)}
                                                <span className="capitalize">
                                                  {ticket.status.replace(
                                                    "-",
                                                    " "
                                                  )}
                                                </span>
                                              </div>
                                            </Badge>
                                            <Badge
                                              className={getCategoryColor(
                                                ticket.category
                                              )}
                                              variant="outline"
                                            >
                                              <div className="flex items-center space-x-1">
                                                <Tag className="h-3 w-3" />
                                                <span className="capitalize">
                                                  {ticket.category}
                                                </span>
                                              </div>
                                            </Badge>
                                            <span className="text-sm text-gray-500">
                                              #{ticket.ticketNumber}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-2" />
                                    </div>

                                    <p className="text-gray-700 mb-4 line-clamp-2">
                                      {ticket.description}
                                    </p>

                                    {/* Support Reply Indicator */}
                                    {supportReplied && (
                                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center mb-2">
                                          <div className="p-1 bg-blue-100 rounded-full mr-2">
                                            <Sparkles className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <span className="text-sm font-medium text-blue-800">
                                            Support has replied to your ticket
                                          </span>
                                        </div>
                                        {latestSupportReply && (
                                          <div className="pl-6">
                                            <p className="text-sm text-gray-700 line-clamp-1">
                                              {latestSupportReply.text}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                              {formatDate(
                                                latestSupportReply.replyAt
                                              )}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                      <div className="flex items-center space-x-4">
                                        <span className="flex items-center">
                                          <Calendar className="h-4 w-4 mr-1" />
                                          Created:{" "}
                                          {formatDate(ticket.createdAt)}
                                        </span>
                                        <span className="flex items-center">
                                          <Clock className="h-4 w-4 mr-1" />
                                          Updated:{" "}
                                          {formatDate(ticket.updatedAt)}
                                        </span>
                                      </div>
                                      {ticket.ticketUnread !== 0 && (
                                        <div className="flex items-center">
                                          <MessageCircle className="h-4 w-4 mr-1" />
                                          {ticket.ticketUnread} messages
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Ticket className="h-8 w-8 text-blue-600" />
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No tickets found
                              </h3>
                              <p className="text-gray-600 mb-6">
                                {searchTerm
                                  ? "Try adjusting your search criteria"
                                  : "You haven't created any support tickets yet"}
                              </p>
                              {!searchTerm && (
                                <Button
                                  onClick={() => setIsCreateTicketOpen(true)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Create Your First Ticket
                                </Button>
                              )}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Login Required
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Please login to view and manage your support tickets
                    </p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <a href="/auth/login">Login to Continue</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p className="text-gray-600">
                        {process.env.NEXT_PUBLIC_EMAIL ||
                          "support@cricvista.com"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone Support</p>
                      <p className="text-gray-600">
                        {process.env.NEXT_PUBLIC_MOBILE || "+1 (555) 123-4567"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Office Address
                      </p>
                      <p className="text-gray-600">
                        Kolkata, West Bengal, India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span>Support Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium text-gray-900">
                        9:00 AM - 6:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-gray-900">
                        10:00 AM - 4:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium text-gray-900">Closed</span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Urgent issues are handled 24/7
                        for Pro and Elite users.
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
