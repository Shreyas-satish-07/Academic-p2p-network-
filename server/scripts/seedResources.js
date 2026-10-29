import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Resource from '../models/Resource.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Development safety guard
if (process.env.NODE_ENV === 'production') {
  console.error('⛔ ERROR: Seed script cannot be executed in production environment.');
  process.exit(1);
}

const seedResources = async () => {
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
      console.error('⛔ No existing students found. Please run npm run seed first.');
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

    const resourcesToSeed = [
      {
        title: 'DBMS Notes.pdf',
        description:
          'Comprehensive handwritten and transcribed lecture notes covering ER diagrams, Relational Algebra, Normalization (1NF–BCNF), Transaction ACID properties, and Concurrency Control.',
        subject: 'DBMS',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/DBMS_Notes.pdf',
        topics: ['DBMS', 'SQL', 'Normalization', 'Transactions', 'Semester 6'],
        tags: ['DBMS', 'SQL', 'Normalization', 'Transactions', 'Semester 6'],
        level: 'intermediate',
        visibility: 'public',
        createdBy: ananya._id,
        likes: [rahul._id, priya._id, divya._id, karthik._id],
        saves: [rahul._id, priya._id, sneha._id],
        viewCount: 142,
        fileSize: '4.8 MB',
        thumbnailColor: '#2F5D50',
        status: 'active',
      },
      {
        title: 'Operating Systems Cheatsheet.pdf',
        description:
          'Quick exam-ready revision formula sheet for CPU scheduling algorithms, Deadlock detection Banker’s algorithm, paging address translation, and POSIX fork/exec calls.',
        subject: 'Operating Systems',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/Operating_Systems_Cheatsheet.pdf',
        topics: ['Operating Systems', 'CPU Scheduling', 'Deadlocks', 'Exam Prep'],
        tags: ['Operating Systems', 'CPU Scheduling', 'Deadlocks', 'Exam Prep'],
        level: 'intermediate',
        visibility: 'public',
        createdBy: rahul._id,
        likes: [ananya._id, priya._id, karthik._id],
        saves: [ananya._id, karthik._id],
        viewCount: 96,
        fileSize: '1.4 MB',
        thumbnailColor: '#445372',
        status: 'active',
      },
      {
        title: 'DSA Roadmap.pptx',
        description:
          'Curated 16-week structured slide deck detailing core patterns in Arrays, Two Pointers, Sliding Window, Trees, Graphs, and Dynamic Programming with LeetCode problem trackers.',
        subject: 'DSA',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/DSA_Roadmap.pptx',
        topics: ['DSA', 'LeetCode', 'Roadmap', 'Placements', 'Algorithms'],
        tags: ['DSA', 'LeetCode', 'Roadmap', 'Placements', 'Algorithms'],
        level: 'beginner',
        visibility: 'public',
        createdBy: priya._id,
        likes: [ananya._id, rahul._id, divya._id, sneha._id],
        saves: [ananya._id, rahul._id, divya._id],
        viewCount: 84,
        fileSize: '7.2 MB',
        thumbnailColor: '#E1993A',
        status: 'active',
      },
      {
        title: 'Machine Learning Lab Manual.pdf',
        description:
          'Official verified lab exercises with Python implementations for Linear Regression, Decision Trees, K-Means clustering, PCA dimensionality reduction, and evaluation metrics.',
        subject: 'Machine Learning',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/Machine_Learning_Lab_Manual.pdf',
        topics: ['Machine Learning', 'Python', 'Scikit-Learn', 'Lab Manual'],
        tags: ['Machine Learning', 'Python', 'Scikit-Learn', 'Lab Manual'],
        level: 'intermediate',
        visibility: 'public',
        createdBy: divya._id,
        likes: [ananya._id, rahul._id],
        saves: [ananya._id, rahul._id],
        viewCount: 65,
        fileSize: '3.6 MB',
        thumbnailColor: '#2F5D50',
        status: 'active',
      },
      {
        title: 'Computer Networks Exam Prep.pdf',
        description:
          'Solved university numericals on Subnetting, CIDR masking, Go-Back-N / Selective Repeat ARQ, Dijkstra’s Routing, and TCP 3-way handshake sequence diagrams.',
        subject: 'Computer Networks',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/Computer_Networks_Exam_Prep.pdf',
        topics: ['Computer Networks', 'Subnetting', 'TCP/IP', 'Exam Prep'],
        tags: ['Computer Networks', 'Subnetting', 'TCP/IP', 'Exam Prep'],
        level: 'intermediate',
        visibility: 'public',
        createdBy: karthik._id,
        likes: [priya._id, rahul._id],
        saves: [priya._id],
        viewCount: 52,
        fileSize: '2.9 MB',
        thumbnailColor: '#2F5D50',
        status: 'active',
      },
      {
        title: 'Python Basics Reference.pdf',
        description:
          'Clean syntax cheat sheet covering list comprehensions, generators, decorators, lambda functions, file I/O, and OOP principles with short code snippets.',
        subject: 'Machine Learning',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/Python_Basics_Reference.pdf',
        topics: ['Python', 'Reference', 'Syntax', 'OOP'],
        tags: ['Python', 'Reference', 'Syntax', 'OOP'],
        level: 'beginner',
        visibility: 'public',
        createdBy: sneha._id,
        likes: [divya._id, arjun._id],
        saves: [arjun._id],
        viewCount: 40,
        fileSize: '950 KB',
        thumbnailColor: '#445372',
        status: 'active',
      },
      {
        title: 'Software Engineering Project Report.pdf',
        description:
          'IEEE formatted 40-page semester capstone project documentation: SRS, UML class & sequence diagrams, Agile sprint retrospectives, and test coverage matrices.',
        subject: 'Web Development',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/Software_Engineering_Project_Report.pdf',
        topics: ['Software Engineering', 'UML', 'SRS', 'Agile', 'Documentation'],
        tags: ['Software Engineering', 'UML', 'SRS', 'Agile', 'Documentation'],
        level: 'intermediate',
        visibility: 'public',
        createdBy: arjun._id,
        likes: [ananya._id, karthik._id],
        saves: [karthik._id],
        viewCount: 35,
        fileSize: '5.1 MB',
        thumbnailColor: '#2F5D50',
        status: 'active',
      },
      {
        title: 'System Design Fundamentals.pdf',
        description:
          'High-level architecture guide covering Load Balancers, Consistent Hashing, Caching (Redis/Memcached), Database Sharding, CAP Theorem, and Message Queues (Kafka).',
        subject: 'System Design',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/System_Design_Fundamentals.pdf',
        topics: ['System Design', 'Scalability', 'Distributed Systems', 'Caching'],
        tags: ['System Design', 'Scalability', 'Distributed Systems', 'Caching'],
        level: 'advanced',
        visibility: 'public',
        createdBy: ananya._id,
        likes: [rahul._id, priya._id, karthik._id],
        saves: [rahul._id, priya._id],
        viewCount: 28,
        fileSize: '3.2 MB',
        thumbnailColor: '#E1993A',
        status: 'active',
      },
      {
        title: 'Deep Learning Research Paper.pdf',
        description:
          'Annotated copy of Vaswani et al. "Attention Is All You Need" with margin notes, math breakdowns of Scaled Dot-Product Attention, and Multi-Head Layer norms.',
        subject: 'Machine Learning',
        resourceType: 'link',
        url: 'https://arxiv.org/abs/1706.03762',
        topics: ['Deep Learning', 'Transformers', 'NLP', 'Research Paper'],
        tags: ['Deep Learning', 'Transformers', 'NLP', 'Research Paper'],
        level: 'advanced',
        visibility: 'public',
        createdBy: divya._id,
        likes: [rahul._id, ananya._id],
        saves: [rahul._id],
        viewCount: 31,
        fileSize: '2.1 MB',
        thumbnailColor: '#C1502E',
        status: 'active',
      },
      {
        title: 'React + Node.js Interview Notes.pdf',
        description:
          'High-frequency technical questions on React Virtual DOM, reconciliation, useEffect dependency traps, Node Event Loop, Streams, and Express middleware chains.',
        subject: 'Web Development',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/React_Nodejs_Interview_Notes.pdf',
        topics: ['React', 'Node.js', 'Full Stack', 'Interview Notes'],
        tags: ['React', 'Node.js', 'Full Stack', 'Interview Notes'],
        level: 'intermediate',
        visibility: 'public',
        createdBy: ananya._id,
        likes: [arjun._id, karthik._id],
        saves: [arjun._id],
        viewCount: 22,
        fileSize: '2.4 MB',
        thumbnailColor: '#E1993A',
        status: 'active',
      },
      {
        title: 'MongoDB Aggregation Guide.pdf',
        description:
          'Practical visual examples for MongoDB aggregation stages: $match, $group, $lookup, $unwind, $facet, and building compound indexes for sub-millisecond queries.',
        subject: 'DBMS',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/MongoDB_Aggregation_Guide.pdf',
        topics: ['MongoDB', 'NoSQL', 'Aggregation', 'Database'],
        tags: ['MongoDB', 'NoSQL', 'Aggregation', 'Database'],
        level: 'intermediate',
        visibility: 'public',
        createdBy: priya._id,
        likes: [ananya._id, tanvi._id],
        saves: [ananya._id],
        viewCount: 18,
        fileSize: '1.8 MB',
        thumbnailColor: '#E1993A',
        status: 'active',
      },
      {
        title: 'Git and GitHub Collaboration Guide.pdf',
        description:
          'Illustrated team workflow tutorial: Git rebase vs merge, resolving merge conflicts, squash commits, semantic commit messages, and branch protection rules.',
        subject: 'Web Development',
        resourceType: 'tool',
        url: 'https://docs.github.com/en/get-started/using-git',
        topics: ['Git', 'GitHub', 'Version Control', 'DevOps'],
        tags: ['Git', 'GitHub', 'Version Control', 'DevOps'],
        level: 'beginner',
        visibility: 'public',
        createdBy: karthik._id,
        likes: [arjun._id],
        saves: [],
        viewCount: 15,
        fileSize: '1.2 MB',
        thumbnailColor: '#445372',
        status: 'active',
      },
      {
        title: 'Campus Aptitude Practice Set.pdf',
        description:
          '100+ solved numerical aptitude, logical reasoning, and data interpretation practice questions for placement screening tests.',
        subject: 'Placement Preparation',
        resourceType: 'document',
        url: 'https://github.com/cohort-academic/materials/raw/main/Campus_Aptitude_Practice_Set.pdf',
        topics: ['Placement Preparation', 'Aptitude', 'Logical Reasoning'],
        tags: ['Placement Preparation', 'Aptitude', 'Logical Reasoning'],
        level: 'intermediate',
        visibility: 'public',
        createdBy: priya._id,
        likes: [ananya._id, rahul._id],
        saves: [ananya._id],
        viewCount: 12,
        fileSize: '3.1 MB',
        thumbnailColor: '#E1993A',
        status: 'active',
      },
      {
        title: 'OWASP Security Fundamentals.pdf',
        description:
          'Introductory hands-on walk-through explaining SQL Injection, Cross-Site Scripting (XSS), and CSRF tokens with vulnerable code labs.',
        subject: 'Web Development',
        resourceType: 'link',
        url: 'https://owasp.org/www-project-top-ten/',
        topics: ['Cybersecurity', 'OWASP', 'Web Security'],
        tags: ['Cybersecurity', 'OWASP', 'Web Security'],
        level: 'beginner',
        visibility: 'public',
        createdBy: sneha._id,
        likes: [rahul._id],
        saves: [],
        viewCount: 9,
        fileSize: '2.5 MB',
        thumbnailColor: '#2F5D50',
        status: 'active',
      },
    ];

    console.log('🗑️ Clearing existing resources collection for fresh seed...');
    await Resource.deleteMany({});

    console.log(`🌱 Seeding ${resourcesToSeed.length} academic resources...`);
    const created = await Resource.insertMany(resourcesToSeed);

    console.log('\n--- Seeded Resources Summary ---');
    for (const item of created) {
      console.log(
        `✓ "${item.title}" [${item.subject}] - Type: ${item.resourceType}, Views: ${item.viewCount}, Likes: ${item.likes.length}, Saves: ${item.saves.length}`
      );
    }

    console.log(`\n🎉 Successfully seeded ${created.length} academic learning resources!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error while seeding resources:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedResources();

