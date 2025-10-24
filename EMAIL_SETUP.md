# Email Setup Guide

## Using Gmail SMTP (Recommended for Testing)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", enable **2-Step Verification**

### Step 2: Generate App Password

1. After enabling 2FA, go back to **Security**
2. Under "Signing in to Google", click **2-Step Verification**
3. Scroll down and click **App passwords**
4. Select **Mail** and **Other (Custom name)**, name it "Ecommerce Template"
5. Click **Generate**
6. **Copy the 16-character password** (spaces don't matter)

### Step 3: Update .env.local

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password-here
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=E-commerce Template
```

### Step 4: Test Email

After setting up, test by:

1. Making a purchase (test payment)
2. Joining waitlist
3. Check your email inbox (and spam folder)

---

## Alternative: Using Other Email Providers

### Zoho Mail

```bash
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@zoho.com
SMTP_PASSWORD=your-password
```

### Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### SendGrid (Production Recommended)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

---

## Email Features Implemented

### Customer Emails:

✅ Purchase confirmation with package details
✅ Next steps based on package (Template vs Setup)
✅ Waitlist confirmation

### Admin Emails (sent to your SMTP_USER):

✅ New purchase notifications
✅ Customer contact details
✅ Action required alerts for setup packages

---

## Troubleshooting

### Emails not sending?

1. Check SMTP credentials in `.env.local`
2. Verify 2FA and App Password for Gmail
3. Check spam folder
4. Look at terminal logs for errors

### Gmail blocking emails?

- Make sure you're using App Password, not regular password
- Enable "Less secure app access" (not recommended)
- Use SendGrid for production

### Still having issues?

Check the server logs in terminal - it will show email sending errors.
