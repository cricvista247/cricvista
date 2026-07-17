"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  ShoppingCart,
  Ticket,
  DollarSign,
  BarChart3,
  Settings,
  Trophy,
  Database,
  Star,
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Subscription",
      href: "/admin/subscription",
      icon: Star,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Tickets",
      href: "/admin/tickets",
      icon: Ticket,
    },
    {
      title: "Finance",
      href: "/admin/finance",
      icon: DollarSign,
    },
    {
      title: "Stats",
      href: "/admin/stats",
      icon: Database,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2 mb-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">CricVista</span>
        </div>
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-gray-400 text-sm">Management Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
