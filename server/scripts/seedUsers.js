import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Development safety guard
if (process.env.NODE_ENV === 'production') {
  console.error('⛔ ERROR: Seed script cannot be executed in production environment.');
  process.exit(1);
}

const SEED_PASSWORD = 'Password123!';

export const SEED_STUDENTS = [
  {
    name: 'Ananya Rao',
    email: 'ananya.rao@cohort.internal',
    password: SEED_PASSWORD,
    college: 'BMS College of Engineering',
    department: 'Computer Science and Engineering',
    semester: 6,
    bio: 'Passionate full-stack developer eager to build collaborative web apps and tackle upcoming hackathons. Prepping for placements and system design.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Express.js', 'Tailwind'],
    interests: ['Full-stack projects', 'Hackathons', 'Web Development'],
    availability: {
      weekdays: '6:00 PM – 9:00 PM',
      weekends: '10:00 AM – 4:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['Study groups', 'Hackathons', 'MERN projects'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@cohort.internal',
    password: SEED_PASSWORD,
    college: 'RV College of Engineering',
    department: 'Artificial Intelligence & Data Science',
    semester: 6,
    bio: 'Machine learning practitioner specializing in predictive modeling and LLM agent interfaces. Looking for frontend collaborators to turn ML models into real products.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'React', 'FastAPI', 'DSA'],
    interests: ['AI applications', 'Hackathons', 'Machine Learning'],
    availability: {
      weekdays: '5:00 PM – 8:00 PM',
      weekends: '10:00 AM – 6:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['Hackathons', 'AI research', 'Study groups'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@cohort.internal',
    password: SEED_PASSWORD,
    college: 'PES University',
    department: 'Information Science and Engineering',
    semester: 6,
    bio: 'Backend systems engineer focused on high-throughput microservices, robust SQL databases, and enterprise data structure optimizations.',
    skills: ['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'Docker', 'DSA'],
    interests: ['Backend systems', 'DSA', 'System Design'],
    availability: {
      weekdays: '6:30 PM – 9:30 PM',
      weekends: '11:00 AM – 5:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['DSA sprints', 'Backend projects'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Divya Prasad',
    email: 'divya.prasad@cohort.internal',
    password: SEED_PASSWORD,
    college: 'BMS College of Engineering',
    department: 'Computer Science and Engineering',
    semester: 6,
    bio: 'Enthusiastic developer exploring Natural Language Processing, knowledge graphs, and open-source developer tooling.',
    skills: ['Python', 'DSA', 'React', 'NLP', 'Git', 'JavaScript'],
    interests: ['AI applications', 'Full-stack projects', 'Open Source'],
    availability: {
      weekdays: '6:00 PM – 9:00 PM',
      weekends: '9:00 AM – 3:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['Open Source', 'Hackathons'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Karthik Sundaram',
    email: 'karthik.sundaram@cohort.internal',
    password: SEED_PASSWORD,
    college: 'MS Ramaiah Institute of Technology',
    department: 'Computer Science and Engineering',
    semester: 6,
    bio: 'DevOps and cloud engineer experienced with Docker, CI/CD pipelines, and relational database migrations. Seeking team for campus hackathons.',
    skills: ['React', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL', 'Linux'],
    interests: ['Full-stack projects', 'Hackathons', 'Backend systems'],
    availability: {
      weekdays: '7:00 PM – 10:00 PM',
      weekends: '10:00 AM – 6:00 PM',
      preferredTeamSize: '3–5 members',
      openTo: ['Hackathons', 'Cloud projects'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@cohort.internal',
    password: SEED_PASSWORD,
    college: 'BMS College of Engineering',
    department: 'Electronics and Communication Engineering',
    semester: 6,
    bio: 'Hardware hacker and IoT developer building sensor networks. Looking for full-stack developers to create real-time analytics web dashboards.',
    skills: ['C++', 'Python', 'IoT', 'Embedded Systems', 'DSA', 'Linux'],
    interests: ['Hackathons', 'Backend systems', 'AI applications'],
    availability: {
      weekdays: '6:00 PM – 9:00 PM',
      weekends: '1:00 PM – 6:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['Hackathons', 'IoT prototyping'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@cohort.internal',
    password: SEED_PASSWORD,
    college: 'BMS College of Engineering',
    department: 'Computer Science and Engineering',
    semester: 4,
    bio: 'Frontend enthusiast passionate about web accessibility, design systems, and responsive CSS micro-interactions.',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Figma', 'Tailwind'],
    interests: ['Full-stack projects', 'Hackathons', 'Web Development'],
    availability: {
      weekdays: '4:00 PM – 7:00 PM',
      weekends: '10:00 AM – 5:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['Frontend UI', 'Hackathons'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Tanvi Deshmukh',
    email: 'tanvi.deshmukh@cohort.internal',
    password: SEED_PASSWORD,
    college: 'PES University',
    department: 'Information Science and Engineering',
    semester: 4,
    bio: 'Data science explorer focused on data wrangling, exploratory data analysis, relational queries, and BI visualization.',
    skills: ['Python', 'SQL', 'Data Analytics', 'Tableau', 'Machine Learning'],
    interests: ['AI applications', 'Backend systems', 'Data Science'],
    availability: {
      weekdays: '6:00 PM – 9:00 PM',
      weekends: '11:00 AM – 4:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['Study groups', 'Data analytics'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Vikram Patel',
    email: 'vikram.patel@cohort.internal',
    password: SEED_PASSWORD,
    college: 'BMS College of Engineering',
    department: 'Electronics and Communication Engineering',
    semester: 8,
    bio: 'Final-year student preparing for enterprise placement drives. Experienced in distributed computing, concurrency, and Linux kernel programming.',
    skills: ['Java', 'C++', 'System Design', 'Linux', 'DSA'],
    interests: ['Backend systems', 'DSA', 'System Design'],
    availability: {
      weekdays: '7:00 PM – 10:00 PM',
      weekends: '9:00 AM – 5:00 PM',
      preferredTeamSize: '2–3 members',
      openTo: ['Placement prep', 'DSA revision'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Meera Iyer',
    email: 'meera.iyer@cohort.internal',
    password: SEED_PASSWORD,
    college: 'RV College of Engineering',
    department: 'Artificial Intelligence & Data Science',
    semester: 4,
    bio: 'AI student enthusiastic about computer vision, deep learning models, and robotics simulations.',
    skills: ['Python', 'OpenCV', 'PyTorch', 'Git', 'C++'],
    interests: ['AI applications', 'Computer Vision', 'Hackathons'],
    availability: {
      weekdays: '5:30 PM – 8:30 PM',
      weekends: '10:00 AM – 3:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['AI projects', 'Study groups'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@cohort.internal',
    password: SEED_PASSWORD,
    college: 'MS Ramaiah Institute of Technology',
    department: 'Computer Science and Engineering',
    semester: 2,
    bio: 'First-year enthusiast learning core algorithms, C++, and basic web development. Eager to join study circles.',
    skills: ['C++', 'JavaScript', 'HTML', 'CSS', 'DSA'],
    interests: ['DSA', 'Web Development', 'Open Source'],
    availability: {
      weekdays: '4:00 PM – 7:00 PM',
      weekends: '9:00 AM – 2:00 PM',
      preferredTeamSize: '2–4 members',
      openTo: ['Study groups', 'Beginner sprints'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    },
  },
  {
    name: 'Neha Sen',
    email: 'neha.sen@cohort.internal',
    password: SEED_PASSWORD,
    college: 'PES University',
    department: 'Information Science and Engineering',
    semester: 8,
    bio: 'Full-stack cloud architect passionate about serverless, GraphQL, and high-availability database replication.',
    skills: ['Node.js', 'React', 'GraphQL', 'AWS', 'MongoDB', 'Docker'],
    interests: ['Full-stack projects', 'Cloud Architecture', 'Open Source'],
    availability: {
      weekdays: '7:00 PM – 10:00 PM',
      weekends: '12:00 PM – 6:00 PM',
      preferredTeamSize: '3–5 members',
      openTo: ['Capstone projects', 'Hackathons'],
    },
    avatar: {
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
  },
];

async function seedDatabase() {
  console.log('--- Starting Cohort Peer Discovery Database Seeding ---');

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB Atlas.');

    let insertedCount = 0;
    let updatedCount = 0;

    for (const studentData of SEED_STUDENTS) {
      const existing = await User.findOne({ email: studentData.email });
      if (existing) {
        // Update profile fields without touching password if it exists
        existing.name = studentData.name;
        existing.college = studentData.college;
        existing.department = studentData.department;
        existing.semester = studentData.semester;
        existing.bio = studentData.bio;
        existing.skills = studentData.skills;
        existing.interests = studentData.interests;
        existing.availability = studentData.availability;
        existing.avatar = studentData.avatar;
        await existing.save();
        updatedCount++;
      } else {
        // Create new user (triggers password hashing in pre-save hook)
        await User.create(studentData);
        insertedCount++;
      }
    }

    console.log(
      `✅ Seeding complete: ${insertedCount} students inserted, ${updatedCount} students updated.`
    );
    console.log(`Total seed students available: ${SEED_STUDENTS.length}`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log(' Closed MongoDB connection.');
    process.exit(0);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seedDatabase();
}
