import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  company?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestsByIp = new Map<string, number[]>();

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL;
const contactNotificationWebhookUrl = process.env.CONTACT_NOTIFICATION_WEBHOOK_URL;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sendContactNotification = async (payload: ContactPayload) => {
  if (!contactNotificationWebhookUrl) {
    return;
  }

  const preview = payload.message.length > 240 ? `${payload.message.slice(0, 240)}...` : payload.message;
  const notificationText = [
    'New portfolio contact message',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Message: ${preview}`,
    `Received: ${new Date().toISOString()}`,
  ].join('\n');

  try {
    const response = await fetch(contactNotificationWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: notificationText,
        content: notificationText,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Contact notification webhook failed:', response.status, body);
    }
  } catch (error) {
    console.error('Contact notification webhook error:', error);
  }
};

const getClientIp = (request: NextRequest) => {
  const ipFromHeaders = [
    request.headers.get('x-forwarded-for'),
    request.headers.get('x-real-ip'),
    request.headers.get('cf-connecting-ip'),
    request.headers.get('x-vercel-forwarded-for'),
  ];

  for (const headerValue of ipFromHeaders) {
    if (headerValue) {
      return headerValue.split(',')[0]?.trim() ?? 'unknown';
    }
  }

  return 'unknown';
};

const isRateLimited = (ipAddress: string) => {
  const now = Date.now();
  const existing = requestsByIp.get(ipAddress) ?? [];
  const recentRequests = existing.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestsByIp.set(ipAddress, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestsByIp.set(ipAddress, recentRequests);
  return false;
};

const parsePayload = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return { ok: false as const, message: 'Invalid request payload.' };
  }

  const body = payload as Record<string, unknown>;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';

  if (name.length < 2 || name.length > 100) {
    return { ok: false as const, message: 'Name must be between 2 and 100 characters.' };
  }

  if (!emailPattern.test(email)) {
    return { ok: false as const, message: 'Please provide a valid email address.' };
  }

  if (message.length < 10 || message.length > 3000) {
    return { ok: false as const, message: 'Message must be between 10 and 3000 characters.' };
  }

  return {
    ok: true as const,
    data: {
      name,
      email,
      message,
      company,
    } satisfies ContactPayload,
  };
};

export async function POST(request: NextRequest) {
  const ipAddress = getClientIp(request);

  if (isRateLimited(ipAddress)) {
    return NextResponse.json({ message: 'Too many attempts. Please wait a minute and try again.' }, { status: 429 });
  }

  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON payload.' }, { status: 400 });
  }

  const payload = parsePayload(rawPayload);
  if (!payload.ok) {
    return NextResponse.json({ message: payload.message }, { status: 400 });
  }

  if (payload.data.company) {
    return NextResponse.json({ message: 'Thanks for reaching out. I will get back to you soon.' }, { status: 200 });
  }

  if (!resend || !contactToEmail || !contactFromEmail) {
    return NextResponse.json(
      { message: 'Contact form is not configured on the server yet.' },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: payload.data.email,
      subject: `New portfolio message from ${payload.data.name}`,
      text: [
        `Name: ${payload.data.name}`,
        `Email: ${payload.data.email}`,
        '',
        'Message:',
        payload.data.message,
      ].join('\n'),
    });

    if (error) {
      console.error('Resend send error:', error);
      const message =
        process.env.NODE_ENV === 'development'
          ? `Resend error: ${error.message}`
          : 'Unable to send your message right now. Please try again later.';

      return NextResponse.json({ message }, { status: 502 });
    }

    await sendContactNotification(payload.data);

    return NextResponse.json(
      {
        message: 'Thanks for reaching out. I will get back to you soon.',
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected send error:', error);
    return NextResponse.json(
      { message: 'Unable to send your message right now. Please try again later.' },
      { status: 502 }
    );
  }
}