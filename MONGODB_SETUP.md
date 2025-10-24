# MongoDB Setup Guide

## Option 1: Local MongoDB (Development)

1. **Install MongoDB Community Server**

   - Download from: https://www.mongodb.com/try/download/community
   - Run the installer and follow the setup wizard
   - MongoDB will run as a Windows service automatically

2. **Verify Installation**

   ```powershell
   mongod --version
   ```

3. **Your connection string is already set in `.env.local`:**

   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce_landing
   ```

4. **Data will be stored automatically** when you make a payment or join the waitlist

---

## Option 2: MongoDB Atlas (Production - Free Tier Available)

1. **Create a MongoDB Atlas Account**

   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Free Cluster**

   - Choose the free M0 tier
   - Select a region close to you
   - Click "Create Cluster"

3. **Configure Database Access**

   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set privileges to "Read and write to any database"

4. **Configure Network Access**

   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add only your server IP

5. **Get Your Connection String**

   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (it looks like this):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
     ```
   - Replace `<username>` and `<password>` with your credentials
   - Add `/ecommerce_landing` at the end

6. **Update `.env.local`:**
   ```bash
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/ecommerce_landing
   ```

---

## What Gets Stored in MongoDB

### Leads Collection

Every payment attempt stores:

- Full Name
- Email
- Mobile Number (WhatsApp)
- Package (Template Only or Template + Setup)
- Amount
- Payment Status (pending/paid/failed)
- Payment Reference
- Created At / Paid At timestamps

### Waitlist Collection

Every waitlist signup stores:

- Full Name
- Email
- Created At timestamp

---

## Viewing Your Data

### Local MongoDB

Use MongoDB Compass (comes with MongoDB installation):

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Browse the `ecommerce_landing` database

### MongoDB Atlas

1. Go to your Atlas cluster
2. Click "Browse Collections"
3. View `leads` and `waitlist` collections

---

## Backup Strategy

**Both JSON files AND MongoDB are used:**

- JSON files (`data/leads.json`, `data/waitlist.json`) - Immediate backup
- MongoDB - Primary database with better querying and scalability

If MongoDB is unavailable, the system continues working with JSON files.
