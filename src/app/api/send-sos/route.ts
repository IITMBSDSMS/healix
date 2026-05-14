import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'healixtechnologies@gmail.com';
    const data = await resend.emails.send({
      from: 'Healix SOS <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `🚨 EMERGENCY SOS ALERT: ${name || 'A User'} Needs Help!`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background-color: #ef4444; color: white; padding: 40px; border-radius: 12px;">
          <h1 style="margin-top: 0;">🚨 EMERGENCY SOS ALERT</h1>
          <p style="font-size: 18px; font-weight: bold;">
            ${name || 'A user'} has triggered an emergency alert via Healix SheSecure.
          </p>
          <div style="background-color: white; color: black; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
            ${location ? `
              <p><strong>Location Details:</strong></p>
              <ul>
                <li>Latitude: ${location.lat}</li>
                <li>Longitude: ${location.lng}</li>
              </ul>
              <a href="${googleMapsLink}" style="display: inline-block; margin-top: 10px; background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">View on Google Maps</a>
            ` : `
              <p><strong>Location:</strong> Location services were disabled or unavailable.</p>
            `}
          </div>
          <p style="font-size: 14px;">Please try to contact them immediately or notify local authorities if necessary.</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
