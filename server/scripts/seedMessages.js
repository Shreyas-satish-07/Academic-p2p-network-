import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Development safety guard
if (process.env.NODE_ENV === 'production') {
  console.error('⛔ ERROR: Seed script cannot be executed in production environment.');
  process.exit(1);
}

const seedMessages = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    console.log('🔄 Connecting to MongoDB database...');
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await mongoose.connect(mongoUri);
        break;
      } catch (connErr) {
        if (attempt === 3) throw connErr;
        console.warn(`Connection attempt ${attempt} failed, retrying in 2 seconds...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    console.log('✅ Connected to MongoDB.');

    // Fetch existing users from database
    const existingUsers = await User.find({});
    if (existingUsers.length < 2) {
      console.error('⛔ Need at least 2 existing students. Please run npm run seed first.');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Helper map of users by email or first name
    const userMap = {};
    for (const u of existingUsers) {
      userMap[u.email.toLowerCase()] = u;
      const firstName = u.name.split(' ')[0].toLowerCase();
      if (!userMap[firstName]) {
        userMap[firstName] = u;
      }
    }

    const getUser = (identifier, fallbackIndex = 0) => {
      const key = identifier.toLowerCase();
      return userMap[key] || existingUsers[fallbackIndex % existingUsers.length];
    };

    const ananya = getUser('ananya.rao@cohort.internal', 0);
    const rahul = getUser('rahul.sharma@cohort.internal', 1);
    const priya = getUser('priya.nair@cohort.internal', 2);
    const divya = getUser('divya.prasad@cohort.internal', 3);
    const karthik = getUser('karthik.sundaram@cohort.internal', 4);

    console.log('🧹 Clearing old seed conversations and messages...');
    await Message.deleteMany({});
    await Conversation.deleteMany({});

    console.log('🌱 Seeding direct conversations and message histories...');

    // 1. Direct Conversation between Ananya and Rahul
    const conv1 = await Conversation.create({
      type: 'direct',
      participants: [ananya._id, rahul._id],
      lastMessage: {
        content: 'Sounds good! I have pushed the BCNF decomposition formulas to GitHub.',
        sender: ananya._id,
        sentAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      },
    });

    const messagesConv1 = [
      {
        conversation: conv1._id,
        sender: rahul._id,
        content: 'Hey Ananya, did you check out the lecture notes on DBMS Normalization?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        readBy: [
          { user: rahul._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
          { user: ananya._id, readAt: new Date(Date.now() - 1000 * 60 * 50) },
        ],
      },
      {
        conversation: conv1._id,
        sender: ananya._id,
        content: 'Yes! The 3NF synthesis algorithm section was super clear. Are you free to review dependency preservation this afternoon?',
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        readBy: [
          { user: ananya._id, readAt: new Date(Date.now() - 1000 * 60 * 45) },
          { user: rahul._id, readAt: new Date(Date.now() - 1000 * 60 * 30) },
        ],
      },
      {
        conversation: conv1._id,
        sender: rahul._id,
        content: 'Definitely, let us meet in the CS library after our lab session.',
        createdAt: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
        readBy: [
          { user: rahul._id, readAt: new Date(Date.now() - 1000 * 60 * 25) },
          { user: ananya._id, readAt: new Date(Date.now() - 1000 * 60 * 20) },
        ],
      },
      {
        conversation: conv1._id,
        sender: ananya._id,
        content: 'Sounds good! I have pushed the BCNF decomposition formulas to GitHub.',
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        readBy: [
          { user: ananya._id, readAt: new Date(Date.now() - 1000 * 60 * 15) },
          { user: rahul._id, readAt: new Date(Date.now() - 1000 * 60 * 10) },
        ],
      },
    ];
    await Message.insertMany(messagesConv1);

    // 2. Direct Conversation between Ananya and Priya
    const conv2 = await Conversation.create({
      type: 'direct',
      participants: [ananya._id, priya._id],
      lastMessage: {
        content: 'Let us test with 5 processes and 3 resource types to check for deadlock cycles.',
        sender: priya._id,
        sentAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      },
    });

    const messagesConv2 = [
      {
        conversation: conv2._id,
        sender: ananya._id,
        content: 'Hi Priya, how is the Bankers algorithm implementation coming along for OS lab?',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        readBy: [
          { user: ananya._id, readAt: new Date(Date.now() - 1000 * 60 * 30) },
          { user: priya._id, readAt: new Date(Date.now() - 1000 * 60 * 20) },
        ],
      },
      {
        conversation: conv2._id,
        sender: priya._id,
        content: 'Safety algorithm is verified! Just finishing the resource request routine.',
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        readBy: [
          { user: priya._id, readAt: new Date(Date.now() - 1000 * 60 * 15) },
          { user: ananya._id, readAt: new Date(Date.now() - 1000 * 60 * 10) },
        ],
      },
      {
        conversation: conv2._id,
        sender: priya._id,
        content: 'Let us test with 5 processes and 3 resource types to check for deadlock cycles.',
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
        readBy: [{ user: priya._id, readAt: new Date(Date.now() - 1000 * 60 * 5) }],
      },
    ];
    await Message.insertMany(messagesConv2);

    // 3. Direct Conversation between Rahul and Divya
    const conv3 = await Conversation.create({
      type: 'direct',
      participants: [rahul._id, divya._id],
      lastMessage: {
        content: 'Thanks Rahul, the matrix chain multiplication explanation helped a lot!',
        sender: divya._id,
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      },
    });

    const messagesConv3 = [
      {
        conversation: conv3._id,
        sender: divya._id,
        content: 'Hey Rahul, do you remember the recurrence relation for the matrix chain order?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        readBy: [
          { user: divya._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 6) },
          { user: rahul._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 5.5) },
        ],
      },
      {
        conversation: conv3._id,
        sender: rahul._id,
        content: 'm[i, j] = min(m[i, k] + m[k+1, j] + p[i-1]*p[k]*p[j]) for k between i and j-1.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5.2),
        readBy: [
          { user: rahul._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 5.2) },
          { user: divya._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 5.1) },
        ],
      },
      {
        conversation: conv3._id,
        sender: divya._id,
        content: 'Thanks Rahul, the matrix chain multiplication explanation helped a lot!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        readBy: [
          { user: divya._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
          { user: rahul._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 4.9) },
        ],
      },
    ];
    await Message.insertMany(messagesConv3);

    // 4. Direct Conversation between Priya and Karthik
    const conv4 = await Conversation.create({
      type: 'direct',
      participants: [priya._id, karthik._id],
      lastMessage: {
        content: 'I will write the test cases with priority queues tonight.',
        sender: karthik._id,
        sentAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
      },
    });

    const messagesConv4 = [
      {
        conversation: conv4._id,
        sender: priya._id,
        content: 'Are we using min-heaps or Fibonacci heaps for Dijkstra shortest path?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        readBy: [
          { user: priya._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5) },
          { user: karthik._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 1.2) },
        ],
      },
      {
        conversation: conv4._id,
        sender: karthik._id,
        content: 'Standard binary min-heap gives O((V+E) log V) which is ideal for sparse graphs.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.1),
        readBy: [
          { user: karthik._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 1.1) },
          { user: priya._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 1.05) },
        ],
      },
      {
        conversation: conv4._id,
        sender: karthik._id,
        content: 'I will write the test cases with priority queues tonight.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
        readBy: [{ user: karthik._id, readAt: new Date(Date.now() - 1000 * 60 * 60 * 1) }],
      },
    ];
    await Message.insertMany(messagesConv4);

    console.log(`✅ Successfully seeded 4 direct conversations and ${messagesConv1.length + messagesConv2.length + messagesConv3.length + messagesConv4.length} historical messages.`);

    await mongoose.connection.close();
    console.log('🔒 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed messages:', error);
    try {
      await mongoose.connection.close();
    } catch {
      // Ignore close error
    }
    process.exit(1);
  }
};

seedMessages();
