"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/store";
import SupportUserChat from "@/components/SupportUserChat";

const SupportChatPage = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <SupportUserChat data={{ ticketId: params.id }} />
    </>
  );
};

export default SupportChatPage;
