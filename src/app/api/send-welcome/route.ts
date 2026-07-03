import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { getEmailTemplateHtml } from '@/utils/emailTemplate';

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
    
    const subject = 'Welcome to Healix';
    const recipientName = name || 'User';
    const bodyHtml = `
      <p style="margin-top: 0; margin-bottom: 16px;">
        We are thrilled to welcome you to <strong>Healix Technologies</strong>—your intelligent human-care platform.
      </p>
      <p style="margin-bottom: 20px; line-height: 1.6;">
        At Healix, we combine a smart health guidance system, seamless medical access, early-stage biotechnology research, and a women's safety ecosystem (Project Suraksha). We exist to bridge the gap between healthcare, research, technology, and education.
      </p>
      <p style="margin-bottom: 24px; line-height: 1.6;">
        Ready to explore? Head over to your dashboard to get started with your clinical portal.
      </p>
    `;

    const data = await resend.emails.send({
      from: 'Healix <onboarding@resend.dev>',
      to: [recipient],
      subject: subject,
      html: getEmailTemplateHtml({
        subjectTitle: subject,
        recipientName: recipientName,
        bodyHtml: bodyHtml,
        senderName: 'Healix Onboarding',
        senderRole: 'User Experience Team',
        senderEmail: 'onboarding@healix-technologies.com'
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
