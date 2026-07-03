import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { getEmailTemplateHtml } from '@/utils/emailTemplate';

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
        html: getEmailTemplateHtml({
          subjectTitle: `New Message Submission Alert`,
          recipientName: 'Healix Admin Team',
          bodyHtml: `
            <p style="margin-top: 0; margin-bottom: 16px;">
              A visitor has submitted a message via the Healix Technologies public gateway contact form.
            </p>
            <div style="background-color: #ffffff; border: 1px solid #e4e4e7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 13.5px; color: #09090b;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0; font-size: 13.5px; color: #09090b;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0 0 5px 0; font-size: 13.5px; color: #09090b;"><strong>Message Body:</strong></p>
              <div style="background-color: #f4f4f5; padding: 15px; border-radius: 6px; border: 1px solid #e4e4e7; font-size: 13px; color: #27272a; white-space: pre-wrap; font-family: monospace; line-height: 1.5;">${message}</div>
            </div>
          `,
          senderName: 'Healix Web Gateway',
          senderRole: 'Contact Form Router',
          senderEmail: 'gateway@healix-technologies.com'
        }),
      }),
      
      // 2. Welcome Email to User (directly to user's address)
      resend.emails.send({
        from: SENDER_EMAIL,
        to: [email],
        subject: 'Welcome to Healix Technologies',
        html: getEmailTemplateHtml({
          subjectTitle: `Inquiry Registered Successfully`,
          recipientName: name,
          bodyHtml: `
            <p style="margin-top: 0; margin-bottom: 16px;">
              Thank you for contacting <strong>Healix Technologies</strong>. We have successfully registered your inquiry in our engineering console.
            </p>
            <p style="margin-bottom: 16px; line-height: 1.6;">
              An operations coordinator has been assigned to your ticket and will follow up with you shortly to assist with your requirements.
            </p>
            <div style="background-color: #ffffff; border: 1px solid #e4e4e7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; margin-bottom: 10px; color: #09090b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Ticket Submission Details</h4>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #27272a;">
                <tr>
                  <td width="30%" style="font-weight: bold; padding-bottom: 8px;">Full Name</td>
                  <td style="color: #71717a; padding-bottom: 8px;">${name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; padding-bottom: 8px;">Email Address</td>
                  <td style="color: #71717a; padding-bottom: 8px;">${email}</td>
                </tr>
                <tr>
                  <td valign="top" style="font-weight: bold; padding-bottom: 8px;">Message</td>
                  <td style="color: #71717a; padding-bottom: 8px; white-space: pre-wrap; line-height: 1.4;">${message}</td>
                </tr>
              </table>
            </div>
            <p style="margin-top: 20px; font-style: italic; color: #71717a; font-size: 13.5px; border-left: 3px solid #ea580c; padding-left: 15px;">
              "Empowering human longevity through clinical diagnostics, precision engineering, and robust automation."
            </p>
          `,
          senderName: 'Healix Communications',
          senderRole: 'Operations Delivery Division',
          senderEmail: 'official@healix-technologies.com'
        })
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
