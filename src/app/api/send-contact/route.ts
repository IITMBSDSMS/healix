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
    const data = await resend.emails.send({
      from: 'Healix Contact <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background-color: #f9f9f9; color: #333; padding: 40px; border-radius: 12px; border: 1px solid #eaeaea;">
          <h2 style="color: #6366f1; margin-top: 0;">New Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
