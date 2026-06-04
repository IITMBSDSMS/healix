import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'YOUR_RESEND_API_KEY') {
      console.log(`[MOCK EMAIL] Contact form submission from ${name} (${email}): ${message}`);
      return NextResponse.json({ success: true, mocked: true });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'office@healix-technologies.com';
    
    // Safety check for Sandbox/Onboarding domains on Resend
    const userRecipient = process.env.RESEND_DOMAIN_VERIFIED === 'true' ? email : ADMIN_EMAIL;

    // Send emails concurrently
    const [adminMailRes, userMailRes] = await Promise.all([
      // 1. Email to Admin
      resend.emails.send({
        from: 'Healix Console <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background-color: #f9f9f9; color: #333; padding: 40px; border-radius: 12px; border: 1px solid #eaeaea;">
            <h2 style="color: #ea580c; margin-top: 0; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">New Message Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</div>
          </div>
        `,
      }),
      
      // 2. Welcome Email to User
      resend.emails.send({
        from: 'Healix Technologies <onboarding@resend.dev>',
        to: [userRecipient],
        subject: 'Inquiry Registered | Healix Technologies',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to Healix Technologies</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <!-- Main Card -->
                  <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
                    
                    <!-- Top Orange Banner -->
                    <tr>
                      <td style="background-color: #ea580c; height: 6px; line-height: 6px; font-size: 1px;">&nbsp;</td>
                    </tr>
                    
                    <!-- Content Padding -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        
                        <!-- Brand Header -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; text-align: center;">
                          <tr>
                            <td align="center">
                              <div style="font-size: 26px; font-weight: 900; color: #09090b; letter-spacing: -0.5px; font-family: sans-serif;">
                                HEALIX<span style="color: #ea580c;">_</span>
                              </div>
                              <div style="font-size: 10px; font-family: monospace; font-weight: bold; color: #ea580c; text-transform: uppercase; letter-spacing: 2.5px; margin-top: 6px;">
                                जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Welcome Heading -->
                        <h1 style="font-size: 18px; font-weight: 800; color: #09090b; margin-top: 0; margin-bottom: 16px; text-transform: uppercase; font-family: sans-serif; letter-spacing: -0.2px;">
                          INQUIRY REGISTERED SUCCESSFULLY
                        </h1>
                        
                        <!-- Salutation -->
                        <p style="font-size: 14px; font-weight: bold; color: #18181b; margin-bottom: 12px; font-family: sans-serif;">
                          Dear ${name},
                        </p>
                        
                        <!-- Body -->
                        <p style="font-size: 13.5px; line-height: 1.6; color: #52525b; margin-bottom: 20px; font-family: sans-serif;">
                          Thank you for contacting Healix Technologies. We have successfully received your message and registered it under our systems console. An operations engineer has been assigned to your query, and we will get back to you shortly (typically within 24 hours).
                        </p>

                        <!-- Details Box -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; margin-bottom: 24px; font-family: sans-serif;">
                          <tr>
                            <td style="padding: 20px;">
                              <h3 style="font-size: 11px; font-weight: 800; color: #09090b; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 12px;">
                                Submission Record
                              </h3>
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 12px;">
                                <tr>
                                  <td width="30%" style="font-weight: bold; color: #71717a; padding-bottom: 6px;">Name</td>
                                  <td style="color: #18181b; padding-bottom: 6px;">${name}</td>
                                </tr>
                                <tr>
                                  <td style="font-weight: bold; color: #71717a; padding-bottom: 6px;">Email</td>
                                  <td style="color: #18181b; padding-bottom: 6px;">${email}</td>
                                </tr>
                                <tr>
                                  <td valign="top" style="font-weight: bold; color: #71717a;">Message</td>
                                  <td style="color: #18181b; line-height: 1.5; white-space: pre-wrap;">${message}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <!-- Divider -->
                        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 30px 0;">
                        
                        <!-- Core Modules -->
                        <h4 style="font-size: 11px; font-weight: 800; color: #71717a; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; margin-bottom: 15px; text-align: center;">
                          INTEGRATED LIFE SYSTEMS
                        </h4>
                        <table width="100%" border="0" cellspacing="0" cellpadding="10" style="font-size: 12px; text-align: center; font-family: sans-serif;">
                          <tr>
                            <td width="33%">
                              <div style="font-weight: bold; color: #ea580c; margin-bottom: 4px;">HEALIX AI</div>
                              <div style="color: #71717a; font-size: 11px;">Clinical Decision AI</div>
                            </td>
                            <td width="33%">
                              <div style="font-weight: bold; color: #ea580c; margin-bottom: 4px;">BIOLABS</div>
                              <div style="color: #71717a; font-size: 11px;">Genomics Pipeline</div>
                            </td>
                            <td width="33%">
                              <div style="font-weight: bold; color: #ea580c; margin-bottom: 4px;">SURAKSHA</div>
                              <div style="color: #71717a; font-size: 11px;">Failsafe Hardware</div>
                            </td>
                          </tr>
                        </table>
                        
                      </td>
                    </tr>
                    
                    <!-- Bottom Footer -->
                    <tr>
                      <td style="background-color: #09090b; padding: 25px 30px; text-align: center; font-size: 10px; font-family: monospace; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">
                        Healix Technologies Pvt Ltd<br>
                        IIT Madras Campus, Chennai - 600036, India
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      })
    ]);

    return NextResponse.json({ success: true, admin: adminMailRes, user: userMailRes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
