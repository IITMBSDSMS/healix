import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'YOUR_RESEND_API_KEY') {
      console.log(`[MOCK EMAIL] Welcome Email sent to ${email} (Name: ${name})`);
      return NextResponse.json({ success: true, mocked: true });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'office@healix-technologies.com';
    // In test mode, Resend only allows sending to the account owner email
    const recipient = process.env.RESEND_DOMAIN_VERIFIED === 'true' ? email : ADMIN_EMAIL;
    const data = await resend.emails.send({
      from: 'Healix <onboarding@resend.dev>',
      to: [recipient],
      subject: 'Welcome to Healix',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background-color: #050505; color: #ededed; padding: 40px; border-radius: 12px; border: 1px solid #333;">
          <h1 style="color: #6366f1;">Welcome to Healix, ${name || 'User'}!</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #ccc;">
            We're thrilled to have you join our intelligent human-care platform. 
            At Healix, we combine a smart health guidance system, seamless medical access, early-stage biotechnology research, and a women's safety ecosystem.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="font-size: 14px; color: #888;">
              Ready to explore? Head over to your dashboard to get started.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
