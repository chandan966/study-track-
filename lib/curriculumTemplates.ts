export interface TopicTemplate {
  name: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  understanding: number;
}

export interface SubjectTemplate {
  name: string;
  description: string;
  color: string;
  icon: string;
  targetHours: number;
  topics: TopicTemplate[];
}

export interface ExamTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  badgeColor: string;
  subjects: SubjectTemplate[];
}

export const EXAM_PRESETS: ExamTemplate[] = [
  {
    id: "SSC",
    title: "SSC Exams (CGL, CHSL, CPO, MTS)",
    subtitle: "Complete official Staff Selection Commission Tier 1 & Tier 2 syllabus",
    icon: "landmark",
    badge: "Government Exam",
    badgeColor: "bg-pink-100 text-pink-700 border-pink-300",
    subjects: [
      {
        name: "Quantitative Aptitude",
        description: "Arithmetic & Advanced Maths for SSC CGL/CHSL",
        color: "#EC4899",
        icon: "calculator",
        targetHours: 80,
        topics: [
          { name: "Number Systems & Divisibility Rules", description: "Unit digits, remainder theorems, LCM & HCF", difficulty: "MEDIUM", understanding: 60 },
          { name: "Percentages & Ratio-Proportion", description: "Successive percentage, mixtures and alligation", difficulty: "MEDIUM", understanding: 50 },
          { name: "Profit, Loss & Discount", description: "Marked price, cheating shopkeeper tricks", difficulty: "MEDIUM", understanding: 65 },
          { name: "Simple & Compound Interest", description: "Difference formulas for 2 & 3 years, installments", difficulty: "HARD", understanding: 40 },
          { name: "Time, Speed & Distance / Trains", description: "Relative speed, trains crossing platforms, boats & streams", difficulty: "HARD", understanding: 35 },
          { name: "Time & Work / Pipes & Cisterns", description: "Efficiency method, alternate day work, negative work", difficulty: "MEDIUM", understanding: 55 },
          { name: "Algebra & Polynomial Identities", description: "Quadratic equations, algebraic simplifications", difficulty: "HARD", understanding: 45 },
          { name: "Geometry & Triangle/Circle Theorems", description: "Centroid, incenter, chords, tangents, cyclic quadrilaterals", difficulty: "HARD", understanding: 30 },
          { name: "Trigonometry & Heights & Distances", description: "Trigonometric identities, angle of elevation & depression", difficulty: "HARD", understanding: 50 },
          { name: "Mensuration 2D & 3D", description: "Cylinders, cones, spheres, prisms, pyramids area & volume", difficulty: "MEDIUM", understanding: 40 },
          { name: "Data Interpretation (DI)", description: "Bar graphs, pie charts, tabular data analysis", difficulty: "EASY", understanding: 70 },
        ],
      },
      {
        name: "General Intelligence & Reasoning",
        description: "Verbal, Analytical & Non-Verbal Reasoning",
        color: "#DB2777",
        icon: "brain",
        targetHours: 60,
        topics: [
          { name: "Syllogisms & Venn Diagrams", description: "Only a few, possibility cases, reverse syllogisms", difficulty: "EASY", understanding: 80 },
          { name: "Coding-Decoding & Letter Shifts", description: "Alphanumeric codes, matrix shift patterns", difficulty: "EASY", understanding: 75 },
          { name: "Blood Relations & Family Tree", description: "Coded relations, pointing to photograph problems", difficulty: "MEDIUM", understanding: 70 },
          { name: "Number & Alphabet Series", description: "Double difference, prime number gaps, alternating series", difficulty: "MEDIUM", understanding: 60 },
          { name: "Direction Sense & Compass Test", description: "Shadow problems, angle rotations, shortest distance", difficulty: "EASY", understanding: 85 },
          { name: "Seating Arrangement & Puzzles", description: "Linear rows, 8-person circular table arrangements", difficulty: "HARD", understanding: 45 },
          { name: "Non-Verbal Pattern Completion", description: "Mirror images, water images, paper folding & paper cutting", difficulty: "EASY", understanding: 90 },
        ],
      },
      {
        name: "English Language & Comprehension",
        description: "Grammar, Vocabulary & Reading Comprehension",
        color: "#F472B6",
        icon: "book-open",
        targetHours: 55,
        topics: [
          { name: "Spotting Errors & Grammar Rules", description: "Subject-verb agreement, prepositions, modifiers", difficulty: "MEDIUM", understanding: 65 },
          { name: "Reading Comprehension & Cloze Test", description: "Editorial comprehension, tone analysis, contextual passage fillers", difficulty: "MEDIUM", understanding: 60 },
          { name: "Vocabulary & One Word Substitution", description: "High-frequency root words, prefixes, foreign phrases", difficulty: "MEDIUM", understanding: 55 },
          { name: "Idioms & Phrasal Verbs", description: "Top 500 SSC idioms with origin and contextual examples", difficulty: "MEDIUM", understanding: 50 },
          { name: "Active & Passive Voice", description: "Rule conversions across all tenses and interrogatives", difficulty: "EASY", understanding: 85 },
          { name: "Direct & Indirect Speech (Narration)", description: "Reported speech tense shifts and punctuation rules", difficulty: "EASY", understanding: 80 },
        ],
      },
      {
        name: "General Studies & Awareness",
        description: "Polity, History, Geography, Science & Current Affairs",
        color: "#BE185D",
        icon: "globe",
        targetHours: 70,
        topics: [
          { name: "Indian Polity: Constitution & Articles", description: "Preamble, Fundamental Rights (12-35), DPSP, Writs, Judiciary", difficulty: "MEDIUM", understanding: 65 },
          { name: "Modern Indian History (1857-1947)", description: "Freedom struggle, Gandhian era, Viceroys, Constitutional Acts", difficulty: "MEDIUM", understanding: 55 },
          { name: "Geography: Physical & Indian Maps", description: "Himalayas, river systems, mountain passes, national parks", difficulty: "HARD", understanding: 40 },
          { name: "Indian Economy & Budget", description: "National income, inflation, monetary policy, tax reforms", difficulty: "MEDIUM", understanding: 50 },
          { name: "General Science (Physics & Chemistry)", description: "Newton's laws, optics, thermodynamics, periodic table, acids/bases", difficulty: "MEDIUM", understanding: 60 },
          { name: "Biology & Human Anatomy", description: "Digestive, circulatory, nervous systems, vitamins & diseases", difficulty: "MEDIUM", understanding: 65 },
          { name: "Static GK & Current Affairs", description: "Dances, festivals, awards, defense exercises, sports championships", difficulty: "EASY", understanding: 55 },
        ],
      },
    ],
  },
  {
    id: "GATE",
    title: "GATE (Computer Science & IT)",
    subtitle: "Complete technical syllabus for GATE CS & PSU Engineering Exams",
    icon: "cpu",
    badge: "Engineering / Master's",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
    subjects: [
      {
        name: "Data Structures & Algorithms",
        description: "Algorithm design, asymptotic notation, trees, graphs, dynamic programming",
        color: "#8B5CF6",
        icon: "code",
        targetHours: 85,
        topics: [
          { name: "Asymptotic Analysis & Recurrences", description: "Big-O, Master theorem, recursion trees", difficulty: "MEDIUM", understanding: 75 },
          { name: "Linear Structures (Arrays, Stacks, Queues)", description: "Implementation, prefix/postfix conversions, two-pointer methods", difficulty: "EASY", understanding: 85 },
          { name: "Trees & Binary Search Trees (BST/AVL)", description: "Tree traversals, AVL balancing rotations, Heaps & Priority Queues", difficulty: "HARD", understanding: 60 },
          { name: "Graph Algorithms (BFS, DFS, Shortest Paths)", description: "Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal & Prim MST", difficulty: "HARD", understanding: 50 },
          { name: "Dynamic Programming & Greedy Algorithms", description: "0/1 Knapsack, LCS, Matrix Chain Multiplication, Huffman Coding", difficulty: "HARD", understanding: 40 },
        ],
      },
      {
        name: "Operating Systems",
        description: "Process management, memory paging, file systems, synchronization",
        color: "#0284C7",
        icon: "server",
        targetHours: 65,
        topics: [
          { name: "Process Scheduling & Threads", description: "FCFS, SJF, Round Robin, multi-threading models", difficulty: "EASY", understanding: 80 },
          { name: "Concurrency & Deadlocks", description: "Semaphores, Peterson's algorithm, Banker's algorithm, Resource Allocation Graph", difficulty: "HARD", understanding: 50 },
          { name: "Memory Management & Virtual Memory", description: "Paging, segmentation, TLB hit ratio, FIFO/LRU page replacements", difficulty: "HARD", understanding: 55 },
          { name: "File Systems & Disk Scheduling", description: "Inodes, SSTF, SCAN, C-SCAN disk algorithms", difficulty: "MEDIUM", understanding: 70 },
        ],
      },
      {
        name: "Database Management Systems (DBMS)",
        description: "Relational modeling, SQL, Normalization, Transactions & Concurrency",
        color: "#10B981",
        icon: "database",
        targetHours: 60,
        topics: [
          { name: "ER Modeling & Relational Algebra", description: "Entity-relationship diagrams, selection, projection, joins, tuple relational calculus", difficulty: "MEDIUM", understanding: 75 },
          { name: "SQL Queries, Joins & Triggers", description: "Subqueries, nested joins, aggregate functions, views", difficulty: "EASY", understanding: 85 },
          { name: "Database Normalization (1NF to BCNF)", description: "Functional dependencies, canonical cover, lossless join, dependency preservation", difficulty: "HARD", understanding: 65 },
          { name: "Transactions & Concurrency Control", description: "ACID properties, serializability, 2-Phase Locking (2PL), recovery protocols", difficulty: "HARD", understanding: 50 },
        ],
      },
      {
        name: "Computer Networks",
        description: "Layered architecture, routing, TCP/UDP, congestion control",
        color: "#F59E0B",
        icon: "network",
        targetHours: 60,
        topics: [
          { name: "OSI & TCP/IP Reference Models", description: "Layer responsibilities, encapsulation, framing, CRC error detection", difficulty: "EASY", understanding: 80 },
          { name: "Data Link Layer & MAC Protocols", description: "Sliding window protocols (Go-Back-N, Selective Repeat), CSMA/CD", difficulty: "MEDIUM", understanding: 65 },
          { name: "Network Layer & IP Routing", description: "IPv4/IPv6 addressing, subnetting, CIDR, Distance Vector & Link State Routing", difficulty: "HARD", understanding: 55 },
          { name: "Transport Layer: TCP vs UDP", description: "3-way handshake, TCP flow control, congestion window algorithms (Slow Start, Tahoe)", difficulty: "HARD", understanding: 60 },
        ],
      },
      {
        name: "Theory of Computation & Compiler Design",
        description: "Automata theory, regular expressions, context-free grammars, parsers",
        color: "#EC4899",
        icon: "file-code",
        targetHours: 70,
        topics: [
          { name: "Finite Automata (DFA, NFA, Regular Expressions)", description: "State minimization, equivalence, pumping lemma for regular languages", difficulty: "MEDIUM", understanding: 70 },
          { name: "Context-Free Grammars & Pushdown Automata (PDA)", description: "Chomsky normal form, ambiguity, deterministic vs non-deterministic PDA", difficulty: "HARD", understanding: 45 },
          { name: "Turing Machines & Decidability", description: "Halting problem, undecidability proofs, Post correspondence problem", difficulty: "HARD", understanding: 35 },
          { name: "Lexical Analysis & Syntax Parsers (LL, LR, LALR)", description: "First & Follow sets, shift-reduce conflicts, intermediate code generation", difficulty: "HARD", understanding: 50 },
        ],
      },
    ],
  },
  {
    id: "COLLEGE",
    title: "College Semester Exams (B.Tech / BCA / MCA)",
    subtitle: "Core academic curriculum for university computer science engineering semesters",
    icon: "graduation-cap",
    badge: "University / Degree",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    subjects: [
      {
        name: "Object-Oriented Programming (Java / C++)",
        description: "Classes, objects, polymorphism, inheritance, STL, and Design Patterns",
        color: "#EC4899",
        icon: "code",
        targetHours: 50,
        topics: [
          { name: "OOP Pillars: Encapsulation & Inheritance", description: "Class constructors, access specifiers, super/this keywords", difficulty: "EASY", understanding: 90 },
          { name: "Polymorphism & Abstract Classes", description: "Method overloading vs overriding, virtual functions, interface contracts", difficulty: "MEDIUM", understanding: 80 },
          { name: "Exception Handling & File I/O Streams", description: "try-catch-finally, custom exceptions, byte and character streams", difficulty: "MEDIUM", understanding: 75 },
          { name: "Collections Framework & Generics", description: "ArrayList, LinkedList, HashMap, HashSet, Iterators", difficulty: "MEDIUM", understanding: 85 },
        ],
      },
      {
        name: "Data Structures & Algorithms Lab",
        description: "Core algorithms implementation and practical lab programs",
        color: "#8B5CF6",
        icon: "layers",
        targetHours: 60,
        topics: [
          { name: "Stack & Queue Applications", description: "Infix to Postfix conversion, circular queues, deque", difficulty: "EASY", understanding: 85 },
          { name: "Linked List Operations", description: "Singly, doubly, and circular linked lists with reversal", difficulty: "MEDIUM", understanding: 80 },
          { name: "Binary Search Trees & Heap Sort", description: "Insertion, deletion, tree traversals, priority queue", difficulty: "HARD", understanding: 65 },
          { name: "Graph Traversals (BFS & DFS)", description: "Adjacency matrix, adjacency list, cycle detection", difficulty: "MEDIUM", understanding: 70 },
        ],
      },
      {
        name: "Software Engineering & Agile",
        description: "SDLC phases, UML modeling, testing methodologies, DevOps basics",
        color: "#0284C7",
        icon: "users",
        targetHours: 40,
        topics: [
          { name: "Software Development Life Cycle (SDLC)", description: "Waterfall, Spiral, Agile Scrum, Sprint planning", difficulty: "EASY", understanding: 90 },
          { name: "UML Architecture Diagrams", description: "Use Case, Class, Sequence, and State Chart diagrams", difficulty: "MEDIUM", understanding: 80 },
          { name: "Software Testing & QA", description: "Black-box, White-box, Unit testing, Integration testing", difficulty: "EASY", understanding: 85 },
        ],
      },
      {
        name: "Database Management Systems",
        description: "Relational database concepts, SQL queries, and normalization",
        color: "#10B981",
        icon: "database",
        targetHours: 55,
        topics: [
          { name: "Relational Data Model & Keys", description: "Primary, foreign, candidate, and super keys", difficulty: "EASY", understanding: 90 },
          { name: "SQL DDL, DML & DCL Commands", description: "CREATE, ALTER, INSERT, UPDATE, GRANT, REVOKE", difficulty: "EASY", understanding: 95 },
          { name: "Normalization: 1NF, 2NF, 3NF & BCNF", description: "Eliminating insertion, deletion, and update anomalies", difficulty: "HARD", understanding: 65 },
          { name: "Transaction ACID Properties & Logging", description: "Atomicity, Consistency, Isolation, Durability, WAL logs", difficulty: "MEDIUM", understanding: 75 },
        ],
      },
    ],
  },
  {
    id: "WEBDEV",
    title: "Full-Stack Web Development & Coding",
    subtitle: "Modern roadmap from Frontend to Backend, APIs, Databases and Cloud Deployment",
    icon: "globe",
    badge: "Tech Career / Job",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-300",
    subjects: [
      {
        name: "Modern JavaScript & TypeScript",
        description: "ES6+, Async, Event Loop, Types, Interfaces & Advanced Generics",
        color: "#EC4899",
        icon: "code",
        targetHours: 60,
        topics: [
          { name: "Variables, Scopes & Closures", description: "var/let/const, lexical scope, execution context", difficulty: "EASY", understanding: 90 },
          { name: "Async JavaScript: Promises & Async/Await", description: "Event loop, microtasks vs macrotasks, error handling", difficulty: "MEDIUM", understanding: 85 },
          { name: "TypeScript Types, Interfaces & Generics", description: "Type unions, utility types, generic functions & components", difficulty: "MEDIUM", understanding: 75 },
        ],
      },
      {
        name: "React & Next.js Architecture",
        description: "Hooks, state management, Server Components, App Router & Routing",
        color: "#0284C7",
        icon: "layers",
        targetHours: 70,
        topics: [
          { name: "React Components, Props & State", description: "JSX, virtual DOM, reconciliation, component composition", difficulty: "EASY", understanding: 95 },
          { name: "React Hooks (useState, useEffect, useMemo, useRef)", description: "Hook rules, dependency arrays, memoization, cleanup functions", difficulty: "MEDIUM", understanding: 85 },
          { name: "Next.js App Router & Server Actions", description: "Server vs Client Components, layout nesting, Server Actions, streaming", difficulty: "HARD", understanding: 70 },
        ],
      },
      {
        name: "Backend APIs & Authentication",
        description: "REST APIs, NextAuth, JWT, Session cookies, Zod validation",
        color: "#10B981",
        icon: "server",
        targetHours: 50,
        topics: [
          { name: "REST API Design & Route Handlers", description: "HTTP methods, status codes, request parsing, response formatting", difficulty: "EASY", understanding: 90 },
          { name: "User Authentication & Password Hashing", description: "NextAuth, bcrypt hashing, JWT tokens, session callbacks", difficulty: "MEDIUM", understanding: 80 },
          { name: "Input Validation with Zod", description: "Schema definition, parsing, error response handling", difficulty: "EASY", understanding: 95 },
        ],
      },
      {
        name: "Databases & Prisma ORM",
        description: "PostgreSQL, Neon, SQLite, Prisma Schema, Relations & Migrations",
        color: "#8B5CF6",
        icon: "database",
        targetHours: 45,
        topics: [
          { name: "Relational Modeling with Prisma", description: "1-to-many, many-to-many relationships, cascading deletes", difficulty: "MEDIUM", understanding: 85 },
          { name: "Prisma Client Queries & Transactions", description: "findMany, create, update, upsert, interactive transactions", difficulty: "MEDIUM", understanding: 80 },
          { name: "Database Migrations & Cloud Deployment", description: "prisma migrate dev, prisma db push, Neon PostgreSQL setup", difficulty: "MEDIUM", understanding: 75 },
        ],
      },
    ],
  },
  {
    id: "BANKING",
    title: "Banking Exams (IBPS PO, SBI PO, RBI Grade B)",
    subtitle: "Quantitative Aptitude, High-Level Reasoning Puzzles, English & Financial Awareness",
    icon: "dollar-sign",
    badge: "Banking / Finance",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-300",
    subjects: [
      {
        name: "Quantitative Aptitude (Banking)",
        description: "Data Interpretation caselets, quadratic inequalities, arithmetic word problems",
        color: "#EC4899",
        icon: "calculator",
        targetHours: 75,
        topics: [
          { name: "Data Interpretation (Caselets & Radar Charts)", description: "Tabular, missing DI, Venn diagram caselets", difficulty: "HARD", understanding: 50 },
          { name: "Quadratic Equation Comparisons (X vs Y)", description: "Factorization shortcuts, sign rule comparisons", difficulty: "EASY", understanding: 85 },
          { name: "Missing & Wrong Number Series", description: "Difference of squares, polynomial step series", difficulty: "MEDIUM", understanding: 65 },
          { name: "Arithmetic Word Problems", description: "Profit/loss, time & work, partnerships, mixture & alligation", difficulty: "HARD", understanding: 45 },
        ],
      },
      {
        name: "Reasoning Ability & High Puzzles",
        description: "Floor puzzles, box puzzles, circular seating, coded inequalities",
        color: "#DB2777",
        icon: "brain",
        targetHours: 70,
        topics: [
          { name: "Floor & Flat Based Puzzles", description: "Multiple variable scheduling with conditions", difficulty: "HARD", understanding: 40 },
          { name: "Circular & Square Seating (Inside/Outside)", description: "Blood relations combined with seating order", difficulty: "HARD", understanding: 45 },
          { name: "Coded Inequalities & Syllogisms", description: "Definite vs possible deductions, Either-Or cases", difficulty: "EASY", understanding: 80 },
          { name: "Input-Output Machine Shuffling", description: "Alphanumeric step rearrangement algorithms", difficulty: "MEDIUM", understanding: 60 },
        ],
      },
      {
        name: "General & Banking Awareness",
        description: "RBI monetary policy, banking terms, financial news, current affairs",
        color: "#BE185D",
        icon: "landmark",
        targetHours: 50,
        topics: [
          { name: "RBI Functions & Monetary Policy", description: "Repo rate, Reverse repo, CRR, SLR, Open Market Operations", difficulty: "MEDIUM", understanding: 70 },
          { name: "Banking Terms & Accounts", description: "NPA, Basel III norms, CASA accounts, RTGS/NEFT/IMPS", difficulty: "MEDIUM", understanding: 65 },
          { name: "Financial & Economic Current Affairs", description: "Union Budget, GST collections, World Bank/IMF projections", difficulty: "MEDIUM", understanding: 60 },
        ],
      },
    ],
  },
  {
    id: "UPSC",
    title: "UPSC Civil Services (IAS / IPS)",
    subtitle: "General Studies Prelims & Mains curriculum: Polity, History, Geography, Economy",
    icon: "shield",
    badge: "Civil Services",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-300",
    subjects: [
      {
        name: "Indian Polity & Governance",
        description: "Constitutional framework, Parliament, Judiciary, Federalism",
        color: "#EC4899",
        icon: "landmark",
        targetHours: 90,
        topics: [
          { name: "Constitutional Development & Preamble", description: "Historical evolution from 1773 to 1947, constituent assembly", difficulty: "MEDIUM", understanding: 70 },
          { name: "Fundamental Rights, DPSP & Fundamental Duties", description: "Articles 12-51A, judicial review, constitutional amendments", difficulty: "HARD", understanding: 60 },
          { name: "Parliament & State Legislatures", description: "Bills, parliamentary committees, budget passing procedure", difficulty: "HARD", understanding: 55 },
          { name: "Judiciary: Supreme Court & High Courts", description: "Appointment of judges, NJAC, judicial activism, basic structure", difficulty: "HARD", understanding: 65 },
        ],
      },
      {
        name: "Indian & World History",
        description: "Ancient, Medieval, Modern Freedom Movement, Art & Culture",
        color: "#DB2777",
        icon: "book-open",
        targetHours: 85,
        topics: [
          { name: "Indus Valley Civilization & Vedic Period", description: "Town planning, seals, Vedic literature, socio-economic life", difficulty: "MEDIUM", understanding: 75 },
          { name: "Buddhism, Jainism & Mauryan Empire", description: "Ashoka's edicts, Dhamma, architectural rock-cut caves", difficulty: "MEDIUM", understanding: 70 },
          { name: "Modern Indian Freedom Movement (1857-1947)", description: "Swadeshi, Non-Cooperation, Civil Disobedience, Quit India", difficulty: "HARD", understanding: 60 },
        ],
      },
      {
        name: "Geography & Environment",
        description: "Physical geography, climatology, oceanography, biodiversity & conservation",
        color: "#0284C7",
        icon: "globe",
        targetHours: 80,
        topics: [
          { name: "Geomorphology: Plate Tectonics & Earthquakes", description: "Continental drift, faulting, folding, volcanism", difficulty: "MEDIUM", understanding: 70 },
          { name: "Climatology: Monsoons & Jet Streams", description: "Atmospheric pressure belts, cyclones, El Niño/La Niña", difficulty: "HARD", understanding: 50 },
          { name: "Environment: Biodiversity & Climate Conventions", description: "UNFCCC, Paris Agreement, National Parks, RAMSAR wetlands", difficulty: "HARD", understanding: 55 },
        ],
      },
    ],
  },
];
