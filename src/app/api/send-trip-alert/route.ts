import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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
    const data = await resend.emails.send({
      from: 'Healix Suraksha <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `🚨 SURAKSHA ALERT: ${userName} has started a trip.`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background-color: #f97316; color: white; padding: 40px; border-radius: 12px;">
          <h1 style="margin-top: 0;">🚖 SURAKSHA TRIP STARTED</h1>
          <p style="font-size: 18px; font-weight: bold;">
            ${userName || 'Your trusted contact'} has boarded a vehicle and activated Project Suraksha.
          </p>
          <div style="background-color: white; color: black; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
            <p>They have shared their live location with you.</p>
            
            <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
              <a href="${trackingLink}" style="display: inline-block; background-color: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
                Track Live Location
              </a>
            </div>
            
            <p style="font-size: 12px; color: #666; text-align: center;">Click the button above to view their real-time GPS coordinates and route.</p>
          </div>
          <p style="font-size: 14px;">This is an automated safety alert from Healix Technologies.</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
