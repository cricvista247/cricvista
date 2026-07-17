"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  User,
  Shield,
  CheckCircle,
  Sparkles,
  Clock,
  ThumbsUp,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Radix + Tailwind button
import { Textarea } from "@/components/ui/textarea"; // Radix + Tailwind textarea
import axios from "axios";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { TicketList, TicketUpdate } from "@/app/MainService";
import toast from "react-hot-toast";
import { FormikTextArea } from "./CustomField";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";

type Message = {
  _id: string;
  text: string;
  replyAt: string;
  replyBy: { name: string };
  fromUser: boolean;
};

const validationSchema = Yup.object().shape({
  message: Yup.string()
    .required("Message is required")
    .min(1, "Message must be at least 3 characters"),
});

const ChatBox = ({ ticketId }: { ticketId: string }) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const [ticket, setTicket] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
    fetchTicketDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTicketDetails = () => {
    TicketList({ ticketId: ticketId })
      .then((res) => {
        setTicket(res.data[0]);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to get details. Please try again.");
      });
  };

  const handleFormSubmit = (values: any, { resetForm }: any) => {
    if (!values.message.trim()) return;

    // setIsTyping(true);
    setIsSubmitting(true);

    TicketUpdate({
      ticketId: ticket._id,
      status: ticket.status,
      ticketStatus: ticket.status,
      text: values.message.trim(),
    })
      .then((res) => {
        setTicket(res.data.message ?? []);
        setIsSubmitting(false);
        // setIsTyping(false);
        resetForm();
        toast.success("Message sent successfully!");
      })
      .catch((err) => {
        setIsSubmitting(false);
        // setIsTyping(false);
        toast.error(err.message || "Failed to send message. Please try again.");
      });
  };

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket]);

  const isUserMessage = (message: any) => {
    return message.replyBy._id === ticket?.user._id;
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
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-100px)] border rounded-2xl bg-white shadow-sm">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {ticket.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          ticket?.message?.map((msg: any, index: number) => {
            const isUser = isUserMessage(msg);
            return (
              <div key={msg._id} className="space-y-2">
                {/* Date separator if needed */}
                {index === 0 ||
                formatDate(msg.replyAt) !==
                  formatDate(ticket?.message[index - 1].replyAt) ? (
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      {formatDate(msg.replyAt)}
                    </span>
                  </div>
                ) : null}

                <div
                  className={`flex ${isUser ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`flex ${
                      isUser ? "flex-row" : "flex-row-reverse"
                    } items-start space-x-3 max-w-xs lg:max-w-md`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUser
                          ? "bg-gradient-to-r from-green-400 to-blue-500"
                          : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`}
                    >
                      {isUser ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Shield className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className="space-y-1">
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isUser
                            ? "bg-gray-100 text-gray-900 rounded-bl-sm"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm"
                        } shadow-sm`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>

                      {/* Message Info */}
                      <div
                        className={`flex items-center space-x-2 text-xs ${
                          isUser ? "text-gray-500" : "text-gray-400"
                        } ${isUser ? "ml-0" : "mr-0 justify-end"}`}
                      >
                        <span className="flex items-center space-x-1">
                          {isUser ? (
                            <UserCheck className="h-3 w-3" />
                          ) : (
                            <Shield className="h-3 w-3" />
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t bg-white">
        {ticket.status === "resolved" ? (
          <div className="text-center py-6 bg-green-50 rounded-xl border border-green-200">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Ticket Resolved Successfully
            </h3>
            <p className="text-green-700 text-sm">
              This conversation has been marked as resolved. If you have further
              issues, please create a new support ticket.
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
                        <span>Support typically replies within 2 hours</span>
                      </div>
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting || !values.message.trim() || !isValid
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
  );
};

export default ChatBox;
