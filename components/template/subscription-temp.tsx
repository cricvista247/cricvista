import {
  EmailLayout,
  EmailGreeting,
  EmailTitle,
  EmailText,
  EmailButton,
  EmailButtonSecondary,
  EmailInfoCard,
} from "./EmailLayout";

const getPaymentDetails = (data: any) => {
  if (data.upiId) return `UPI ID: ${data.upiId}`;
  if (data.cardNumber) return `Card: ****${data.cardNumber.slice(-4)}`;
  if (data.paymentMode) return data.paymentMode;
  if (data.method === "QRCODE" || data.upiId) return "Payment via UPI";
  return "Online Payment";
};

const getPaymentFailedModeDetails = (data: any) => {
  if (data.upiId) return data.upiId;
  if (data.method === "QRCODE") return "UPI QR Code";
  if (data.cardNumber) return `Card ending in ${data.cardNumber.slice(-4)}`;
  if (data.paymentMode) return data.paymentMode;
  return "Online Payment";
};

const getUserName = (data: any): string =>
  data.username || data.user?.name || data.name || "there";

export const UserPaymentConfirmationTemp = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.cricvista247.in";

  return EmailLayout({
    title: "Payment Submitted",
    content: `
      ${EmailGreeting(getUserName(data))}
      ${EmailTitle("Payment Details Submitted 📋")}
      ${EmailText("We&#39;ve received your payment submission for the subscription. Our team will review the details and activate your plan shortly. You&#39;ll receive a confirmation email once the payment is verified.")}
      ${EmailInfoCard([
        { label: "Plan", value: data.planName || data.subscriptionPlan || data.subscriptionType || "Premium" },
        { label: "Amount", value: `₹${data.amount || data.price || 0}` },
        { label: "Payment Method", value: getPaymentDetails(data) },
        { label: "Transaction ID", value: data.transactionId || data.paymentId || "Pending" },
        { label: "Date", value: data.date || data.paymentDate || new Date().toLocaleDateString() },
        { label: "Status", value: "Pending Verification" },
      ])}
      ${EmailButton(`${appUrl}/subscription`, "View Subscription")}
      <p style="margin: 16px 0 0; font-size: 13px; color: #94A3B8; text-align: center;">
        We&#39;ll notify you once your payment is verified. This usually takes a few minutes.
      </p>
    `,
  });
};

export const AdminPaymentConfirmationTemp = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.cricvista247.in";

  return EmailLayout({
    title: "New Payment Received",
    content: `
      ${EmailGreeting("Admin")}
      ${EmailTitle("New Payment Submission 💳")}
      ${EmailText("A user has submitted a new payment for subscription. Please review and verify the payment details.")}
      ${EmailInfoCard([
        { label: "User", value: getUserName(data) + (data.email ? ` (${data.email})` : "") },
        { label: "Plan", value: data.planName || data.subscriptionPlan || "Premium" },
        { label: "Amount", value: `₹${data.amount || data.price || 0}` },
        { label: "Payment Method", value: getPaymentDetails(data) },
        { label: "Transaction ID", value: data.transactionId || "N/A" },
        { label: "User ID", value: data.userId || "N/A" },
      ])}
      ${EmailButton(`${appUrl}/admin/orders`, "Review Payment")}
      ${data.userId ? EmailButtonSecondary(`${appUrl}/admin/users/${data.userId}`, "View User Profile") : ""}
    `,
  });
};

export const PaymentVerifiedTem = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.cricvista247.in";

  return EmailLayout({
    title: "Payment Verified",
    content: `
      ${EmailGreeting(getUserName(data))}
      ${EmailTitle("Payment Verified Successfully ✅")}
      ${EmailText("Great news! Your payment has been verified and your subscription is now active. You can start using all the premium features included in your plan.")}
      ${EmailInfoCard([
        { label: "Plan", value: data.planName || data.subscriptionPlan || "Premium" },
        { label: "Amount", value: `₹${data.amount || data.price || 0}` },
        { label: "Transaction ID", value: data.transactionId || data.paymentId || "N/A" },
        { label: "Payment Date", value: data.paymentDate || data.date || new Date().toLocaleDateString() },
        { label: "Valid Until", value: data.validUntil || data.expiryDate || "N/A" },
        { label: "Status", value: "Active ✅" },
      ])}
      ${EmailButton(`${appUrl}/dashboard`, "Open Dashboard")}
      ${EmailButtonSecondary(`${appUrl}/matches`, "Explore Premium Insights")}
    `,
  });
};

export const PaymentFailedTem = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.cricvista247.in";

  return EmailLayout({
    title: "Payment Failed",
    content: `
      ${EmailGreeting(getUserName(data))}
      ${EmailTitle("Payment Declined ❌")}
      ${EmailText("Unfortunately, your payment could not be processed. This could be due to insufficient funds, incorrect payment details, or a temporary issue with the payment gateway.")}
      ${EmailInfoCard([
        { label: "Plan", value: data.planName || data.subscriptionPlan || "Premium" },
        { label: "Amount", value: `₹${data.amount || data.price || 0}` },
        { label: "Payment Method", value: getPaymentFailedModeDetails(data) },
        { label: "Transaction ID", value: data.transactionId || data.paymentId || "N/A" },
        { label: "Date", value: data.date || data.paymentDate || new Date().toLocaleDateString() },
        { label: "Status", value: "Failed ❌" },
      ])}
      ${EmailButton(`${appUrl}/subscription`, "Try Again")}
      ${EmailButtonSecondary(`${appUrl}/contact`, "Contact Support")}
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px;">
        <tr>
          <td style="padding: 16px 20px;">
            <p style="margin: 0; font-size: 13px; color: #991B1B; line-height: 1.5;">
              💡 If you believe this is an error, please try again or use a different payment method. For assistance, contact our support team at <a href="mailto:cricvista247@gmail.com" style="color: #DC2626; font-weight: 600;">cricvista247@gmail.com</a>.
            </p>
          </td>
        </tr>
      </table>
    `,
  });
};
