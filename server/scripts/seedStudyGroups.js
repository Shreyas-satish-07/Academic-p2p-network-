import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import StudyGroup from '../models/StudyGroup.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Development safety guard
if (process.env.NODE_ENV === 'production') {
  console.error('⛔ ERROR: Seed script cannot be executed in production environment.');
  process.exit(1);
}

const seedStudyGroups = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    console.log('🔄 Connecting to MongoDB database...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // Fetch existing users from database
    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
      console.error('⛔ No existing students found in the database. Please run npm run seed first.');
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

    const getUser = (identifier) => {
      const key = identifier.toLowerCase();
      return userMap[key] || existingUsers[0];
    };

    const ananya = getUser('ananya.rao@cohort.internal') || getUser('ananya');
    const rahul = getUser('rahul.sharma@cohort.internal') || getUser('rahul');
    const priya = getUser('priya.nair@cohort.internal') || getUser('priya');
    const divya = getUser('divya.prasad@cohort.internal') || getUser('divya');
    const karthik = getUser('karthik.sundaram@cohort.internal') || getUser('karthik');
    const sneha = getUser('sneha.kulkarni@cohort.internal') || getUser('sneha');
    const arjun = getUser('arjun.mehta@cohort.internal') || getUser('arjun');
    const tanvi = getUser('tanvi.deshmukh@cohort.internal') || getUser('tanvi');
    const fallbackUser = existingUsers[0];

    const studyGroupsToSeed = [
      {
        name: 'Gradient Descent',
        subject: 'Machine Learning',
        description:
          'Weekly deep-dives into mathematical optimization, neural network architectures, PyTorch implementations, and hands-on ML model training.',
        topics: ['Python', 'ML', 'Neural Networks', 'PyTorch'],
        level: 'intermediate',
        meetingMode: 'online',
        location: '',
        schedule: {
          days: ['Wednesday'],
          time: '6:00 PM',
          timezone: 'IST',
        },
        maxMembers: 25,
        createdBy: ananya._id,
        avatarColor: '#2F5D50',
        status: 'active',
        members: [
          { user: ananya._id, role: 'owner', joinedAt: new Date(Date.now() - 14 * 86400000) },
          { user: rahul._id, role: 'moderator', joinedAt: new Date(Date.now() - 10 * 86400000) },
          { user: divya._id, role: 'member', joinedAt: new Date(Date.now() - 7 * 86400000) },
          { user: priya._id, role: 'member', joinedAt: new Date(Date.now() - 3 * 86400000) },
        ],
      },
      {
        name: 'OS Internals Circle',
        subject: 'Operating Systems',
        description:
          'Kernel architectures, CPU scheduling algorithms, virtual memory paging, multithreaded concurrency, and POSIX synchronization primitives in C/C++.',
        topics: ['Linux', 'Processes', 'Scheduling', 'C++'],
        level: 'intermediate',
        meetingMode: 'online',
        location: '',
        schedule: {
          days: ['Saturday'],
          time: '4:00 PM',
          timezone: 'IST',
        },
        maxMembers: 15,
        createdBy: karthik._id,
        avatarColor: '#445372',
        status: 'active',
        members: [
          { user: karthik._id, role: 'owner', joinedAt: new Date(Date.now() - 20 * 86400000) },
          { user: rahul._id, role: 'member', joinedAt: new Date(Date.now() - 12 * 86400000) },
          { user: sneha._id, role: 'member', joinedAt: new Date(Date.now() - 5 * 86400000) },
        ],
      },
      {
        name: 'Placement Prep 2027',
        subject: 'Career Preparation',
        description:
          'Comprehensive campus placement prep featuring daily LeetCode patterns, system design fundamentals, aptitude drills, and technical mock interviews.',
        topics: ['DSA', 'Aptitude', 'Mock Interviews'],
        level: 'intermediate',
        meetingMode: 'hybrid',
        location: 'CS Seminar Hall / Online',
        schedule: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          time: '8:00 PM',
          timezone: 'IST',
        },
        maxMembers: 50,
        createdBy: priya._id,
        avatarColor: '#E1993A',
        status: 'active',
        members: [
          { user: priya._id, role: 'owner', joinedAt: new Date(Date.now() - 30 * 86400000) },
          { user: ananya._id, role: 'moderator', joinedAt: new Date(Date.now() - 25 * 86400000) },
          { user: divya._id, role: 'member', joinedAt: new Date(Date.now() - 18 * 86400000) },
          { user: karthik._id, role: 'member', joinedAt: new Date(Date.now() - 8 * 86400000) },
          { user: rahul._id, role: 'member', joinedAt: new Date(Date.now() - 2 * 86400000) },
        ],
      },
      {
        name: 'DBMS Revision Circle',
        subject: 'Database Systems',
        description:
          'Reviewing SQL query optimization, normal forms (1NF to BCNF), indexing structures (B+ trees), ACID properties, and transaction concurrency.',
        topics: ['SQL', 'Transactions', 'Normalization', 'Indexing'],
        level: 'intermediate',
        meetingMode: 'online',
        location: '',
        schedule: {
          days: ['Tuesday', 'Thursday'],
          time: '7:30 PM',
          timezone: 'IST',
        },
        maxMembers: 16,
        createdBy: priya._id,
        avatarColor: '#3B7565',
        status: 'active',
        members: [
          { user: priya._id, role: 'owner', joinedAt: new Date(Date.now() - 15 * 86400000) },
          { user: tanvi._id || fallbackUser._id, role: 'member', joinedAt: new Date(Date.now() - 8 * 86400000) },
          { user: rahul._id, role: 'member', joinedAt: new Date(Date.now() - 4 * 86400000) },
        ],
      },
      {
        name: 'DSA Problem Solving Sprint',
        subject: 'Computer Science',
        description:
          'Intensive peer coding sprint tackling medium and hard problems on Dynamic Programming, Graphs, and Heaps with line-by-line code walk-throughs.',
        topics: ['LeetCode', 'Graphs', 'Dynamic Programming'],
        level: 'advanced',
        meetingMode: 'online',
        location: '',
        schedule: {
          days: ['Monday', 'Wednesday', 'Friday'],
          time: '5:00 PM',
          timezone: 'IST',
        },
        maxMembers: 3, // Group at max capacity for verification
        createdBy: rahul._id,
        avatarColor: '#C1502E',
        status: 'active',
        members: [
          { user: rahul._id, role: 'owner', joinedAt: new Date(Date.now() - 22 * 86400000) },
          { user: divya._id, role: 'member', joinedAt: new Date(Date.now() - 14 * 86400000) },
          { user: sneha._id, role: 'member', joinedAt: new Date(Date.now() - 6 * 86400000) },
        ],
      },
      {
        name: 'Full-Stack MERN Guild',
        subject: 'Web Development',
        description:
          'Building end-to-end web applications with React, Node.js, Express, and MongoDB. Code reviews, REST APIs, and modern responsive UI styling.',
        topics: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
        level: 'beginner',
        meetingMode: 'online',
        location: '',
        schedule: {
          days: ['Wednesday', 'Friday'],
          time: '6:30 PM',
          timezone: 'IST',
        },
        maxMembers: 20,
        createdBy: ananya._id,
        avatarColor: '#2F5D50',
        status: 'active',
        members: [
          { user: ananya._id, role: 'owner', joinedAt: new Date(Date.now() - 19 * 86400000) },
          { user: arjun._id || fallbackUser._id, role: 'member', joinedAt: new Date(Date.now() - 11 * 86400000) },
          { user: karthik._id, role: 'member', joinedAt: new Date(Date.now() - 4 * 86400000) },
        ],
      },
      {
        name: 'Cloud & DevOps Practitioners',
        subject: 'Systems & Cloud',
        description:
          'Hands-on containerization with Docker, CI/CD automated test pipelines with GitHub Actions, and cloud deployments on AWS.',
        topics: ['Docker', 'CI/CD', 'AWS', 'Linux'],
        level: 'intermediate',
        meetingMode: 'online',
        location: '',
        schedule: {
          days: ['Sunday'],
          time: '11:00 AM',
          timezone: 'IST',
        },
        maxMembers: 12,
        createdBy: karthik._id,
        avatarColor: '#445372',
        status: 'active',
        members: [
          { user: karthik._id, role: 'owner', joinedAt: new Date(Date.now() - 16 * 86400000) },
          { user: ananya._id, role: 'member', joinedAt: new Date(Date.now() - 9 * 86400000) },
          { user: arjun._id || fallbackUser._id, role: 'member', joinedAt: new Date(Date.now() - 3 * 86400000) },
        ],
      },
      {
        name: 'Discrete Mathematics & Logic',
        subject: 'Mathematics',
        description:
          'Focusing on recurrence relations, graph theory proofs, propositional logic, and combinatorics for semester coursework prep.',
        topics: ['Graph Theory', 'Logic', 'Combinatorics'],
        level: 'beginner',
        meetingMode: 'offline',
        location: 'Department Library Discussion Pod B',
        schedule: {
          days: ['Tuesday', 'Thursday'],
          time: '4:00 PM',
          timezone: 'IST',
        },
        maxMembers: 20,
        createdBy: tanvi._id || fallbackUser._id,
        avatarColor: '#E1993A',
        status: 'active',
        members: [
          { user: tanvi._id || fallbackUser._id, role: 'owner', joinedAt: new Date(Date.now() - 25 * 86400000) },
          { user: arjun._id || fallbackUser._id, role: 'member', joinedAt: new Date(Date.now() - 14 * 86400000) },
        ],
      },
      {
        name: 'Cybersecurity & CTF Circle',
        subject: 'Cybersecurity',
        description:
          'Practicing web application security vulnerabilities, OWASP Top 10 exploits, network packet inspection, and Capture The Flag challenges.',
        topics: ['OWASP', 'CTF', 'Web Security', 'Wireshark'],
        level: 'advanced',
        meetingMode: 'online',
        location: '',
        schedule: {
          days: ['Thursday'],
          time: '8:30 PM',
          timezone: 'IST',
        },
        maxMembers: 10,
        createdBy: sneha._id,
        avatarColor: '#C1502E',
        status: 'active',
        members: [
          { user: sneha._id, role: 'owner', joinedAt: new Date(Date.now() - 18 * 86400000) },
          { user: rahul._id, role: 'member', joinedAt: new Date(Date.now() - 10 * 86400000) },
        ],
      },
    ];

    console.log('🗑️ Clearing existing study groups collection for fresh seed...');
    await StudyGroup.deleteMany({});

    console.log(`🌱 Seeding ${studyGroupsToSeed.length} study groups with realistic memberships...`);
    const createdGroups = await StudyGroup.insertMany(studyGroupsToSeed);

    console.log('\n--- Seeded Study Groups Summary ---');
    for (const group of createdGroups) {
      console.log(
        `✓ "${group.name}" [${group.subject}] - ${group.members.length}/${group.maxMembers} members (Level: ${group.level}, Mode: ${group.meetingMode})`
      );
    }

    console.log(`\n🎉 Successfully seeded ${createdGroups.length} study groups!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error while seeding study groups:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedStudyGroups();
