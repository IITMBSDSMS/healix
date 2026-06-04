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

    // Sender is official@healix-technologies.com
    const SENDER_EMAIL = 'Healix Technologies <official@healix-technologies.com>';
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'office@healix-technologies.com';

    console.log(`[EMAIL SENDING] Initiating concurrent email dispatch. From: ${SENDER_EMAIL}, Admin To: ${ADMIN_EMAIL}, User To: ${email}`);

    // Send emails concurrently
    const [adminMailRes, userMailRes] = await Promise.all([
      // 1. Email to Admin
      resend.emails.send({
        from: SENDER_EMAIL,
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; color: #333; padding: 40px; border-radius: 12px; border: 1px solid #eaeaea;">
            <h2 style="color: #ea580c; margin-top: 0; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">New Message Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</div>
          </div>
        `,
      }),
      
      // 2. Welcome Email to User (directly to user's address)
      resend.emails.send({
        from: SENDER_EMAIL,
        to: [email],
        subject: 'Welcome to Healix Technologies',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome to Healix Technologies</title>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700;800&family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700;800&family=Outfit:wght@400;600;800;900&display=swap');
            </style>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <!-- Main Container Card -->
                  <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                    
                    <!-- Top Bright Color Accent Banner -->
                    <tr>
                      <td style="background: linear-gradient(90deg, #ff5500 0%, #ea580c 30%, #eab308 60%, #10b981 100%); height: 8px; line-height: 8px; font-size: 1px;">&nbsp;</td>
                    </tr>
                    
                    <!-- Logo / Brand Banner (Vibrant Gradient Background with Incorporated Official Logo) -->
                    <tr>
                      <td align="center" style="padding: 40px 30px; background: linear-gradient(135deg, #09090b 0%, #18181b 100%); text-align: center; border-bottom: 4px solid #ea580c;">
                        <!-- Official circular incorporated logo of Healix Technologies -->
                        <img src="https://www.healix-technologies.com/official-logo.png" alt="Healix Technologies Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #ea580c; display: block; margin: 0 auto 16px auto; background-color: #ffffff; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.35);" />
                        
                        <div style="font-size: 30px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px; margin-bottom: 6px; font-family: 'Outfit', sans-serif; text-transform: uppercase;">
                          HEALIX<span style="color: #ea580c;">_</span>TECHNOLOGIES
                        </div>
                        
                        <!-- Official tagline with Noto Sans Devanagari -->
                        <div style="font-family: 'Noto Sans Devanagari', sans-serif; font-size: 13.5px; font-weight: 700; color: #f97316; letter-spacing: 0.5px; margin-top: 10px; line-height: 1.4; display: inline-block; padding: 4px 16px; background-color: rgba(234, 88, 12, 0.1); border-radius: 30px; border: 1px solid rgba(234, 88, 12, 0.2);">
                          जैव-चिकित्सीय अनुसंधान एवं अभियांत्रिकी केंद्र
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Main Body Content -->
                    <tr>
                      <td style="padding: 40px 35px; background-color: #ffffff;">
                        
                        <!-- Welcome Header -->
                        <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin-top: 0; margin-bottom: 20px; font-family: 'Outfit', sans-serif; letter-spacing: -0.5px; line-height: 1.2;">
                          Inquiry Successfully Registered
                        </h2>
                        
                        <!-- Salutation -->
                        <p style="font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 16px; font-family: 'Outfit', sans-serif;">
                          Dear ${name},
                        </p>
                        
                        <!-- Body Paragraphs -->
                        <p style="font-size: 14.5px; line-height: 1.6; color: #475569; margin-bottom: 24px; font-family: 'Outfit', sans-serif;">
                          Thank you for reaching out to **Healix Technologies**. We have successfully received your inquiry in our engineering console. An operations engineer has been assigned to your request and will contact you shortly to assist with your requirements.
                        </p>
 
                        <!-- Highlights Section with Bright Orange Borders -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 16px; margin-bottom: 30px; font-family: 'Outfit', sans-serif; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.05);">
                          <tr>
                            <td style="padding: 24px;">
                              <h3 style="font-size: 12px; font-weight: 900; color: #ea580c; font-family: monospace; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; margin-bottom: 14px; border-bottom: 1.5px solid #fed7aa; padding-bottom: 6px;">
                                Record Submission
                              </h3>
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #4b5563;">
                                <tr>
                                  <td width="30%" style="font-weight: 700; color: #7c2d12; padding-bottom: 10px; vertical-align: top;">Full Name</td>
                                  <td style="color: #1e293b; padding-bottom: 10px; font-weight: 500; vertical-align: top;">${name}</td>
                                </tr>
                                <tr>
                                  <td style="font-weight: 700; color: #7c2d12; padding-bottom: 10px; vertical-align: top;">Email Address</td>
                                  <td style="color: #1e293b; padding-bottom: 10px; font-weight: 500; vertical-align: top;">${email}</td>
                                </tr>
                                <tr>
                                  <td valign="top" style="font-weight: 700; color: #7c2d12; padding-bottom: 4px; vertical-align: top;">Description</td>
                                  <td style="color: #1e293b; line-height: 1.6; white-space: pre-wrap; font-weight: 500; vertical-align: top;">${message}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <!-- Callouts / Tagline translation or mission -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                          <tr>
                            <td align="center" style="font-size: 13.5px; line-height: 1.6; color: #64748b; font-style: italic; font-weight: 500; font-family: 'Outfit', sans-serif; border-left: 3px solid #e2e8f0; padding-left: 15px; text-align: left;">
                              "Empowering human longevity through clinical diagnostics and robust automation."
                            </td>
                          </tr>
                        </table>

                        <!-- Divider -->
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 35px 0;">
                        
                        <!-- Core Modules Grid with Bright Colors -->
                        <h4 style="font-size: 11px; font-weight: 800; color: #94a3b8; font-family: monospace; text-transform: uppercase; letter-spacing: 2.5px; margin-top: 0; margin-bottom: 20px; text-align: center;">
                          OUR ECOSYSTEM MODULES
                        </h4>
                        <table width="100%" border="0" cellspacing="0" cellpadding="5" style="font-size: 12.5px; text-align: center; font-family: 'Outfit', sans-serif;">
                          <tr>
                            <td width="33%" style="padding: 10px; background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px;">
                              <div style="font-weight: 900; color: #ea580c; margin-bottom: 4px; font-size: 13.5px;">HEALIX AI</div>
                              <div style="color: #64748b; font-size: 11px; line-height: 1.3;">Intelligent Health Guidance</div>
                            </td>
                            <td width="1%" style="font-size: 1px;">&nbsp;</td>
                            <td width="33%" style="padding: 10px; background-color: #f5f3ff; border: 1px solid #ede9fe; border-radius: 12px;">
                              <div style="font-weight: 900; color: #8b5cf6; margin-bottom: 4px; font-size: 13.5px;">BIOLABS</div>
                              <div style="color: #64748b; font-size: 11px; line-height: 1.3;">Precision Genomics</div>
                            </td>
                            <td width="1%" style="font-size: 1px;">&nbsp;</td>
                            <td width="33%" style="padding: 10px; background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 12px;">
                              <div style="font-weight: 900; color: #10b981; margin-bottom: 4px; font-size: 13.5px;">SURAKSHA</div>
                              <div style="color: #64748b; font-size: 11px; line-height: 1.3;">Failsafe Telemetry</div>
                            </td>
                          </tr>
                        </table>
                        
                      </td>
                    </tr>
                    
                    <!-- Bottom Footer -->
                    <tr>
                      <td style="background-color: #09090b; padding: 35px 30px; text-align: center; font-size: 11px; font-family: monospace; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; line-height: 1.7; border-top: 1px solid #1e1e2f;">
                        <span style="color: #ea580c; font-weight: bold;">Healix Technologies Pvt Ltd</span><br>
                        IIT Madras Research Park, Adyar, Chennai - 600036, India
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

    console.log('[EMAIL RESPONSE] Admin Email:', JSON.stringify(adminMailRes));
    console.log('[EMAIL RESPONSE] User Email:', JSON.stringify(userMailRes));

    if (adminMailRes.error || userMailRes.error) {
      console.error('[EMAIL DISPATCH ERROR]', {
        adminError: adminMailRes.error,
        userError: userMailRes.error
      });
      return NextResponse.json({ 
        success: false, 
        error: adminMailRes.error || userMailRes.error,
        admin: adminMailRes, 
        user: userMailRes 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, admin: adminMailRes, user: userMailRes });
  } catch (error: any) {
    console.error('[EMAIL EXCEPTION]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
