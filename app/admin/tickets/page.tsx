"use client";

import React, { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { setTickets, updateTicketStatus } from "@/store/slices/adminSlice";
import AdminLayout from "@/components/admin/AdminLayout";
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
  Ticket,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Flag,
  Plus,
  Mail,
  Phone,
  MapPin,
  Tag,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, Form, Formik } from "formik";
import {
  FormikSelectField,
  FormikTextArea,
  FormikTextInput,
} from "@/components/CustomField";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { TicketCreate, TicketList } from "@/app/MainService";
import CustomLoader from "@/components/ui/CustomLoader";

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

const AdminTicketsPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [tickets, setTickets] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    fetchTicketList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTicketList = () => {
    setIsLoading(true);
    TicketList({})
      .then((res) => {
        const prepareData = res.data.map((item: any) => {
          let ticketUnread = item.message.filter(
            (elm: any) => elm.isRead === false && elm.replyBy._id !== user?.id,
          );
          return { ...item, ticketUnread: ticketUnread.length ?? 0 };
        });

        setTickets(prepareData);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || "Failed to get details. Please try again.");
      });
  };

  const handleStatusChange = (
    ticketId: string,
    newStatus: string,
    assignedTo?: string,
  ) => {
    dispatch(
      updateTicketStatus({ id: ticketId, status: newStatus, assignedTo }),
    );
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const handleViewTicket = (ticketId: string) => {
    router.push(`/admin/tickets/${ticketId}`);
  };

  const handleFormSubmit = (values: any) => {
    setIsLoading(true);
    const payload = {
      subject: values.subject,
      description: values.description,
      category: values.category,
      status: "open",
      priority: values.priority || "medium",
      username: values.username,
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

  const filteredTickets = tickets.filter((ticket: any) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeTab === "all" || ticket.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const openTickets = tickets.filter((t: any) => t.status === "open").length;
  const inProgressTickets = tickets.filter(
    (t: any) => t.status === "in-progress",
  ).length;
  const resolvedTickets = tickets.filter(
    (t: any) => t.status === "resolved",
  ).length;
  const closedTickets = tickets.filter(
    (t: any) => t.status === "closed",
  ).length;

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
    <AdminLayout>
      {isLoading && <CustomLoader message="Ticket Loading" />}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Ticket Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage customer support tickets and issues
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Dialog
              open={isCreateTicketOpen}
              onOpenChange={setIsCreateTicketOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
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
                    priority: "medium",
                    username: "",
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Tickets
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Ticket className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Open</p>
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50">
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
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

          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Closed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {closedTickets}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-slate-100">
                  <CheckCircle className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by ticket ID, user, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-blue-600" />
              <span>All Tickets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto sm:overflow-visible scrollbar-hide">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="sm:grid sm:grid-cols-5 mb-6 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                    value="all"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    All ({tickets.length})
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
                  <TabsTrigger
                    value="closed"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Closed ({closedTickets})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredTickets.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket: any) => (
                        <div
                          key={ticket._id}
                          className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="p-3 bg-blue-50 rounded-lg mt-1">
                                <MessageSquare className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                  <h3 className="font-semibold text-gray-900 text-lg">
                                    {ticket.subject}
                                  </h3>
                                  <Badge
                                    className={getStatusColor(ticket.status)}
                                  >
                                    <div className="flex items-center space-x-1">
                                      {getStatusIcon(ticket.status)}
                                      <span className="capitalize">
                                        {ticket.status.replace("-", " ")}
                                      </span>
                                    </div>
                                  </Badge>
                                  <Badge
                                    className={getPriorityColor(
                                      ticket.priority,
                                    )}
                                  >
                                    <div className="flex items-center space-x-1">
                                      <Zap className="h-3 w-3" />
                                      <span className="capitalize">
                                        {ticket.priority}
                                      </span>
                                    </div>
                                  </Badge>
                                  <Badge
                                    className={getCategoryColor(
                                      ticket.category,
                                    )}
                                  >
                                    <div className="flex items-center space-x-1">
                                      <Tag className="h-3 w-3" />
                                      <span className="capitalize">
                                        {ticket.category}
                                      </span>
                                    </div>
                                  </Badge>
                                </div>
                                <p className="text-gray-700 mb-4 line-clamp-2">
                                  {ticket.description}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-2">
                                    <Ticket className="h-4 w-4 text-blue-600" />
                                    <span className="font-mono">
                                      #{ticket.ticketNumber}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <span>
                                      {ticket?.user?.name} (@
                                      {ticket?.user?.username})
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span>{formatDate(ticket.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <span>
                                      {ticket.assignedTo || "Unassigned"}
                                    </span>
                                  </div>
                                </div>
                                {ticket.ticketUnread !== 0 && (
                                  <div className="mt-3 text-sm text-blue-600 flex items-center">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    {ticket.ticketUnread} message
                                    {ticket.ticketUnread !== 1 ? "s" : ""}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 lg:mt-0 flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewTicket(ticket._id)}
                                className="rounded-lg"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="rounded-xl"
                                >
                                  {ticket.status === "open" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          ticket._id,
                                          "in-progress",
                                          "Admin Support",
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Start Working
                                    </DropdownMenuItem>
                                  )}
                                  {ticket.status === "in-progress" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          ticket._id,
                                          "resolved",
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Resolved
                                    </DropdownMenuItem>
                                  )}
                                  {ticket.status === "resolved" && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(
                                            ticket._id,
                                            "closed",
                                          )
                                        }
                                        className="cursor-pointer"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Close Ticket
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(ticket._id, "open")
                                        }
                                        className="cursor-pointer"
                                      >
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Reopen Ticket
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {ticket.status === "closed" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(ticket._id, "open")
                                      }
                                      className="cursor-pointer"
                                    >
                                      <AlertCircle className="h-4 w-4 mr-2" />
                                      Reopen Ticket
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem className="cursor-pointer">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Add Comment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No tickets found
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No tickets match the selected filter"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTicketsPage;
