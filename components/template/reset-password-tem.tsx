import {
  EmailLayout,
  EmailGreeting,
  EmailTitle,
  EmailText,
  EmailButton,
  EmailButtonSecondary,
  EmailOTPBox,
  EmailSecurityNote,
} from "./EmailLayout";

export const ResetPasswordTem = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.cricvista247.in";

  return EmailLayout({
    title: "Reset Your Password",
    content: `
      ${EmailGreeting(data.username)}
      ${EmailTitle("Reset Your Password")}
      ${EmailText("We received a request to reset the password for your CricVista account. Use the OTP below to proceed with resetting your password.")}
      ${EmailOTPBox(data.otp)}
      ${EmailSecurityNote()}
      <p style="margin: 16px 0 0; font-size: 13px; color: #94A3B8; text-align: center;">
        Didn&#39;t request this? No action needed — your account remains secure.<br>
        <a href="${appUrl}/support" style="color: #2563EB; font-size: 12px;">Contact Support</a>
      </p>
    `,
  });
};

export const ResetPasswordSuccessTem = (data: any) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.cricvista247.in";

  return EmailLayout({
    title: "Password Reset Successful",
    content: `
      ${EmailGreeting(data.username)}
      ${EmailTitle("Password Updated Successfully ✅")}
      ${EmailText("Your CricVista account password has been changed successfully. If you made this change, no further action is needed.")}
      ${EmailButton(`${appUrl}/auth/login`, "Log In to Your Account")}
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0 0; background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 12px;">
        <tr>
          <td style="padding: 16px 20px;">
            <p style="margin: 0; font-size: 13px; color: #9A3412; line-height: 1.5;">
              ⚠️ If you did NOT make this change, please <a href="${appUrl}/support" style="color: #EA580C; font-weight: 600;">contact our support team</a> immediately.
            </p>
          </td>
        </tr>
      </table>
    `,
  });
};
