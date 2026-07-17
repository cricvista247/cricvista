/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserDetails } from "@/components/UserDetails";

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <UserDetails userId={user?.id} />
    </>
  );
};

export default DashboardPage;
