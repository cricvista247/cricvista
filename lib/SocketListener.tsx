"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSocket, connectUserSocket } from "@/lib/socketClient";
import { updateCredits } from "@/store/slices/authSlice";
import { addNotification } from "@/store/slices/notificationSlice";

export default function SocketListener() {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    connectUserSocket(user.id);

    const socket = getSocket();

    const handleCreditsUpdated = (data: { credits: number }) => {
      console.log("Credits Updated:", data);
      dispatch(updateCredits(data.credits));
    };

    const handleNotificationNew = (data: { notification: any }) => {
      if (data?.notification) {
        dispatch(addNotification(data.notification));
      }
    };

    socket.on("credits:updated", handleCreditsUpdated);
    socket.on("notification:new", handleNotificationNew);

    return () => {
      socket.off("credits:updated", handleCreditsUpdated);
      socket.off("notification:new", handleNotificationNew);
    };
  }, [dispatch, isAuthenticated, user?.id]);

  return null;
}
