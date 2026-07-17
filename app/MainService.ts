import privateApi from "@/lib/privateAxiosClient";
import publicApi from "@/lib/publicAxiosClient";
import { getHeaders, getHeadersWithToken } from "@/lib/utils";
import moment from "moment";

export const SubscriptionCreate = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/subscription/create",
      payload,
      {
        headers: getHeadersWithToken(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const SubscriptionUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/subscription/update",
      payload,
      {
        headers: getHeadersWithToken(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const SubscriptionList = async () => {
  try {
    const response = await publicApi.get("/api/subscription/list", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const CheckBoostToken = async (id: any) => {
  try {
    const response = await publicApi.post(
      "/api/subscription/boost-token-check",
      { _id: id },
      {
        headers: getHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserLogin = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/sigin", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserRegister = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/signup", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
export const SendVerificationCode = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/signup", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const VerifyEmailCode = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/signup", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserCreditUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/users/credit-update",
      payload,
      {
        headers: getHeadersWithToken(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserOrderCredit = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/order/create", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserResetPassword = async (payload: any) => {
  try {
    const response = await privateApi.post(
      "/api/users/reset-password",
      payload,
      {
        headers: getHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const UserUpdate = async (payload: any) => {
  try {
    const response = await publicApi.post("/api/users/update", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const TicketCreate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/support/create", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const TicketUpdate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/support/update", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const TicketList = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/support/list", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const CornMatchList = async () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await publicApi.get(`/api/corn/daily-match-list`, {
      headers: { "Content-Type": "application/json", "x-timezone": timezone },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const CornMatchStatus = async () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await publicApi.get(`/api/corn/match-status`, {
      headers: { "Content-Type": "application/json", "x-timezone": timezone },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const TicketDetails = async (id: any) => {
  try {
    const response = await privateApi.get(`/api/support/${id}`, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const PaymentCreate = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/payment-intent", payload, {
      headers: getHeadersWithToken(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

export const FetchMatchDetails = async (payload: any) => {
  try {
    const response = await privateApi.post("/api/match-details", payload, {
      headers: getHeadersWithToken(),
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const FetchMatchList = async (date: any) => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await publicApi.post(
      "/api/schedule",
      {
        fromDate: moment(date).format("YYYY-MM-DD"),
        toDate: moment(date).add(1, "days").format("YYYY-MM-DD"),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      {
        headers: { "Content-Type": "application/json", "x-timezone": timezone },
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const FetchPlatformPerformance = async (date: any) => {
  try {
    const response = await publicApi.post(
      "/api/stats/performance",
      { date: date },
      {
        headers: getHeaders(),
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const NotificationList = async (payload?: any) => {
  try {
    const response = await privateApi.post(
      "/api/notification/list",
      payload || {},
      { headers: getHeadersWithToken() }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const NotificationDelete = async (payload?: any) => {
  try {
    const response = await privateApi.post(
      "/api/notification/delete",
      payload || {},
      { headers: getHeadersWithToken() }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const NotificationRead = async (payload?: any) => {
  try {
    const response = await privateApi.post(
      "/api/notification/read",
      payload || {},
      { headers: getHeadersWithToken() }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
