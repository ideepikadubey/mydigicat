import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email, firmName, mode } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    // Generate random 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check for SMTP credentials in environment
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"MyDigiCatalogue" <noreply@mydigicatalogue.com>`;
    const resendApiKey = process.env.RESEND_API_KEY;

    let emailSent = false;
    let deliveryError: string | null = null;

    // 1. Try Resend if configured
    if (resendApiKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: smtpFrom,
            to: email,
            subject: `Your MyDigiCatalogue Verification Code: ${otp}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">MyDigiCatalogue</h2>
                  <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Digital Catalogues & WhatsApp Commerce</p>
                </div>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                  <p style="color: #475569; font-size: 13px; margin: 0 0 12px 0;">Your 6-digit verification code is:</p>
                  <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0f172a; font-family: monospace;">${otp}</div>
                  <p style="color: #94a3b8; font-size: 11px; margin: 12px 0 0 0;">Valid for 10 minutes. Please do not share this code.</p>
                </div>
                <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">If you did not request this verification, you can safely ignore this email.</p>
              </div>
            `,
          }),
        });

        if (res.ok) {
          emailSent = true;
        } else {
          const errData = await res.json();
          deliveryError = errData.message || "Resend API error";
        }
      } catch (err: any) {
        deliveryError = err.message;
      }
    }

    // 2. Try Nodemailer SMTP if configured
    if (!emailSent && smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: `Your MyDigiCatalogue Verification Code: ${otp}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 28px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">MyDigiCatalogue</h2>
                <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Digital Catalogues & WhatsApp Commerce</p>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: #475569; font-size: 13px; margin: 0 0 12px 0;">Your 6-digit verification code is:</p>
                <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0f172a; font-family: monospace;">${otp}</div>
                <p style="color: #94a3b8; font-size: 11px; margin: 12px 0 0 0;">Valid for 10 minutes. Please do not share this code.</p>
              </div>
              <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">If you did not request this verification, you can safely ignore this email.</p>
            </div>
          `,
        });

        emailSent = true;
      } catch (err: any) {
        deliveryError = err.message;
      }
    }

    return NextResponse.json({
      success: true,
      otp,
      emailSent,
      isMock: !emailSent,
      deliveryError,
      message: emailSent
        ? `Verification code dispatched to ${email}`
        : `Email sent in Development Sandbox mode. Code is ${otp}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process OTP request" },
      { status: 500 }
    );
  }
}
