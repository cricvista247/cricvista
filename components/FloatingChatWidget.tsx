"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MessageCircle, X, Send, Loader2, Minus } from "lucide-react";
import { TicketCreate, TicketList, TicketUpdate } from "@/app/MainService";
import { getSocket, connectToTicket, disconnectFromTicket } from "@/lib/socketClient";

interface Message {
  _id: string;
  text: string;
  replyAt: string;
  replyBy: { _id: string; name?: string; username?: string };
}

const FloatingChatWidget = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState<"start" | "chat">("start");
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing open ticket on mount when opened
  useEffect(() => {
    if (!isOpen || !isAuthenticated || !user?.id) return;
    setInitialLoading(true);
    TicketList({ userId: user.id, status: "open|in-progress", limit: 1 })
      .then((res) => {
        const ticket = res.data?.[0];
        if (ticket?._id) {
          setTicketId(ticket._id);
          setMessages(ticket.message || []);
          setView("chat");
        }
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, [isOpen, isAuthenticated, user?.id]);

  // Socket listener — refetch messages on incoming event
  useEffect(() => {
    if (!ticketId) return;
    connectToTicket(ticketId);
    const socket = getSocket();

    const handleNewMessage = () => {
      TicketList({ ticketId })
        .then((res) => {
          const ticket = res.data?.[0];
          if (ticket?.message) setMessages(ticket.message);
        })
        .catch(() => {});
    };

    socket.on("new:message", handleNewMessage);

    return () => {
      socket.off("new:message", handleNewMessage);
      disconnectFromTicket(ticketId);
    };
  }, [ticketId]);

  // Start new chat
  const handleStartChat = async () => {
    if (!subject.trim() || !message.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await TicketCreate({
        subject: subject.trim(),
        description: message.trim(),
        category,
        status: "open",
        priority: "low",
      });
      const ticket = res.data;
      if (ticket?._id) {
        setTicketId(ticket._id);
        setMessages(ticket.message || []);
        setView("chat");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create ticket");
    } finally {
      setSending(false);
    }
  };

  // Send reply in existing chat
  const handleSendReply = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    const text = message.trim();
    let resolvedTicketId = ticketId;
    try {
      const res = ticketId
        ? await TicketUpdate({ ticketId, text })
        : null;
      if (res?.data?.message) {
        setMessages(res.data.message);
        setMessage("");
        resolvedTicketId = res.data._id || ticketId;
      } else {
        // No active ticket — create a new one
        const createRes = await TicketCreate({
          subject: text.length > 50 ? text.substring(0, 47) + "..." : text,
          description: text,
          category,
          status: "open",
          priority: "low",
        });
        const ticket = createRes.data;
        if (ticket?._id) {
          resolvedTicketId = ticket._id;
          setTicketId(ticket._id);
          setMessages(ticket.message || []);
          setView("chat");
          setMessage("");
        }
      }
      const socket = getSocket();
      if (socket.connected && resolvedTicketId) {
        if (resolvedTicketId !== ticketId) {
          connectToTicket(resolvedTicketId);
        }
        socket.emit("send:message", {
          ticketId: resolvedTicketId,
          message: text,
        });
      }
    } catch {
      // keep message in input on failure
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (view === "start") handleStartChat();
      else handleSendReply();
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
        aria-label="Chat with support"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Dialog */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
            isMinimized ? "h-14" : "h-[520px] max-h-[80vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold text-sm">Support Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Body */}
              <div className="flex-1 h-[calc(100%-112px)] overflow-y-auto bg-gray-50 p-4">
                {initialLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : view === "start" ? (
                  /* Start Chat View */
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        How can we help?
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Send us a message and we&apos;ll reply shortly
                      </p>
                    </div>
                    <select
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); setError(""); }}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="general">General</option>
                      <option value="payment">Payment</option>
                      <option value="prediction">Analytics</option>
                      <option value="technical">Technical</option>
                      <option value="account">Account</option>
                    </select>
                    <input
                      ref={inputRef}
                      type="text"
                      value={subject}
                      onChange={(e) => { setSubject(e.target.value); setError(""); }}
                      placeholder="Subject"
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      onKeyDown={handleKeyDown}
                    />
                    <textarea
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); setError(""); }}
                      placeholder="Describe your issue... (min. 10 characters)"
                      rows={3}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                      onKeyDown={handleKeyDown}
                    />
                    {error && (
                      <p className="text-xs text-red-500">{error}</p>
                    )}
                    <button
                      onClick={handleStartChat}
                      disabled={
                        sending || !subject.trim() || !message.trim()
                      }
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Start Chat
                    </button>
                  </div>
                ) : (
                  /* Chat View */
                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <p className="text-center text-xs text-gray-400 py-8">
                        No messages yet
                      </p>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.replyBy?._id === user?.id;
                        return (
                          <div
                            key={msg._id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                                isMe
                                  ? "bg-blue-600 text-white rounded-br-sm"
                                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                              }`}
                            >
                              <p className="text-xs opacity-70 mb-0.5">
                                {isMe
                                  ? "You"
                                  : msg.replyBy?.name ||
                                    msg.replyBy?.username ||
                                    "Support"}
                              </p>
                              <p className="text-sm leading-relaxed">
                                {msg.text}
                              </p>
                              <p
                                className={`text-[10px] mt-1 ${
                                  isMe ? "text-blue-200" : "text-gray-400"
                                }`}
                              >
                                {new Date(msg.replyAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Chat Input (only shown in chat view) */}
              {view === "chat" && (
                <div className="border-t border-gray-200 p-3 bg-white flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={sending || !message.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;
