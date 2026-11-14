import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SYSTEM_ACHIEVEMENTS } from "../lib/achievements";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed System Achievements
  for (const ach of SYSTEM_ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: ach,
      create: ach,
    });
  }

  // 2. Create Demo User
  const hashedPassword = await bcrypt.hash("password123", 10);
  const demoEmail = "demo@example.com";

  let user = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Alex Johnson",
        email: demoEmail,
        password: hashedPassword,
        college: "Institute of Technology",
        course: "Computer Science & Engineering",
        branch: "CSE",
        academicYear: "3rd Year",
        semester: "5th Semester",
        dailyGoalMinutes: 360, // 6 hours
        preferredStudyHours: "Morning & Evening",
        soundEnabled: true,
        notificationsEnabled: true,
      },
    });
    console.log("Created demo user:", user.email);
  } else {
    console.log("Demo user exists:", user.email);
  }

  // Clear existing user data for a clean seed
  await prisma.userAchievement.deleteMany({ where: { userId: user.id } });
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.revision.deleteMany({ where: { userId: user.id } });
  await prisma.studyNote.deleteMany({ where: { userId: user.id } });
  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.studySession.deleteMany({ where: { userId: user.id } });
  await prisma.topic.deleteMany({ where: { userId: user.id } });
  await prisma.subject.deleteMany({ where: { userId: user.id } });

  // 3. Create Subjects
  const jsSubject = await prisma.subject.create({
    data: {
      name: "JavaScript",
      description: "Modern ES6+, Async programming, DOM and Web APIs",
      color: "#EC4899", // Primary Pink
      icon: "code",
      targetHours: 60,
      userId: user.id,
    },
  });

  const reactSubject = await prisma.subject.create({
    data: {
      name: "React",
      description: "Components, Hooks, State management, Next.js",
      color: "#F472B6", // Medium Pink
      icon: "atom",
      targetHours: 50,
      userId: user.id,
    },
  });

  const mathSubject = await prisma.subject.create({
    data: {
      name: "Mathematics",
      description: "Trigonometry, Calculus, Linear Algebra & Probability",
      color: "#DB2777", // Dark Pink
      icon: "calculator",
      targetHours: 45,
      userId: user.id,
    },
  });

  const dbmsSubject = await prisma.subject.create({
    data: {
      name: "DBMS",
      description: "Relational modeling, SQL, Normalization, Transactions",
      color: "#BE185D", // Deep Magenta Pink
      icon: "database",
      targetHours: 40,
      userId: user.id,
    },
  });

  // 4. Create Topics
  const topicPromises = await prisma.topic.create({
    data: {
      name: "Promises & Async/Await",
      description: "Event loop, microtasks, Promise chaining, error handling",
      status: "COMPLETED",
      understanding: 85,
      difficulty: "MEDIUM",
      subjectId: jsSubject.id,
      userId: user.id,
    },
  });

  const topicFetch = await prisma.topic.create({
    data: {
      name: "Fetch API & Streams",
      description: "Network requests, headers, ReadableStreams, AbortController",
      status: "IN_PROGRESS",
      understanding: 40, // Weak topic (< 50%)
      difficulty: "HARD",
      subjectId: jsSubject.id,
      userId: user.id,
    },
  });

  const topicHooks = await prisma.topic.create({
    data: {
      name: "React Hooks (useState, useEffect, useMemo)",
      description: "Rules of hooks, dependency arrays, memoization",
      status: "COMPLETED",
      understanding: 80,
      difficulty: "MEDIUM",
      subjectId: reactSubject.id,
      userId: user.id,
    },
  });

  const topicTrig = await prisma.topic.create({
    data: {
      name: "Trigonometry & Identities",
      description: "Sine, Cosine rules, double angle formulas",
      status: "IN_PROGRESS",
      understanding: 55,
      difficulty: "MEDIUM",
      subjectId: mathSubject.id,
      userId: user.id,
    },
  });

  const topicNorm = await prisma.topic.create({
    data: {
      name: "Database Normalization (1NF to BCNF)",
      description: "Functional dependencies, lossless join, dependency preservation",
      status: "COMPLETED",
      understanding: 75,
      difficulty: "MEDIUM",
      subjectId: dbmsSubject.id,
      userId: user.id,
    },
  });

  // 5. Create Study Sessions (Today and past days)
  const now = new Date();
  
  // Today's sessions:
  // Session 1: 07:10 AM - 08:35 AM (1h 25m = 85 mins)
  const todayMorningStart = new Date(now);
  todayMorningStart.setHours(7, 10, 0, 0);
  const todayMorningEnd = new Date(now);
  todayMorningEnd.setHours(8, 35, 0, 0);

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subjectId: jsSubject.id,
      topicId: topicPromises.id,
      mode: "NORMAL",
      durationMinutes: 85,
      durationSeconds: 85 * 60,
      startTime: todayMorningStart,
      endTime: todayMorningEnd,
      whatStudied: "Promise.all, Promise.allSettled, error handling with try/catch",
      whatLearned: "Promise.allSettled doesn't short-circuit on rejection unlike Promise.all",
      whatUnderstood: "Resolved chaining and microtask queuing behavior",
      whatNotUnderstood: "Clean cancellation patterns using AbortSignal in async pipelines",
      difficulty: "MEDIUM",
      personalNotes: "Review MDN documentation on AbortController tomorrow.",
    },
  });

  // Session 2: 10:30 AM - 11:25 AM (55 mins)
  const todayMidStart = new Date(now);
  todayMidStart.setHours(10, 30, 0, 0);
  const todayMidEnd = new Date(now);
  todayMidEnd.setHours(11, 25, 0, 0);

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subjectId: mathSubject.id,
      topicId: topicTrig.id,
      mode: "POMODORO",
      durationMinutes: 55,
      durationSeconds: 55 * 60,
      startTime: todayMidStart,
      endTime: todayMidEnd,
      whatStudied: "Trigonometric identities: product-to-sum and sum-to-product",
      whatLearned: "Derivation of sin(A+B) and cos(A+B) formulas",
      whatUnderstood: "Geometric proof of addition formulas",
      whatNotUnderstood: "Faster ways to compute complex angle transformations",
      difficulty: "MEDIUM",
      personalNotes: "Practice 10 exam questions on textbook page 142.",
    },
  });

  // Session 3: 03:00 PM - 04:10 PM (1h 10m = 70 mins)
  const todayAftStart = new Date(now);
  todayAftStart.setHours(15, 0, 0, 0);
  const todayAftEnd = new Date(now);
  todayAftEnd.setHours(16, 10, 0, 0);

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subjectId: dbmsSubject.id,
      topicId: topicNorm.id,
      mode: "NORMAL",
      durationMinutes: 70,
      durationSeconds: 70 * 60,
      startTime: todayAftStart,
      endTime: todayAftEnd,
      whatStudied: "Third Normal Form (3NF) and Boyce-Codd Normal Form (BCNF)",
      whatLearned: "Transitive dependencies vs non-trivial functional dependencies",
      whatUnderstood: "How BCNF handles anomalies that 3NF might leave",
      whatNotUnderstood: "Testing dependency preservation systematically",
      difficulty: "HARD",
      personalNotes: "Clear notes written for DBMS midterm revision.",
    },
  });

  // Session 4: 08:30 PM - 09:35 PM (1h 05m = 65 mins)
  const todayEveStart = new Date(now);
  todayEveStart.setHours(20, 30, 0, 0);
  const todayEveEnd = new Date(now);
  todayEveEnd.setHours(21, 35, 0, 0);

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subjectId: reactSubject.id,
      topicId: topicHooks.id,
      mode: "NORMAL",
      durationMinutes: 65,
      durationSeconds: 65 * 60,
      startTime: todayEveStart,
      endTime: todayEveEnd,
      whatStudied: "Deep dive into useEffect cleanup functions and memoization",
      whatLearned: "Stale closure pitfalls when state changes inside async effects",
      whatUnderstood: "Ref-based callback techniques to avoid re-triggering effects",
      whatNotUnderstood: "Custom hook testing using React Testing Library",
      difficulty: "MEDIUM",
      personalNotes: "Write a mini test suite for useLocalStorage hook.",
    },
  });

  // Past 6 days of sessions to create a healthy study streak
  for (let i = 1; i <= 6; i++) {
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - i);
    pastDate.setHours(9, 0, 0, 0);

    const pastDateEnd = new Date(pastDate);
    pastDateEnd.setHours(13, 30, 0, 0);

    await prisma.studySession.create({
      data: {
        userId: user.id,
        subjectId: i % 2 === 0 ? jsSubject.id : dbmsSubject.id,
        topicId: i % 2 === 0 ? topicPromises.id : topicNorm.id,
        mode: "NORMAL",
        durationMinutes: 270, // 4.5 hours
        durationSeconds: 270 * 60,
        startTime: pastDate,
        endTime: pastDateEnd,
        whatStudied: `Deep dive session #${i}`,
        whatLearned: "Completed theory exercises and flashcards",
        whatUnderstood: "Core conceptual understanding solidified",
        difficulty: "MEDIUM",
      },
    });
  }

  // 6. Create Tasks
  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        subjectId: jsSubject.id,
        title: "Review JavaScript Promises and Closures",
        description: "Re-read chapter 7 of Eloquent JavaScript and solve exercises",
        dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        priority: "HIGH",
        status: "PENDING",
      },
      {
        userId: user.id,
        subjectId: mathSubject.id,
        title: "Solve 10 Trigonometry problems",
        description: "Focus on double angle formulas and identities",
        dueDate: new Date(now.getTime() + 48 * 60 * 60 * 1000),
        priority: "MEDIUM",
        status: "PENDING",
      },
      {
        userId: user.id,
        subjectId: dbmsSubject.id,
        title: "Read Chapter 4 of DBMS Normalization",
        description: "Understand BCNF decomposition examples",
        dueDate: now,
        priority: "LOW",
        status: "COMPLETED",
      },
      {
        userId: user.id,
        subjectId: reactSubject.id,
        title: "Build custom useDebounce hook",
        description: "Implement timeout cleanup on unmount",
        dueDate: new Date(now.getTime() + 72 * 60 * 60 * 1000),
        priority: "HIGH",
        status: "PENDING",
      },
    ],
  });

  // 7. Create Notes
  await prisma.studyNote.create({
    data: {
      userId: user.id,
      subjectId: jsSubject.id,
      topicId: topicPromises.id,
      title: "JavaScript Promises & Microtasks Cheatsheet",
      content: `# Promises & Async Execution\n\n### States\n- **Pending**: Initial state.\n- **Fulfilled**: Operation completed successfully.\n- **Rejected**: Operation failed.\n\n### Key Methods\n- \`Promise.all(iterable)\`: Rejects immediately upon any rejection.\n- \`Promise.allSettled(iterable)\`: Always waits for all promises to resolve/reject.\n- \`Promise.race(iterable)\`: Settles as soon as any promise settles.\n\n\`\`\`javascript\nasync function loadData() {\n  try {\n    const res = await fetch('/api/data');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Fetch failed:', err);\n  }\n}\n\`\`\`\n`,
      tags: "javascript,async,promises,cheatsheet",
    },
  });

  await prisma.studyNote.create({
    data: {
      userId: user.id,
      subjectId: dbmsSubject.id,
      topicId: topicNorm.id,
      title: "DBMS Normal Forms Summary: 1NF to BCNF",
      content: `# Database Normalization Guide\n\n### 1st Normal Form (1NF)\n- Atomic values only (no repeating groups, multi-valued attributes).\n\n### 2nd Normal Form (2NF)\n- In 1NF and no **partial dependency** (every non-prime attribute is fully functionally dependent on primary key).\n\n### 3rd Normal Form (3NF)\n- In 2NF and no **transitive dependency** (X -> Y, Y is prime or X is superkey).\n\n### Boyce-Codd Normal Form (BCNF)\n- For every non-trivial functional dependency X -> Y, **X must be a superkey**.\n`,
      tags: "dbms,normalization,sql,bcnf",
    },
  });

  // 8. Create Revisions
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.revision.create({
    data: {
      userId: user.id,
      topicId: topicPromises.id,
      intervalDays: 1,
      scheduledFor: now, // Today
      isCompleted: false,
      notes: "Review microtask queue and Promise error handling",
    },
  });

  await prisma.revision.create({
    data: {
      userId: user.id,
      topicId: topicNorm.id,
      intervalDays: 3,
      scheduledFor: tomorrow, // Tomorrow
      isCompleted: false,
      notes: "Review BCNF decomposition rules and lossless join test",
    },
  });

  // 9. Unlock Initial Achievements
  const firstSessionAch = await prisma.achievement.findUnique({ where: { code: "FIRST_SESSION" } });
  const streak7Ach = await prisma.achievement.findUnique({ where: { code: "STREAK_7" } });
  const hours10Ach = await prisma.achievement.findUnique({ where: { code: "HOURS_10" } });

  if (firstSessionAch) {
    await prisma.userAchievement.create({
      data: { userId: user.id, achievementId: firstSessionAch.id },
    });
  }
  if (streak7Ach) {
    await prisma.userAchievement.create({
      data: { userId: user.id, achievementId: streak7Ach.id },
    });
  }
  if (hours10Ach) {
    await prisma.userAchievement.create({
      data: { userId: user.id, achievementId: hours10Ach.id },
    });
  }

  // 10. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: "Achievement Unlocked! 🏆",
        message: "You've earned the 'First Step' badge for completing your first study session.",
        type: "INFO",
      },
      {
        userId: user.id,
        title: "Daily Goal Update 🎯",
        message: "You've completed 4h 35m of your 6h daily goal today. Keep it up!",
        type: "GOAL",
      },
      {
        userId: user.id,
        title: "Revision Due Today 📚",
        message: "Time to revise 'Promises & Async/Await' for JavaScript.",
        type: "REVISION",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
