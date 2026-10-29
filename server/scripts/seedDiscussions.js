import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Discussion from '../models/Discussion.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Development safety guard
if (process.env.NODE_ENV === 'production') {
  console.error('⛔ ERROR: Seed script cannot be executed in production environment.');
  process.exit(1);
}

const seedDiscussions = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    console.log('🔄 Connecting to MongoDB database...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // Fetch existing users
    const existingUsers = await User.find({});
    if (existingUsers.length === 0) {
      console.error('⛔ No existing students found. Please run npm run seed first.');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Helper map of users
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

    console.log('🧹 Clearing old seed discussions...');
    await Discussion.deleteMany({});

    console.log('🌱 Seeding fresh discussion questions and answers...');

    const discussionsToSeed = [
      {
        title: 'How does normalization reduce redundancy in DBMS?',
        content:
          'I am preparing for our Database Systems midterms and trying to clearly articulate how moving from 1NF through 2NF and 3NF/BCNF formally eliminates data anomalies (insertion, update, and deletion anomalies) without losing functional dependencies. Could someone explain with an intuitive real-world table example?',
        subject: 'DBMS',
        topics: ['DBMS', 'Normalization', 'SQL', 'Database Design'],
        tags: ['Normalization', 'SQL', 'Database Design'],
        author: rahul._id,
        status: 'resolved',
        views: 342,
        votes: [ananya._id, priya._id, divya._id, karthik._id, sneha._id, arjun._id, tanvi._id],
        answers: [
          {
            content:
              'Think of an unnormalized student course registration table: if you store StudentID, StudentName, CourseID, and InstructorRoom in one flat table, every time a student enrolls in a course, the instructor room is duplicated. In 2NF we remove partial dependencies on composite keys. In 3NF, transitive dependencies like CourseID -> Instructor -> Room are decomposed into separate relations (Students, Courses, Instructors). This ensures each fact is recorded in exactly one place.',
            author: ananya._id,
            isAccepted: true,
            votes: [rahul._id, priya._id, divya._id, karthik._id],
          },
          {
            content:
              'A practical way to check in exam questions: if X -> Y is a functional dependency, 3NF requires that either X is a superkey OR Y is a prime attribute. BCNF tightens this by insisting that X must strictly be a superkey for every non-trivial functional dependency.',
            author: karthik._id,
            isAccepted: false,
            votes: [rahul._id, ananya._id],
          },
        ],
      },
      {
        title: 'Difference between Process and Thread in Operating Systems?',
        content:
          'Can someone give a crisp breakdown of the architectural differences between processes and threads, specifically how memory segments (stack, heap, code, data) and PCB vs TCB structures differ during context switches?',
        subject: 'OS',
        topics: ['OS', 'Operating Systems', 'Concurrency', 'Process Management'],
        tags: ['Operating Systems', 'Concurrency', 'Process Management'],
        author: priya._id,
        status: 'resolved',
        views: 215,
        votes: [rahul._id, divya._id, karthik._id, sneha._id],
        answers: [
          {
            content:
              'A process has its own isolated virtual address space containing code, data, heap, and file descriptors managed by a Process Control Block (PCB). Threads within the same process share the text, data, and heap segments but maintain their own private stack and registers via a Thread Control Block (TCB). Context switching between threads is substantially cheaper because page tables and TLB caches do not need to be flushed.',
            author: divya._id,
            isAccepted: true,
            votes: [priya._id, rahul._id, tanvi._id],
          },
        ],
      },
      {
        title: 'Master Theorem vs Substitution Method for Divide & Conquer',
        content:
          'When analyzing recursive algorithms like Merge Sort vs Strassen Matrix Multiplication, what are the exact conditions where the Master Theorem fails and we are forced to resort to the Akra-Bazzi method or inductive substitution?',
        subject: 'DAA',
        topics: ['DAA', 'Algorithms', 'Asymptotics', 'Divide & Conquer'],
        tags: ['DAA', 'Algorithms', 'Asymptotics'],
        author: sneha._id,
        status: 'open',
        views: 180,
        votes: [ananya._id, arjun._id, karthik._id],
        answers: [
          {
            content:
              'The standard Master Theorem applies only to recurrences of the form T(n) = a*T(n/b) + f(n) where a >= 1 and b > 1 are constants. It fails when: (1) f(n) is not a polynomial difference (e.g. T(n) = 2T(n/2) + n/log n), (2) subproblem sizes are unequal (e.g. T(n) = T(n/3) + T(2n/3) + n), or (3) a is non-constant. For case 1, use the Master Theorem extended form; for case 2, use recursion trees or Akra-Bazzi.',
            author: arjun._id,
            isAccepted: false,
            votes: [sneha._id, priya._id],
          },
        ],
      },
      {
        title: 'Dijkstra vs Bellman-Ford: When to choose which in Networks?',
        content:
          'In computer routing protocols (OSPF Link State vs RIP Distance Vector), why can Dijkstra not handle negative edge weights, while Bellman-Ford can detect negative cycles? Does this impact convergence speed in real routing topologies?',
        subject: 'CN',
        topics: ['CN', 'Computer Networks', 'Routing', 'Graph Algorithms'],
        tags: ['Computer Networks', 'Routing', 'Graph Algorithms'],
        author: arjun._id,
        status: 'open',
        views: 145,
        votes: [ananya._id, rahul._id],
        answers: [],
      },
      {
        title: 'Backpropagation intuition in Multi-Layer Perceptrons',
        content:
          'I understand matrix multiplication during the forward pass, but applying the chain rule backward across activation functions like ReLU and Softmax often gets confusing when tracking tensor dimensions. What is a clean way to derive gradient shapes?',
        subject: 'AI & ML',
        topics: ['AI & ML', 'Machine Learning', 'Deep Learning', 'Neural Networks'],
        tags: ['Machine Learning', 'Deep Learning', 'Neural Networks'],
        author: tanvi._id,
        status: 'open',
        views: 260,
        votes: [divya._id, sneha._id, priya._id, karthik._id],
        answers: [
          {
            content:
              'Always keep the Golden Rule of Matrix Calculus in mind: the gradient of a scalar loss L with respect to a parameter matrix W must have the EXACT SAME shape as W. If W has shape (din, dout), then dL/dW must also be (din, dout). Using outer products of forward inputs x and backpropagated error deltas delta makes the shapes match naturally.',
            author: rahul._id,
            isAccepted: false,
            votes: [tanvi._id, ananya._id],
          },
        ],
      },
      {
        title: 'Cache Coherence protocols: MESI vs MOESI differences',
        content:
          'Can someone explain the role of the Owner (O) state in the MOESI protocol compared to standard MESI? How does it reduce bus traffic when multiple cores read modified shared cache lines?',
        subject: 'Computer Architecture',
        topics: ['Hardware', 'Cache', 'Concurrency', 'Computer Architecture'],
        tags: ['Hardware', 'Cache', 'Concurrency'],
        author: karthik._id,
        status: 'open',
        views: 98,
        votes: [priya._id],
        answers: [],
      },
      {
        title: 'Explain ACID properties with real banking transactions',
        content:
          'Could someone walk through an end-to-end atomic transfer of $500 from Account A to Account B, illustrating how write-ahead logging (WAL), two-phase locking (2PL), and isolation levels prevent dirty reads, non-repeatable reads, and phantom reads?',
        subject: 'DBMS',
        topics: ['DBMS', 'Transactions', 'ACID', 'Concurrency'],
        tags: ['Transactions', 'ACID', 'Concurrency'],
        author: divya._id,
        status: 'resolved',
        views: 412,
        votes: [ananya._id, rahul._id, priya._id, tanvi._id, arjun._id],
        answers: [
          {
            content:
              'In Account A -> Account B ($500):\n1. Atomicity: If the server crashes after debiting A but before crediting B, WAL undo logs rollback the debit on recovery.\n2. Consistency: Total account balances must remain invariant according to schema constraints.\n3. Isolation: Another query executing concurrent balance checks does not see partial updates if using Repeatable Read or Serializable isolation.\n4. Durability: Once the transaction commits, redo logs are flushed to persistent disk, surviving sudden power failures.',
            author: rahul._id,
            isAccepted: true,
            votes: [divya._id, ananya._id, priya._id],
          },
        ],
      },
    ];

    const insertedDiscussions = await Discussion.insertMany(discussionsToSeed);
    console.log(`✅ Successfully seeded ${insertedDiscussions.length} discussions.`);

    await mongoose.connection.close();
    console.log('🔒 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed discussions:', error);
    try {
      await mongoose.connection.close();
    } catch {
      // Ignore close error
    }
    process.exit(1);
  }
};

seedDiscussions();

