import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SYSTEM_ACHIEVEMENTS } from "../lib/achievements";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding rich curriculum and multi-period study progress...");

  // 1. Seed System Achievements
  for (const ach of SYSTEM_ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: ach,
      create: ach,
    });
  }

  // 2. Create or find Demo User
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
        college: "Delhi University / National Institute",
        course: "SSC CGL & Computer Science Aspirant",
        branch: "Aptitude, GS & Tech",
        academicYear: "Final Year",
        semester: "6th Semester",
        dailyGoalMinutes: 360, // 6 hours
        preferredStudyHours: "Morning (7 AM - 11 AM) & Evening (6 PM - 10 PM)",
        soundEnabled: true,
        notificationsEnabled: true,
      },
    });
  }

  // Clear existing records for a pristine seed
  await prisma.userAchievement.deleteMany({ where: { userId: user.id } });
  await prisma.notification.deleteMany({ where: { userId: user.id } });
  await prisma.revision.deleteMany({ where: { userId: user.id } });
  await prisma.studyNote.deleteMany({ where: { userId: user.id } });
  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.studySession.deleteMany({ where: { userId: user.id } });
  await prisma.topic.deleteMany({ where: { userId: user.id } });
  await prisma.subject.deleteMany({ where: { userId: user.id } });

  // 3. Create Proper Subjects
  const quantSubject = await prisma.subject.create({
    data: {
      name: "Quantitative Aptitude",
      description: "Arithmetic, Advanced Maths, Algebra, Geometry, Trigonometry, and Data Interpretation",
      color: "#EC4899", // Primary Pink
      icon: "calculator",
      targetHours: 80,
      userId: user.id,
    },
  });

  const reasoningSubject = await prisma.subject.create({
    data: {
      name: "General Intelligence & Reasoning",
      description: "Verbal & Non-Verbal reasoning, Syllogisms, Puzzles, Coding-Decoding, Analogies",
      color: "#DB2777", // Dark Pink
      icon: "brain",
      targetHours: 60,
      userId: user.id,
    },
  });

  const englishSubject = await prisma.subject.create({
    data: {
      name: "English Language & Comprehension",
      description: "Grammar rules, Vocabulary, Reading Comprehension, Error Spotting, Idioms & Phrases",
      color: "#F472B6", // Medium Pink
      icon: "book-open",
      targetHours: 50,
      userId: user.id,
    },
  });

  const gsSubject = await prisma.subject.create({
    data: {
      name: "General Studies & Awareness",
      description: "Indian Polity & Constitution, Modern History, Geography, Economics, General Science",
      color: "#BE185D", // Deep Magenta
      icon: "globe",
      targetHours: 70,
      userId: user.id,
    },
  });

  const computerSubject = await prisma.subject.create({
    data: {
      name: "Computer Knowledge & IT",
      description: "Hardware & OS basics, Networking, DBMS & SQL, Cyber Security, Web Fundamentals",
      color: "#9D174D", // Berry Pink
      icon: "cpu",
      targetHours: 40,
      userId: user.id,
    },
  });

  const webDevSubject = await prisma.subject.create({
    data: {
      name: "Web Development & JavaScript",
      description: "Modern ES6+, Async & Promises, React Hooks, Next.js Full-Stack Architecture",
      color: "#F9A8D4", // Soft Pink
      icon: "code",
      targetHours: 65,
      userId: user.id,
    },
  });

  // 4. Create Detailed Curriculum Topics
  // Quantitative Aptitude Topics
  const quantTopics = await Promise.all([
    prisma.topic.create({
      data: {
        name: "Number Systems & Divisibility Rules",
        description: "Unit digits, remainder theorems, LCM & HCF",
        status: "COMPLETED",
        understanding: 90,
        difficulty: "MEDIUM",
        subjectId: quantSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Percentages & Profit, Loss & Discount",
        description: "Successive percentage, marked price, cheating dealer problems",
        status: "COMPLETED",
        understanding: 85,
        difficulty: "MEDIUM",
        subjectId: quantSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Time, Speed & Distance / Relative Speed",
        description: "Trains, boats & streams, circular tracks, escalators",
        status: "IN_PROGRESS",
        understanding: 45, // Weak topic (< 50%)
        difficulty: "HARD",
        subjectId: quantSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Trigonometry & Heights & Distances",
        description: "Identities, minimum/maximum values, angle of elevation/depression",
        status: "IN_PROGRESS",
        understanding: 70,
        difficulty: "HARD",
        subjectId: quantSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Geometry & Circle Theorems",
        description: "Chords, tangents, cyclic quadrilaterals, similarity of triangles",
        status: "NOT_STARTED",
        understanding: 20, // Weak topic (< 50%)
        difficulty: "HARD",
        subjectId: quantSubject.id,
        userId: user.id,
      },
    }),
  ]);

  // Reasoning Topics
  const reasoningTopics = await Promise.all([
    prisma.topic.create({
      data: {
        name: "Syllogisms & 100-50 / Venn Diagram Rules",
        description: "Possibility cases, Either-Or conditions, Reverse syllogisms",
        status: "COMPLETED",
        understanding: 95,
        difficulty: "EASY",
        subjectId: reasoningSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Coding-Decoding & Letter Shifts",
        description: "Opposite letter pairs, alphanumeric shifting, matrix coding",
        status: "COMPLETED",
        understanding: 90,
        difficulty: "EASY",
        subjectId: reasoningSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Seating Arrangement & Linear/Circular Puzzles",
        description: "Facing inside/outside, 8-person circular table, unknown count rows",
        status: "IN_PROGRESS",
        understanding: 50,
        difficulty: "HARD",
        subjectId: reasoningSubject.id,
        userId: user.id,
      },
    }),
  ]);

  // English Topics
  const englishTopics = await Promise.all([
    prisma.topic.create({
      data: {
        name: "Subject-Verb Agreement & 120 Grammar Rules",
        description: "Collective nouns, correlative conjunctions, inverted sentences",
        status: "COMPLETED",
        understanding: 85,
        difficulty: "MEDIUM",
        subjectId: englishSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Vocabulary & One Word Substitution",
        description: "Root words (anthrop, phil, mal), foreign phrases, homonyms",
        status: "IN_PROGRESS",
        understanding: 65,
        difficulty: "MEDIUM",
        subjectId: englishSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Reading Comprehension & Cloze Test",
        description: "Tone identification, editorial articles, contextual inference",
        status: "IN_PROGRESS",
        understanding: 75,
        difficulty: "MEDIUM",
        subjectId: englishSubject.id,
        userId: user.id,
      },
    }),
  ]);

  // General Studies Topics
  const gsTopics = await Promise.all([
    prisma.topic.create({
      data: {
        name: "Indian Polity: Preamble, Fundamental Rights & DPSP",
        description: "Articles 12 to 51A, constitutional amendments, Supreme Court writs",
        status: "COMPLETED",
        understanding: 80,
        difficulty: "MEDIUM",
        subjectId: gsSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Modern History: 1857 Revolt to Indian Independence",
        description: "Governor Generals, INC sessions, Gandhian movements, Acts of 1909/1919/1935",
        status: "IN_PROGRESS",
        understanding: 60,
        difficulty: "MEDIUM",
        subjectId: gsSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Geography: River Systems & Mountain Passes of India",
        description: "Himalayan vs Peninsular drainage, tributaries, national parks",
        status: "IN_PROGRESS",
        understanding: 40, // Weak topic (< 50%)
        difficulty: "HARD",
        subjectId: gsSubject.id,
        userId: user.id,
      },
    }),
  ]);

  // Computer & Tech Topics
  const computerTopics = await Promise.all([
    prisma.topic.create({
      data: {
        name: "Database Management: Relational Modeling & Normalization",
        description: "1NF, 2NF, 3NF, BCNF, functional dependencies, primary keys",
        status: "COMPLETED",
        understanding: 80,
        difficulty: "MEDIUM",
        subjectId: computerSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "Computer Networking & OSI 7-Layer Model",
        description: "TCP vs UDP, IP addressing, HTTP/HTTPS, DNS resolution flow",
        status: "COMPLETED",
        understanding: 75,
        difficulty: "MEDIUM",
        subjectId: computerSubject.id,
        userId: user.id,
      },
    }),
  ]);

  // Web Dev Topics
  const webTopics = await Promise.all([
    prisma.topic.create({
      data: {
        name: "JavaScript Promises, Microtasks & Async/Await",
        description: "Event loop, Promise.all vs Promise.allSettled, error handling",
        status: "COMPLETED",
        understanding: 88,
        difficulty: "MEDIUM",
        subjectId: webDevSubject.id,
        userId: user.id,
      },
    }),
    prisma.topic.create({
      data: {
        name: "React Hooks & State Architecture",
        description: "useEffect dependencies, useMemo, custom hooks, component lifecycle",
        status: "COMPLETED",
        understanding: 82,
        difficulty: "MEDIUM",
        subjectId: webDevSubject.id,
        userId: user.id,
      },
    }),
  ]);

  // 5. Create Rich Study Sessions: Today, Past 7 Days (Weekly), and Past 30 Days (Monthly)
  const now = new Date();

  // Today's 4 sessions: Total 4h 35m = 275 mins
  // Session 1: Quantitative Aptitude (07:10 AM - 08:35 AM = 85 mins)
  const t1Start = new Date(now);
  t1Start.setHours(7, 10, 0, 0);
  const t1End = new Date(now);
  t1End.setHours(8, 35, 0, 0);

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subjectId: quantSubject.id,
      topicId: quantTopics[1].id,
      mode: "NORMAL",
      durationMinutes: 85,
      durationSeconds: 85 * 60,
      startTime: t1Start,
      endTime: t1End,
      whatStudied: "Profit & Loss successive discount formulas and deceptive shopkeeper weighing problems.",
      whatLearned: "Learned the direct ratio formula (100+P)/(100-D) = MP/CP for instant marked price calculations.",
      whatUnderstood: "Mastered how to convert fractional multipliers into percentages instantly without long division.",
      whatNotUnderstood: "Need more speed when discounts are compounded with free items (e.g., Buy 4 Get 1 Free + 20% off).",
      difficulty: "MEDIUM",
      personalNotes: "Solved 25 previous years' CGL Tier 1 questions. Accuracy rate was 92%.",
    },
  });

  // Session 2: Reasoning (10:30 AM - 11:25 AM = 55 mins)
  const t2Start = new Date(now);
  t2Start.setHours(10, 30, 0, 0);
  const t2End = new Date(now);
  t2End.setHours(11, 25, 0, 0);

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subjectId: reasoningSubject.id,
      topicId: reasoningTopics[0].id,
      mode: "POMODORO",
      durationMinutes: 55,
      durationSeconds: 55 * 60,
      startTime: t2Start,
      endTime: t2End,
      whatStudied: "Complex Syllogisms: 'Only a few', 'Can never be', and Reverse Syllogism deduction.",
      whatLearned: "'Only a few A are B' strictly implies two simultaneous facts: Some A are B AND Some A are NOT B.",
      whatUnderstood: "Cleared all confusion around negative conclusions when no definite cross-relation exists.",
      whatNotUnderstood: "Multi-statement Venn intersections involving 5+ entities require cleaner drawing technique.",
      difficulty: "EASY",
      personalNotes: "Completed two 25-minute Pomodoro sprints with 5 min break. Zero errors on test set.",
    },
  });

  // Session 3: Indian Polity & GS (03:00 PM - 04:10 PM = 70 mins)
  const t3Start = new Date(now);
  t3Start.setHours(15, 0, 0, 0);
  const t3End = new Date(now);
  t3End.setHours(16, 10, 0, 0);

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subjectId: gsSubject.id,
      topicId: gsTopics[0].id,
      mode: "NORMAL",
      durationMinutes: 70,
      durationSeconds: 70 * 60,
      startTime: t3Start,
      endTime: t3End,
      whatStudied: "Articles 14 to 32 of Indian Constitution and Supreme Court Prerogative Writs (Habeas Corpus, Mandamus, Quo Warranto).",
      whatLearned: "Difference between High Court Article 226 writ jurisdiction (broader) vs Supreme Court Article 32 (only Fundamental Rights).",
      whatUnderstood: "The doctrine of severability and basic structure doctrine from Kesavananda Bharati case.",
      whatNotUnderstood: "Need to memorize specific timeline exceptions for preventive detention under Article 22.",
      difficulty: "MEDIUM",
      personalNotes: "Prepared a 1-page cheatsheet of all 5 writs with landmark case citations.",
    },
  });

  // Session 4: Web Dev & JavaScript (08:30 PM - 09:35 PM = 65 mins)
  const t4Start = new Date(now);
  t4Start.setHours(20, 30, 0, 0);
  const t4End = new Date(now);
  t4End.setHours(21, 35, 0, 0);

  await prisma.studySession.create({
    data: {
      userId: user.id,
      subjectId: webDevSubject.id,
      topicId: webTopics[0].id,
      mode: "NORMAL",
      durationMinutes: 65,
      durationSeconds: 65 * 60,
      startTime: t4Start,
      endTime: t4End,
      whatStudied: "Event Loop microtask queues, Promise.allSettled vs Promise.race, async/await error bubbling.",
      whatLearned: "How Promise.allSettled avoids fast-failing, making it ideal for independent parallel batch requests.",
      whatUnderstood: "Understood microtask execution order before setTimeout macro tasks.",
      whatNotUnderstood: "Graceful cancellation using AbortController in streamed responses.",
      difficulty: "MEDIUM",
      personalNotes: "Tested implementation directly in Node.js REPL. Verified promise chaining rules.",
    },
  });

  // Past 7 Days (Weekly consistency): 4 to 5 hours each day across different subjects
  for (let day = 1; day <= 6; day++) {
    const pastDay = new Date(now);
    pastDay.setDate(pastDay.getDate() - day);

    // Morning session
    const mStart = new Date(pastDay);
    mStart.setHours(8, 0, 0, 0);
    const mEnd = new Date(pastDay);
    mEnd.setHours(10, 30, 0, 0);

    const sub = day % 3 === 0 ? quantSubject : day % 3 === 1 ? englishSubject : computerSubject;
    const top = day % 3 === 0 ? quantTopics[0] : day % 3 === 1 ? englishTopics[0] : computerTopics[0];

    await prisma.studySession.create({
      data: {
        userId: user.id,
        subjectId: sub.id,
        topicId: top.id,
        mode: "NORMAL",
        durationMinutes: 150,
        durationSeconds: 150 * 60,
        startTime: mStart,
        endTime: mEnd,
        whatStudied: `Deep syllabus focus on ${top.name}`,
        whatLearned: "Completed theoretical derivations, rule analysis, and speed drills.",
        whatUnderstood: "Understood core patterns and solved 40 timed practice questions.",
        difficulty: day % 2 === 0 ? "MEDIUM" : "HARD",
        personalNotes: "Consistency is compounding! Maintained high retention.",
      },
    });

    // Evening session
    const eStart = new Date(pastDay);
    eStart.setHours(17, 30, 0, 0);
    const eEnd = new Date(pastDay);
    eEnd.setHours(19, 40, 0, 0);

    const sub2 = day % 2 === 0 ? gsSubject : reasoningSubject;
    const top2 = day % 2 === 0 ? gsTopics[1] : reasoningTopics[1];

    await prisma.studySession.create({
      data: {
        userId: user.id,
        subjectId: sub2.id,
        topicId: top2.id,
        mode: "POMODORO",
        durationMinutes: 130,
        durationSeconds: 130 * 60,
        startTime: eStart,
        endTime: eEnd,
        whatStudied: `Targeted revision and sectional mock tests for ${top2.name}`,
        whatLearned: "Identified shortcut elimination techniques to save 15 seconds per question.",
        whatUnderstood: "Strengthened formula recall under strict mock exam timer.",
        difficulty: "MEDIUM",
        personalNotes: "Mock test score: 44/50 in this section.",
      },
    });
  }

  // Older sessions for the Month (weeks 2, 3, 4 of the current month)
  for (let day = 7; day <= 25; day += 2) {
    const olderDate = new Date(now);
    olderDate.setDate(olderDate.getDate() - day);
    olderDate.setHours(9, 0, 0, 0);
    const olderEnd = new Date(olderDate);
    olderEnd.setHours(13, 0, 0, 0);

    await prisma.studySession.create({
      data: {
        userId: user.id,
        subjectId: quantSubject.id,
        topicId: quantTopics[3].id,
        mode: "NORMAL",
        durationMinutes: 240,
        durationSeconds: 240 * 60,
        startTime: olderDate,
        endTime: olderEnd,
        whatStudied: "Trigonometry heights & distances, double angle conversions, and coordinate geometry.",
        whatLearned: "Mastered tan(A+B) expansion shortcuts for rapid angle elevation problems.",
        whatUnderstood: "Geometric representation of trigonometric ratios.",
        difficulty: "HARD",
      },
    });
  }

  // 6. Tasks
  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        subjectId: quantSubject.id,
        title: "Solve 50 Time, Speed & Distance questions",
        description: "Focus on trains crossing platforms and moving trains in opposite directions",
        dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        priority: "HIGH",
        status: "PENDING",
      },
      {
        userId: user.id,
        subjectId: gsSubject.id,
        title: "Revise Geography: River systems of South India",
        description: "Map Godavari, Krishna, and Cauvery tributaries with dams",
        dueDate: new Date(now.getTime() + 48 * 60 * 60 * 1000),
        priority: "HIGH",
        status: "PENDING",
      },
      {
        userId: user.id,
        subjectId: englishSubject.id,
        title: "Memorize 30 High-Frequency One Word Substitutions",
        description: "Study words relating to science, literature, and government forms",
        dueDate: now,
        priority: "MEDIUM",
        status: "COMPLETED",
      },
      {
        userId: user.id,
        subjectId: computerSubject.id,
        title: "Practice SQL queries: Joins & Subqueries",
        description: "Write INNER, LEFT, and FULL OUTER joins with GROUP BY HAVING clauses",
        dueDate: new Date(now.getTime() + 72 * 60 * 60 * 1000),
        priority: "MEDIUM",
        status: "PENDING",
      },
    ],
  });

  // 7. Notes
  await prisma.studyNote.create({
    data: {
      userId: user.id,
      subjectId: quantSubject.id,
      topicId: quantTopics[1].id,
      title: "Profit, Loss & Successive Discount Cheatsheet",
      content: `# Profit, Loss & Discount Formulas\n\n### Core Relations\n- Profit% = ((SP - CP) / CP) * 100\n- Discount% = ((MP - SP) / MP) * 100\n\n### The Golden Formula\nWhen Profit% (P) and Discount% (D) are known:\nMP / CP = (100 + P) / (100 - D)\n\n### Cheating Shopkeeper Trick\nGain% = ((True Value - False Value) / False Value) * 100\n`,
      tags: "quant,maths,profit-loss,formulas,ssc",
    },
  });

  await prisma.studyNote.create({
    data: {
      userId: user.id,
      subjectId: gsSubject.id,
      topicId: gsTopics[0].id,
      title: "Indian Constitution: Articles & Supreme Court Writs",
      content: `# Supreme Court Writs (Article 32 & 226)\n\n1. **Habeas Corpus** ("To have the body")\n   - Safeguard against illegal or arbitrary detention.\n2. **Mandamus** ("We command")\n   - Directs public official/body to perform non-discretionary statutory duty.\n3. **Prohibition** ("To forbid")\n   - Issued by higher court to lower court preventing jurisdictional overreach.\n4. **Certiorari** ("To be certified")\n   - Quashes unlawful order passed by inferior court or tribunal.\n5. **Quo-Warranto** ("By what authority")\n   - Inquires into legal legality of a person holding a public office.\n`,
      tags: "polity,constitution,writs,gs,ssc-cgl",
    },
  });

  // 8. Revisions
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.revision.create({
    data: {
      userId: user.id,
      topicId: quantTopics[2].id, // Time, Speed & Distance
      intervalDays: 1,
      scheduledFor: now, // Due Today
      isCompleted: false,
      notes: "Weak topic (<50%)! Solve 15 relative speed and train crossing problems.",
    },
  });

  await prisma.revision.create({
    data: {
      userId: user.id,
      topicId: gsTopics[2].id, // Geography River systems
      intervalDays: 3,
      scheduledFor: tomorrow,
      isCompleted: false,
      notes: "Map peninsular river origins and major hydroelectric projects.",
    },
  });

  // 9. Unlock Initial Achievements
  const firstSessionAch = await prisma.achievement.findUnique({ where: { code: "FIRST_SESSION" } });
  const streak7Ach = await prisma.achievement.findUnique({ where: { code: "STREAK_7" } });
  const hours10Ach = await prisma.achievement.findUnique({ where: { code: "HOURS_10" } });
  const hours50Ach = await prisma.achievement.findUnique({ where: { code: "HOURS_50" } });

  if (firstSessionAch) await prisma.userAchievement.create({ data: { userId: user.id, achievementId: firstSessionAch.id } });
  if (streak7Ach) await prisma.userAchievement.create({ data: { userId: user.id, achievementId: streak7Ach.id } });
  if (hours10Ach) await prisma.userAchievement.create({ data: { userId: user.id, achievementId: hours10Ach.id } });
  if (hours50Ach) await prisma.userAchievement.create({ data: { userId: user.id, achievementId: hours50Ach.id } });

  console.log("Rich curriculum and multi-period study progress seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
