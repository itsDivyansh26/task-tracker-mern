import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task.js';

dotenv.config();

let mongoServer;

const seedTasks = async () => {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      console.log('Seeding initial mock data...');
      
      const today = new Date();
      
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(today.getDate() - 2);
      
      const oneDayAgo = new Date();
      oneDayAgo.setDate(today.getDate() - 1);
      
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);
      
      const fiveDaysLater = new Date();
      fiveDaysLater.setDate(today.getDate() + 5);

      await Task.insertMany([
        {
          title: "Build TaskFlow Landing Page",
          description: "Design a responsive landing page with premium animations.",
          status: "completed",
          priority: "high",
          dueDate: twoDaysAgo
        },
        {
          title: "Integrate MongoDB Database",
          description: "Set up mongoose schemas, connection parameters, and fallback configurations.",
          status: "completed",
          priority: "medium",
          dueDate: oneDayAgo
        },
        {
          title: "Design Glassmorphic User Interface",
          description: "Develop card templates, color tokens, and smooth light/dark mode transitions.",
          status: "in-progress",
          priority: "high",
          dueDate: today
        },
        {
          title: "Set up REST API Endpoints",
          description: "Implement controllers and routes for task CRUD operations.",
          status: "in-progress",
          priority: "medium",
          dueDate: tomorrow
        },
        {
          title: "Implement JWT Security Middleware",
          description: "Secure user sessions using token verification.",
          status: "todo",
          priority: "high",
          dueDate: threeDaysLater
        },
        {
          title: "Configure CI/CD Pipelines",
          description: "Automate build and deployment flows to public cloud platforms.",
          status: "todo",
          priority: "low",
          dueDate: fiveDaysLater
        }
      ]);
      console.log('Initial mock data seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await seedTasks();
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      console.log('In-memory MongoDB stopped.');
    }
  } catch (error) {
    console.error(`Database Disconnection Error: ${error.message}`);
  }
};
