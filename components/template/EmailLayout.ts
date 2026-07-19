const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.cricvista247.in";
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_EMAIL || "cricvista247@gmail.com";
const BRAND_COLOR = "#2563EB";
const GRADIENT = "linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)";

export const EmailHeader = (): string => `
  <tr>
    <td align="center" style="padding: 36px 40px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <div style="display: inline-block; width: 48px; height: 48px; border-radius: 14px; background: ${GRADIENT}; text-align: center; line-height: 48px; font-size: 24px; color: #fff; margin-bottom: 12px;">🏏</div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; background: ${GRADIENT}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; mso-hide: all;">CricVista</h1>
            <p style="margin: 4px 0 0; font-size: 13px; color: #94A3B8;">AI-Powered Cricket Analytics &amp; Insights</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

export const EmailDivider = (): string => `
  <tr>
    <td style="padding: 0 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="height: 1px; background: #E2E8F0; font-size: 0; line-height: 0;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
`;

export const EmailGreeting = (name: string): string => `
  <p style="margin: 0 0 16px; font-size: 16px; color: #334155; line-height: 1.6;">
    Hello <strong style="color: ${BRAND_COLOR};">${name}</strong>,
  </p>
`;

export const EmailTitle = (title: string): string => `
  <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0F172A; line-height: 1.3;">${title}</h2>
`;

export const EmailText = (text: string): string => `
  <p style="margin: 0 0 16px; font-size: 15px; color: #475569; line-height: 1.7;">${text}</p>
`;

export const EmailButton = (url: string, text: string): string => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="border-radius: 12px; background: ${GRADIENT}; padding: 0;">
              <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.3px;">${text}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

export const EmailButtonSecondary = (url: string, text: string): string => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="border: 2px solid ${BRAND_COLOR}; border-radius: 12px; padding: 0;">
              <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: ${BRAND_COLOR}; text-decoration: none; border-radius: 12px; letter-spacing: 0.3px;">${text}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

export const EmailOTPBox = (otp: string): string => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" style="background: #EFF6FF; border: 2px solid #BFDBFE; border-radius: 16px;">
          <tr>
            <td align="center" style="padding: 20px 40px;">
              <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #3B82F6;">Your OTP Code</p>
              <p style="margin: 0; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1D4ED8;">${otp}</p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #60A5FA;">Expires in 10 minutes</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

export const EmailInfoCard = (items: { label: string; value: string }[]): string => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px;">
    ${items.map((item, i) => `
      <tr>
        <td style="padding: ${i === 0 ? '16px 20px 8px' : '8px 20px'};">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="40%" style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #94A3B8; vertical-align: top; padding-right: 8px;">${item.label}</td>
              <td width="60%" style="font-size: 14px; font-weight: 600; color: #0F172A; vertical-align: top;">${item.value}</td>
            </tr>
          </table>
        </td>
      </tr>
      ${i < items.length - 1 ? `<tr><td style="padding: 0 20px;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height: 1px; background: #E2E8F0; font-size: 0; line-height: 0;">&nbsp;</td></tr></table></td></tr>` : ''}
    `).join('')}
  </table>
`;

export const EmailSecurityNote = (): string => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px;">
    <tr>
      <td style="padding: 14px 18px;">
        <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.5;">
          🔒 If you didn&#39;t request this action, you can safely ignore this email. For security reasons, this link expires in 10 minutes.
        </p>
      </td>
    </tr>
  </table>
`;

export const EmailFooter = (): string => `
  <tr>
    <td style="padding: 0 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="height: 1px; background: #E2E8F0; font-size: 0; line-height: 0;">&nbsp;</td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
        <tr>
          <td align="center" style="padding-bottom: 12px;">
            <span style="font-size: 13px; font-weight: 700; color: #0F172A;">CricVista</span>
            <span style="font-size: 12px; color: #94A3B8; margin: 0 6px;">|</span>
            <a href="${APP_URL}" style="font-size: 12px; color: ${BRAND_COLOR}; text-decoration: none;">${APP_URL}</a>
            <span style="font-size: 12px; color: #94A3B8; margin: 0 6px;">|</span>
            <a href="mailto:${SUPPORT_EMAIL}" style="font-size: 12px; color: ${BRAND_COLOR}; text-decoration: none;">${SUPPORT_EMAIL}</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom: 8px;">
            <p style="margin: 0; font-size: 12px; color: #94A3B8; line-height: 1.5;">
              You are receiving this email because you have an account with CricVista.<br>
              CricVista, India<br>
              © ${new Date().getFullYear()} CricVista. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

export const EmailLayout = ({
  title,
  content,
  hideHeader = false,
}: {
  title: string;
  content: string;
  hideHeader?: boolean;
}): string => {
  const safeTitle = title.replace(/[<>]/g, "");
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${safeTitle} - CricVista</title>

  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style>
    table { border-collapse: collapse; }
    td { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->

  <style type="text/css">
    /* Outlook fix */
    .ExternalClass, .ReadMsgBody { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass td { line-height: 100%; }

    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .email-padding { padding: 20px 24px !important; }
      .email-card { border-radius: 0 !important; }
      .otp-code { font-size: 28px !important; letter-spacing: 6px !important; }
      h2 { font-size: 20px !important; }
      .hide-mobile { display: none !important; }
      .stack-mobile td { display: block !important; width: 100% !important; padding: 4px 0 !important; }
    }
    @media only screen and (max-width: 420px) {
      .email-padding { padding: 16px !important; }
      .btn-padding { padding: 12px 24px !important; font-size: 14px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">

<center style="width: 100%; table-layout: fixed; background-color: #F1F5F9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F1F5F9;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table class="email-container" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: #FFFFFF; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

          ${hideHeader ? "" : EmailHeader()}

          <tr>
            <td class="email-padding" style="padding: 8px 40px 32px;">
              ${content}
            </td>
          </tr>

          ${EmailFooter()}

        </table>

        <!-- Preheader text -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td align="center" style="padding: 16px 16px 32px;">
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">${safeTitle} - CricVista AI-Powered Cricket Analytics</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</center>

</body>
</html>`;
};
