// Zeptomail HTTP API (more reliable than SMTP)
async function sendViaZeptomailAPI(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const token = process.env.ZEPTOMAIL_API_TOKEN;
  if (!token) {
    throw new Error('ZEPTOMAIL_API_TOKEN not configured');
  }

  const payload = {
    from: {
      address: process.env.ZEPTOMAIL_FROM_EMAIL || 'noreply@zabug.com',
      name: process.env.ZEPTOMAIL_FROM_NAME || 'E-commerce Template',
    },
    to: [
      {
        email_address: {
          address: options.to,
        },
      },
    ],
    subject: options.subject,
    htmlbody: options.html,
  };

  console.log('Sending email via Zeptomail API to:', options.to);

  const response = await fetch('https://api.zeptomail.com/v1.1/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Zeptomail API error:', {
      status: response.status,
      statusText: response.statusText,
      data,
    });
    throw new Error(`Zeptomail API error: ${JSON.stringify(data)}`);
  }

  return data;
}

// Email templates
export const emailTemplates = {
  // When someone purchases
  purchaseConfirmation: (data: {
    fullName: string;
    email: string;
    package: string;
    amount: number;
    reference: string;
  }) => ({
    subject: `Payment Confirmed - ${data.package}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
          .button { background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Payment Successful!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.fullName},</h2>
            <p>Thank you for your purchase! Your payment has been confirmed.</p>
            
            <div class="details">
              <div class="details-row">
                <strong>Package:</strong>
                <span>${data.package}</span>
              </div>
              <div class="details-row">
                <strong>Amount Paid:</strong>
                <span>₦${data.amount.toLocaleString()}</span>
              </div>
              <div class="details-row">
                <strong>Reference:</strong>
                <span>${data.reference}</span>
              </div>
            </div>

            ${data.package.includes('Setup') ? `
              <h3>What's Next?</h3>
              <p>Our team will contact you within 24 hours to:</p>
              <ul>
                <li>Schedule your onboarding call</li>
                <li>Collect your branding materials (logo, colors)</li>
                <li>Set up your Vercel deployment</li>
                <li>Configure your custom domain</li>
              </ul>
            ` : `
              <h3>What's Next?</h3>
              <p>You'll receive the template source code and documentation within 24 hours via email.</p>
            `}
            
            <p>If you have any questions, simply reply to this email.</p>
            
            <div class="footer">
              <p>E-commerce Template Marketplace</p>
              <p>This is an automated confirmation email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Admin notification when someone purchases
  adminPurchaseNotification: (data: {
    fullName: string;
    email: string;
    package: string;
    amount: number;
    reference: string;
  }) => ({
    subject: `🔔 New Purchase: ${data.package} - ₦${data.amount.toLocaleString()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
          .alert { background: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 8px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .row { padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert">
            <h2>💰 New Purchase Alert!</h2>
          </div>
          <div class="details">
            <div class="row"><strong>Customer:</strong> ${data.fullName}</div>
            <div class="row"><strong>Email:</strong> ${data.email}</div>
            <div class="row"><strong>Package:</strong> ${data.package}</div>
            <div class="row"><strong>Amount:</strong> ₦${data.amount.toLocaleString()}</div>
            <div class="row"><strong>Reference:</strong> ${data.reference}</div>
            <div class="row"><strong>Time:</strong> ${new Date().toLocaleString()}</div>
          </div>
          ${data.package.includes('Setup') ? '<p><strong>⚠️ Action Required:</strong> Contact customer within 24 hours for setup.</p>' : ''}
        </div>
      </body>
      </html>
    `,
  }),

  // Waitlist confirmation
  waitlistConfirmation: (data: { fullName: string; email: string }) => ({
    subject: 'You\'re on the Waitlist! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 You're In!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.fullName},</h2>
            <p>Thanks for joining our affiliate program waitlist!</p>
            <p>We'll notify you as soon as we launch. Get ready to earn <strong>20% commission</strong> on every sale you refer!</p>
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>Early access to the affiliate dashboard</li>
              <li>Marketing materials and resources</li>
              <li>Dedicated support for affiliates</li>
            </ul>
            <p>Stay tuned! 🎯</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const result = await sendViaZeptomailAPI(options);
    console.log('Email sent successfully via Zeptomail API:', result);
    return { success: true, messageId: result.request_id };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

// Helper functions for common emails
export async function sendPurchaseConfirmation(data: {
  fullName: string;
  email: string;
  package: string;
  amount: number;
  reference: string;
}) {
  const template = emailTemplates.purchaseConfirmation(data);
  return sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAdminNotification(data: {
  fullName: string;
  email: string;
  package: string;
  amount: number;
  reference: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ZEPTOMAIL_FROM_EMAIL;
  if (!adminEmail) {
    console.error('Admin email not configured');
    return { success: false };
  }

  const template = emailTemplates.adminPurchaseNotification(data);
  return sendEmail({
    to: adminEmail,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendWaitlistConfirmation(data: {
  fullName: string;
  email: string;
}) {
  const template = emailTemplates.waitlistConfirmation(data);
  return sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
  });
}
