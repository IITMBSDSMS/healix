import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { getEmailTemplateHtml } from '@/utils/emailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export async function POST(request: Request) {
  try {
    const { name, email, idea_title } = await request.json();

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'YOUR_RESEND_API_KEY') {
      console.log(`[MOCK EMAIL] BioLab Application confirmation sent to ${email} for "${idea_title}"`);
      return NextResponse.json({ success: true, mocked: true });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'office@healix-technologies.com';
    const recipient = process.env.RESEND_DOMAIN_VERIFIED === 'true' ? email : ADMIN_EMAIL;
    
    const subject = `Application Received: ${idea_title}`;
    const recipientName = name || 'Applicant';
    const bodyHtml = `
      <p style="margin-top: 0; margin-bottom: 16px;">
        Thank you for submitting your research proposal/idea <strong>"${idea_title}"</strong> to the <strong>Healix BioLabs</strong> accelerator program.
      </p>
      <div style="background-color: #ffffff; border: 1px solid #e4e4e7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0; margin-bottom: 10px; color: #09090b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Application Review Protocol</h4>
        <p style="margin: 0; font-size: 13.5px; color: #71717a; line-height: 1.5; margin-bottom: 10px;">
          Our Scientific Advisory Board has successfully received your proposal in our queue. We evaluate proposals based on technical innovation, clinical feasibility, and structural alignment with our primary verticals (AI-directed diagnostics, precision genomics, and edge telemetry safety).
        </p>
        <p style="margin: 0; font-size: 13.5px; color: #71717a; line-height: 1.5;">
          An academic coordinator will reach out to you with initial feedback and status updates within 14 business days.
        </p>
      </div>
      <p style="font-size: 11px; color: #71717a; margin-top: 20px; font-style: italic;">
        Notice: Healix BioLabs is an early-stage biomedical research and development sandbox. All software tools, models, and genomic pipelines are intended for research purposes only and not certified for clinical diagnostic validation.
      </p>
    `;

    const data = await resend.emails.send({
      from: 'Healix BioLabs <onboarding@resend.dev>',
      to: [recipient],
      subject: subject,
      html: getEmailTemplateHtml({
        subjectTitle: subject,
        recipientName: recipientName,
        bodyHtml: bodyHtml,
        senderName: 'Healix BioLabs Office',
        senderRole: 'Scientific Advisory Committee',
        senderEmail: 'biolabs@healix-technologies.com'
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
