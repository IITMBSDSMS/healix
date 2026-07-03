import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { getEmailTemplateHtml } from '@/utils/emailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export async function POST(request: Request) {
  try {
    const { name, location, timestamp } = await request.json();

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'YOUR_RESEND_API_KEY') {
      console.log(`[MOCK EMAIL] SOS Alert from ${name} at ${timestamp}. Location:`, location);
      return NextResponse.json({ success: true, mocked: true });
    }

    const googleMapsLink = location 
      ? `https://maps.google.com/?q=${location.lat},${location.lng}` 
      : 'Location unavailable';

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'office@healix-technologies.com';
    
    const subject = `🚨 EMERGENCY SOS ALERT: ${name || 'A User'} Needs Help!`;
    const recipientName = 'Operations Dispatch Command';
    const bodyHtml = `
      <p style="margin-top: 0; margin-bottom: 16px;">
        A critical <strong>Emergency SOS Alert</strong> has been manually triggered via the Project Suraksha safety ecosystem.
      </p>
      <div style="background-color: #fef2f2; border: 1.5px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; margin-bottom: 10px; color: #dc2626; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🚨 Incident Telemetry</h4>
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13.5px; color: #09090b;">
          <tr>
            <td width="30%" style="font-weight: bold; padding-bottom: 8px; color: #7f1d1d;">Triggered By</td>
            <td style="color: #09090b; padding-bottom: 8px;">${name || 'A User'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding-bottom: 8px; color: #7f1d1d;">Timestamp</td>
            <td style="color: #09090b; padding-bottom: 8px;">${new Date(timestamp).toLocaleString()}</td>
          </tr>
          ${location ? `
          <tr>
            <td valign="top" style="font-weight: bold; padding-bottom: 8px; color: #7f1d1d;">Coordinates</td>
            <td style="color: #09090b; padding-bottom: 8px;">
              Lat: ${location.lat}, Lng: ${location.lng}
            </td>
          </tr>
          ` : ''}
        </table>
        ${location ? `
        <div style="margin-top: 15px;">
          <a href="${googleMapsLink}" style="display: inline-block; background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">View on Google Maps</a>
        </div>
        ` : `
        <p style="margin: 10px 0 0 0; font-size: 13px; color: #7f1d1d; font-style: italic;">GPS location services were disabled or unavailable on the user's beacon.</p>
        `}
      </div>
      <p style="font-size: 14px; color: #7f1d1d; font-weight: bold; margin-top: 20px;">
        Please attempt to contact the traveler immediately, verify their safety, and notify local first responders or authorities if contact cannot be established.
      </p>
    `;

    const data = await resend.emails.send({
      from: 'Healix SOS <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: subject,
      html: getEmailTemplateHtml({
        subjectTitle: subject,
        recipientName: recipientName,
        bodyHtml: bodyHtml,
        senderName: 'Suraksha Dispatch console',
        senderRole: 'Incident Response Bot',
        senderEmail: 'alerts@healix-technologies.com'
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
