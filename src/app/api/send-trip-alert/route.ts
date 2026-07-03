import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { getEmailTemplateHtml } from '@/utils/emailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export async function POST(request: Request) {
  try {
    const { userName, vehicleId, location, timestamp, contacts } = await request.json();

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'YOUR_RESEND_API_KEY') {
      console.log(`[MOCK EMAIL] Trip Alert from ${userName}. Live Track: /track/${vehicleId}`);
      return NextResponse.json({ success: true, mocked: true });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    // Instead of a static Maps link, we now send them to our Live Tracking Dashboard
    const trackingLink = `${siteUrl}/track/${vehicleId}`;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'office@healix-technologies.com';
    
    const subject = `🚨 SURAKSHA ALERT: ${userName} has started a trip.`;
    const recipientName = 'Healix Safety Contact';
    const bodyHtml = `
      <p style="margin-top: 0; margin-bottom: 16px;">
        A trusted traveler has boarded a vehicle and activated the **Project Suraksha** live tracking system.
      </p>
      <div style="background-color: #fff7ed; border: 1.5px solid #ffedd5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; margin-bottom: 10px; color: #ea580c; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🚖 Trip Dispatch Telemetry</h4>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13.5px; color: #09090b;">
          <tr>
            <td width="30%" style="font-weight: bold; padding-bottom: 8px; color: #7c2d12;">Traveler</td>
            <td style="color: #09090b; padding-bottom: 8px;">${userName || 'Your trusted contact'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-bottom: 8px; color: #7c2d12;">Start Time</td>
            <td style="color: #09090b; padding-bottom: 8px;">${new Date(timestamp).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-bottom: 8px; color: #7c2d12;">Beacon ID</td>
            <td style="color: #09090b; padding-bottom: 8px; font-family: monospace;">${vehicleId}</td>
          </tr>
        </table>
        
        <p style="margin: 15px 0 10px 0; font-size: 13px; color: #7c2d12;">They have shared their real-time telemetry route and security state details with you.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${trackingLink}" style="display: inline-block; background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
            Track Live Location
          </a>
        </div>
      </div>
      <p style="font-size: 13px; color: #71717a;">
        This telemetry safety dispatch is automatically routed by the Healix Technologies Failsafe Engine. Please keep the link active to monitor the traveler's ride path.
      </p>
    `;

    const data = await resend.emails.send({
      from: 'Healix Suraksha <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: subject,
      html: getEmailTemplateHtml({
        subjectTitle: subject,
        recipientName: recipientName,
        bodyHtml: bodyHtml,
        senderName: 'Healix Suraksha Gateway',
        senderRole: 'Failsafe Telemetry Bot',
        senderEmail: 'suraksha@healix-technologies.com'
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
