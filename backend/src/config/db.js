import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;
let sharedUri = null;

export async function connectDB(uri) {
  // Use shared in-memory database for development if no URI provided
  if (!uri || uri.includes('cluster0.mongodb.net')) {
    if (process.env.NODE_ENV !== 'production') {
      if (!mongoServer) {
        console.log('Creating shared MongoDB Memory Server for development...');
        mongoServer = await MongoMemoryServer.create({
          instance: {
            port: 27017,
          },
        });
        sharedUri = mongoServer.getUri();
        console.log('Shared memory server URI:', sharedUri);
      }
      uri = sharedUri;
    } else {
      throw new Error('Missing MongoDB URI for production');
    }
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { autoIndex: true });
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
    sharedUri = null;
  }
}
