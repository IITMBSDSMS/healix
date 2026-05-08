import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export async function POST(request: Request) {
  try {
    const { name, email, idea_title } = await request.json();

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'YOUR_RESEND_API_KEY') {
      console.log(`[MOCK EMAIL] BioLab Application confirmation sent to ${email} for "${idea_title}"`);
      return NextResponse.json({ success: true, mocked: true });
    }

    const data = await resend.emails.send({
      from: 'Healix BioLabs <research@resend.dev>', // Update to verified domain in prod
      to: [email],
      subject: `Application Received: ${idea_title}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background-color: #9333ea; color: white; padding: 40px; border-radius: 12px;">
          <h1 style="margin-top: 0;">🧪 Healix BioLabs</h1>
          <p style="font-size: 18px;">Hello ${name},</p>
          <p style="font-size: 16px;">
            Thank you for submitting your research idea <strong>"${idea_title}"</strong> to the Healix BioLabs accelerator.
          </p>
          <div style="background-color: white; color: black; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Our review committee has received your application. We evaluate proposals based on innovation, feasibility, and alignment with our core areas (AI, Healthcare, Safety).</p>
            <p>You will receive an update on your application status within 14 business days.</p>
          </div>
          <p style="font-size: 12px; color: #e9d5ff;">This is an early-stage research initiative. Not intended for clinical validation.</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
