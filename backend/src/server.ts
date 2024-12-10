import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
// @ts-ignore
import cors from 'cors';
import TicketRoutes from './routes/ticketRoutes';

const start = async () => {
  try {
    // Creating the mongoDB memory server
    //const mongoServer = await MongoMemoryServer.create();

    // Connecting to the mongoDB memory server using mongoose
    mongoose
    .connect(process.env.MONGO_URL || "mongodb://localhost:27017/ticketsDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

    

    // Creating the express app
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/tickets', TicketRoutes);

    // Starting the server
    await new Promise<void>((resolve, reject) => {
      app.listen(3000, resolve).on('error', reject);
    });

    console.log(`Server started at http://localhost:3000`);
  } catch (error: unknown) {
    console.log(error);
    process.exit(1);
  }
};

process.on('beforeExit', async () => {
  await mongoose.disconnect();
  console.log('mongoose disconnected');
});

if (require.main === module) {
  start();
}

export { start };
