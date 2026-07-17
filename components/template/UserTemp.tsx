import {
  EmailLayout,
  EmailGreeting,
  EmailTitle,
  EmailText,
  EmailButton,
  EmailButtonSecondary,
  EmailOTPBox,
  EmailInfoCard,
  EmailSecurityNote,
} from "./EmailLayout";

const getUserName = (data: any): string =>
  data.username || data.user?.name || data.name || "there";

export const UserAccountClosureTemp = (data: any) => {
  const isBanned = data.status === "banned";
  const title = isBanned ? "Account Permanently Banned" : "Account Temporarily Suspended";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.netlify.app";

  return EmailLayout({
    title,
    content: `
      ${EmailGreeting(getUserName(data))}
      ${EmailTitle(title)}
      ${EmailText(`Your CricVista account has been <strong style="color: ${isBanned ? "#DC2626" : "#D97706"};">${isBanned ? "permanently banned" : "temporarily suspended"}</strong> due to a violation of our Terms of Service.`)}
      ${EmailInfoCard([
        { label: "Username", value: getUserName(data) },
        { label: "Status", value: isBanned ? "Banned" : "Suspended" },
        { label: "Date", value: data.date || new Date().toLocaleDateString() },
        { label: "User ID", value: data.userId || "N/A" },
      ])}
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
        <tr>
          <td style="padding: 16px; background: #F8FAFC; border-left: 4px solid ${isBanned ? "#DC2626" : "#D97706"}; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-size: 13px; font-weight: 600; color: #475569;">Reason:</p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #64748B; line-height: 1.5;">${data.reason || "No reason provided."}</p>
          </td>
        </tr>
      </table>
      ${!isBanned ? EmailButton(`${appUrl}/support`, "Appeal Suspension") : ""}
      ${EmailButtonSecondary(`${appUrl}/terms`, "View Terms of Service")}
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0 0; background: #F1F5F9; border-radius: 12px;">
        <tr>
          <td align="center" style="padding: 18px;">
            <p style="margin: 0 0 6px; font-size: 13px; color: #64748B;">Need help? Contact our support team</p>
            <p style="margin: 0; font-size: 13px; color: #2563EB;">
              <a href="mailto:cricvista247@gmail.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">cricvista247@gmail.com</a>
            </p>
          </td>
        </tr>
      </table>
    `,
  });
};

export const UserWelcomeTemp = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.netlify.app";

  return EmailLayout({
    title: "Welcome to CricVista",
    content: `
      ${EmailGreeting(getUserName(data))}
      ${EmailTitle("Welcome to CricVista! 🎉")}
      ${EmailText("We&#39;re thrilled to have you on board. Your account has been successfully created and you&#39;re now ready to explore AI-powered cricket analytics, match insights, player performance data, and much more.")}
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px;">
        <tr>
          <td style="padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" align="center" style="padding: 8px;">
                  <div style="font-size: 28px; margin-bottom: 6px;">📊</div>
                  <p style="margin: 0; font-size: 12px; font-weight: 600; color: #0F172A;">Match Analytics</p>
                </td>
                <td width="33%" align="center" style="padding: 8px;">
                  <div style="font-size: 28px; margin-bottom: 6px;">🤖</div>
                  <p style="margin: 0; font-size: 12px; font-weight: 600; color: #0F172A;">AI Insights</p>
                </td>
                <td width="33%" align="center" style="padding: 8px;">
                  <div style="font-size: 28px; margin-bottom: 6px;">🏆</div>
                  <p style="margin: 0; font-size: 12px; font-weight: 600; color: #0F172A;">Team Analysis</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      ${EmailButton(`${appUrl}/dashboard`, "Go to Dashboard")}
      ${EmailButtonSecondary(`${appUrl}/matches`, "Explore Matches")}
      <p style="margin: 16px 0 0; font-size: 13px; color: #94A3B8; text-align: center;">
        Start exploring and get deeper insights into every cricket match.
      </p>
    `,
  });
};

export const RegistrationOTP = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.netlify.app";

  return EmailLayout({
    title: "Verify Your Email",
    content: `
      ${EmailGreeting(getUserName(data))}
      ${EmailTitle("Verify Your Email Address")}
      ${EmailText("Thank you for registering with CricVista! Please use the OTP below to verify your email address and activate your account.")}
      ${EmailOTPBox(data.otp)}
      ${EmailSecurityNote()}
      <p style="margin: 16px 0 0; font-size: 13px; color: #94A3B8; text-align: center;">
        You can also paste this link in your browser if the button doesn&#39;t work:<br>
        <a href="${appUrl}/verify-email?otp=${data.otp}" style="color: #2563EB; font-size: 12px; word-break: break-all;">${appUrl}/verify-email?otp=${data.otp}</a>
      </p>
    `,
  });
};

export const AdminDepositCreditsEmail = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.netlify.app";

  return EmailLayout({
    title: "Deposit Confirmed",
    content: `
      ${EmailGreeting(getUserName(data))}
      ${EmailTitle("Deposit Successful 💰")}
      ${EmailText("Your deposit has been confirmed and the credits have been added to your account. You can now use these credits to access premium analytics and insights.")}
      ${EmailInfoCard([
        { label: "Amount", value: `₹${data.amount || data.totalCreditsAdded || 0}` },
        { label: "Credits Added", value: `${data.totalCreditsAdded || data.credits || 0} Credits` },
        { label: "Date", value: data.date || new Date().toLocaleDateString() },
      ])}
      ${EmailButton(`${appUrl}/dashboard`, "View My Credits")}
    `,
  });
};

export const AdminFreeCreditsEmail = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricvista.netlify.app";

  return EmailLayout({
    title: "Free Credits Added",
    content: `
      ${EmailGreeting(getUserName(data))}
      ${EmailTitle("You&#39;ve Received Free Credits! 🎁")}
      ${EmailText("Great news! Free credits have been added to your CricVista account as a special offer. Use them to unlock premium analytics and insights.")}
      ${EmailInfoCard([
        { label: "Credits Added", value: `${data.totalCreditsAdded || data.credits || 0} Credits` },
        { label: "Offer", value: data.offerName || "Special Promotion" },
        { label: "Date", value: data.date || new Date().toLocaleDateString() },
      ])}
      ${EmailButton(`${appUrl}/dashboard`, "Start Exploring")}
      <p style="margin: 16px 0 0; font-size: 13px; color: #94A3B8; text-align: center;">
        Thank you for being a valued CricVista user!
      </p>
    `,
  });
};
