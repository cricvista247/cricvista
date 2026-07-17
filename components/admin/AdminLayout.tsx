"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import AdminSidebar from "./AdminSidebar";
import CustomLoader from "../ui/CustomLoader";
import { logout } from "@/store/slices/authSlice";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      dispatch(logout());
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <>
      {!isAuthenticated || user?.role !== "admin" ? (
        <CustomLoader message="Checking permissions" />
      ) : (
        <div className="min-h-screen bg-gray-50 flex">
          {/* Desktop Sidebar */}
          <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-gray-900 shadow-lg z-30">
            <AdminSidebar />
          </div>

          {/* Mobile Sidebar (Drawer) */}
          {isMobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
                onClick={closeMobileSidebar}
              />
              {/* Sidebar Drawer */}
              <div className="fixed left-0 top-0 z-50 h-full w-64 bg-gray-900 shadow-lg md:hidden transition-transform">
                <AdminSidebar />
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1 md:ml-64 w-full">
            {/* Mobile Topbar */}
            <div className="md:hidden flex items-center justify-between p-4 shadow-sm bg-white sticky top-0 z-20">
              <button onClick={toggleMobileSidebar}>
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
              <h1 className="text-lg font-semibold">Admin Panel</h1>
              <div className="w-6" /> {/* Spacer for symmetry */}
            </div>

            <main className="min-h-screen overflow-y-auto">
              <div className="p-4 md:p-8">{children}</div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLayout;
