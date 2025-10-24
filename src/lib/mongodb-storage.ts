import clientPromise from './mongodb';
import { Lead, WaitlistEntry } from './storage';

const DB_NAME = 'ecommerce_landing';

// Lead operations
export async function saveLeadToDB(lead: Lead): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('leads');
    
    await collection.insertOne({
      ...lead,
      createdAt: new Date(lead.createdAt),
      paidAt: lead.paidAt ? new Date(lead.paidAt) : undefined,
    });
    
    console.log('Lead saved to MongoDB:', lead.reference);
  } catch (error) {
    console.error('MongoDB save lead error:', error);
    // Don't throw - we want to continue even if MongoDB fails
  }
}

export async function updateLeadInDB(
  reference: string,
  status: 'paid' | 'failed',
  paidAt?: string
): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('leads');
    
    const update: any = { status };
    if (paidAt) {
      update.paidAt = new Date(paidAt);
    }
    
    await collection.updateOne(
      { reference },
      { $set: update }
    );
    
    console.log('Lead updated in MongoDB:', reference);
  } catch (error) {
    console.error('MongoDB update lead error:', error);
  }
}

export async function getLeadFromDB(reference: string): Promise<Lead | null> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('leads');
    
    const lead = await collection.findOne({ reference });
    return lead as unknown as Lead | null;
  } catch (error) {
    console.error('MongoDB get lead error:', error);
    return null;
  }
}

export async function getAllLeadsFromDB(): Promise<Lead[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('leads');
    
    const leads = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return leads as unknown as Lead[];
  } catch (error) {
    console.error('MongoDB get all leads error:', error);
    return [];
  }
}

// Waitlist operations
export async function saveWaitlistToDB(entry: WaitlistEntry): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('waitlist');
    
    await collection.insertOne({
      ...entry,
      createdAt: new Date(entry.createdAt),
    });
    
    console.log('Waitlist entry saved to MongoDB:', entry.email);
  } catch (error) {
    console.error('MongoDB save waitlist error:', error);
  }
}

export async function getAllWaitlistFromDB(): Promise<WaitlistEntry[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('waitlist');
    
    const entries = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return entries as unknown as WaitlistEntry[];
  } catch (error) {
    console.error('MongoDB get waitlist error:', error);
    return [];
  }
}

export async function checkWaitlistEmailExists(email: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('waitlist');
    
    const entry = await collection.findOne({ email });
    return !!entry;
  } catch (error) {
    console.error('MongoDB check waitlist email error:', error);
    return false;
  }
}
