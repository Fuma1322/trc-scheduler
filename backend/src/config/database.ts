import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(uri);

let database: Db | null = null;

export async function connectDatabase(): Promise<Db> {
  if (database) {
    return database;
  }

  await client.connect();

  database = client.db(
    process.env.MONGODB_DB || 'trc_booking'
  );

  console.log('MongoDB connected');

  return database;
}

export function getDatabase(): Db {
  if (!database) {
    throw new Error(
      'Database has not been connected. Call connectDatabase() first.'
    );
  }

  return database;
}
