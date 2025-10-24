import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.json');

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  package: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  reference: string;
  createdAt: string;
  paidAt?: string;
}

export interface WaitlistEntry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
  }
}

// Get all leads
export function getAllLeads(): Lead[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leads:', error);
    return [];
  }
}

// Add a new lead
export function addLead(lead: Lead): void {
  ensureDataDir();
  const leads = getAllLeads();
  leads.push(lead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// Update lead status
export function updateLeadStatus(reference: string, status: 'paid' | 'failed', paidAt?: string): void {
  ensureDataDir();
  const leads = getAllLeads();
  const leadIndex = leads.findIndex(l => l.reference === reference);
  
  if (leadIndex !== -1) {
    leads[leadIndex].status = status;
    if (paidAt) {
      leads[leadIndex].paidAt = paidAt;
    }
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  }
}

// Get lead by reference
export function getLeadByReference(reference: string): Lead | undefined {
  const leads = getAllLeads();
  return leads.find(l => l.reference === reference);
}

// Waitlist functions
function ensureWaitlistFile() {
  ensureDataDir();
  if (!fs.existsSync(WAITLIST_FILE)) {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify([], null, 2));
  }
}

export function getAllWaitlistEntries(): WaitlistEntry[] {
  ensureWaitlistFile();
  try {
    const data = fs.readFileSync(WAITLIST_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading waitlist:', error);
    return [];
  }
}

export function addToWaitlist(entry: WaitlistEntry): void {
  ensureWaitlistFile();
  const waitlist = getAllWaitlistEntries();
  
  // Check if email already exists
  const exists = waitlist.some(w => w.email.toLowerCase() === entry.email.toLowerCase());
  if (exists) {
    throw new Error('Email already registered in waitlist');
  }
  
  waitlist.push(entry);
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));
}
