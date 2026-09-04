import { PrismaClient, Gender } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const sampleCourses = [
  {
    title: 'Database Management Systems',
    code: 'CSE311',
    credits: 3,
    description: 'Relational database theory, normalization (1NF-BCNF), relational algebra, SQL optimization, and ACID transaction properties.',
  },
  {
    title: 'Database Systems Lab',
    code: 'CSE311L',
    credits: 1,
    description: 'Hands-on practical laboratory sessions focusing on DDL, DML, indexing, transactions, and full-stack PostgreSQL integration.',
  },
  {
    title: 'Software Engineering',
    code: 'CSE327',
    credits: 3,
    description: 'Software development life cycles, agile methodologies, design patterns, UML modeling, and architectural patterns.',
  },
  {
    title: 'Design & Analysis of Algorithms',
    code: 'CSE373',
    credits: 3,
    description: 'Asymptotic notation, divide-and-conquer, dynamic programming, greedy algorithms, and graph traversal.',
  },
  {
    title: 'Computer Networks',
    code: 'CSE421',
    credits: 3,
    description: 'OSI and TCP/IP protocol stacks, socket programming, routing algorithms, flow control, and network security.',
  },
  {
    title: 'Operating Systems',
    code: 'CSE325',
    credits: 3,
    description: 'Process scheduling, concurrency, semaphores, deadlocks, virtual memory management, and file system architecture.',
  },
];

const sampleStudents = [
  {
    email: 'admin@gmail.com',
    fullName: 'Shawn Rahaman',
    phone: '01712345678',
    gender: Gender.MALE,
    password: 'Password123!',
  },
  {
    email: 'elena.vance@university.edu',
    fullName: 'Elena Vance',
    phone: '01912345678',
    gender: Gender.FEMALE,
    password: 'Password123!',
  },
  {
    email: 'alexander.stark@university.edu',
    fullName: 'Alexander Stark',
    phone: '01823456789',
    gender: Gender.MALE,
    password: 'Password123!',
  },
  {
    email: 'maya.lin@university.edu',
    fullName: 'Maya Lin',
    phone: '01634567890',
    gender: Gender.FEMALE,
    password: 'Password123!',
  },
  {
    email: 'marcus.chen@university.edu',
    fullName: 'Marcus Chen',
    phone: '01545678901',
    gender: Gender.OTHER,
    password: 'Password123!',
  },
  {
    email: 'sarah.jenkins@university.edu',
    fullName: 'Sarah Jenkins',
    phone: '01356789012',
    gender: Gender.FEMALE,
    password: 'Password123!',
  },
];

async function main() {
  console.log('🌱 Starting DBMS Lab database seeding...');

  // 1. Seed Courses
  for (const course of sampleCourses) {
    const record = await prisma.course.upsert({
      where: { code: course.code },
      update: {
        title: course.title,
        credits: course.credits,
        description: course.description,
      },
      create: course,
    });
    console.log(`✓ Seeded course: [${record.code}] ${record.title}`);
  }

  // 2. Clean up old duplicate test users if they exist
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['stark@gmail.com', 'shawn.rahaman@university.edu'],
      },
    },
  });

  // 3. Seed Students (all unique names, emails, and phone numbers)
  for (const student of sampleStudents) {
    const passwordHash = await bcrypt.hash(student.password, 12);
    const userRecord = await prisma.user.upsert({
      where: { email: student.email },
      update: {
        fullName: student.fullName,
        phone: student.phone,
        gender: student.gender,
      },
      create: {
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        passwordHash,
      },
    });
    console.log(`✓ Seeded student: ${userRecord.fullName} (${userRecord.email} - ${userRecord.phone})`);
  }

  console.log(`\n✅ Seeding complete: ${sampleCourses.length} courses and ${sampleStudents.length} unique students.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
