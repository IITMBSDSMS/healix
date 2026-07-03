/**
 * Reusable HTML Email Template for Healix Technologies.
 * Matches the design requested by the user, incorporating the official logo and colors.
 */
interface EmailTemplateOptions {
  subjectTitle: string;
  recipientName: string;
  bodyHtml: string;
  senderName?: string;
  senderRole?: string;
  senderEmail?: string;
}

export function getEmailTemplateHtml({
  subjectTitle,
  recipientName,
  bodyHtml,
  senderName = "Healix Operations",
  senderRole = "Automated Delivery Console",
  senderEmail = "info@healix-technologies.com",
}: EmailTemplateOptions): string {
  // Use Vercel production host for assets to ensure email clients load them correctly
  const IMAGE_HOST = process.env.NEXT_PUBLIC_SITE_URL || "https://www.healix-technologies.com";
  const logoUrl = `${IMAGE_HOST}/healix-inc-logo-trimmed.png`;
  const footerUrl = `${IMAGE_HOST}/email-footer.png`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subjectTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 20px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #f4f4f5; border-radius: 0; overflow: hidden; border: 1px solid #e4e4e7;">
          
          <!-- Top Border Accent Line -->
          <tr>
            <td style="background-color: #0f172a; height: 6px; line-height: 6px; font-size: 1px;">&nbsp;</td>
          </tr>
          
          <!-- Main Content Area -->
          <tr>
            <td style="padding: 40px 40px 10px 40px; background-color: #f4f4f5;">
              <!-- Brand Header -->
              <div style="margin-bottom: 30px;">
                <img src="${logoUrl}" alt="Healix Technologies Logo" style="height: 32px; display: block; border: 0;" />
              </div>
              
              <!-- Subject Line -->
              <h3 style="font-size: 16px; font-weight: normal; color: #09090b; margin-top: 0; margin-bottom: 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; letter-spacing: -0.2px; line-height: 1.4;">
                Subject: Invitation: <strong style="font-weight: 700; color: #09090b;">${subjectTitle}</strong>
              </h3>
              
              <!-- Salutation -->
              <p style="font-size: 15px; color: #09090b; line-height: 1.5; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                Dear ${recipientName},
              </p>
              
              <!-- Body Contents -->
              <div style="font-size: 15px; color: #27272a; line-height: 1.6; margin-bottom: 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                ${bodyHtml}
              </div>
              
              <!-- Best Regards Signature -->
              <p style="font-size: 15px; color: #09090b; line-height: 1.5; margin-top: 24px; margin-bottom: 30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                Best regards,<br/><br/>
                <strong style="font-weight: 700; color: #09090b;">${senderName}</strong><br/>
                <span style="color: #71717a; font-size: 13.5px;">${senderRole}</span><br/>
                <span style="color: #71717a; font-size: 13.5px;">${senderEmail}</span>
              </p>
            </td>
          </tr>
          
          <!-- Bottom Brand Corner/Diagonal Graphic -->
          <tr>
            <td style="padding: 0; margin: 0; background-color: #f4f4f5; line-height: 0; font-size: 0;">
              <img src="${footerUrl}" alt="Healix Technologies" style="width: 100%; max-width: 600px; display: block; border: 0; margin: 0; padding: 0;" />
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
