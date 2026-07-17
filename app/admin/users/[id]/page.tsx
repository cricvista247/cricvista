/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { UserDetails } from "@/components/UserDetails";

const DashboardPage = () => {
  const params = useParams();

  return (
    <>
      <AdminLayout>
        <UserDetails userId={params.id} />
      </AdminLayout>
    </>
  );
};

export default DashboardPage;
