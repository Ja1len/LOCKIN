"use client";

export type Subject = "Mathematics" | "Physics" | "Computer Science" | "Biology";

export interface UserProfile {
  name: string;
  institution: string;
  course: string;
  email: string;
  subjects: Subject[];
  avatarInitial: string;
}

export interface StudySession {
  id: string;
  user: string;
  subject: Subject;
  duration: number; // in minutes
  date: string; // ISO date string
  roomName?: string;
}

export interface RoomData {
  id: string;
  name: string;
  subject: Subject;
  topic: string;
  type: "Silent Focus" | "Teaching" | "Discussion";
  participantCount: number;
  capacity: number;
  accent: string;
  host?: string;
  hostRole?: string;
  discussionQuestion?: string;
  goal?: string;
  participants: {
    name: string;
    initials: string;
    role: string;
    online: boolean;
    tone: string;
    isHost?: boolean;
    handRaised?: boolean;
  }[];
  initialMessages: {
    id: string;
    name: string;
    time: string;
    text: string;
    tone: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface AIDocument {
  id: string;
  title: string;
  subject: Subject;
  uploadedAt: string;
  pageCount: number;
  fileSize: string;
  topics: string[];
  questions: QuizQuestion[];
  flashcards: {
    id: string;
    front: string;
    back: string;
    topic: string;
  }[];
  summary: {
    keyConcepts: string[];
    formulas: { name: string; formula: string; note: string }[];
    takeaways: string[];
  };
}

export interface QuizResultRecord {
  id: string;
  documentId: string;
  documentTitle: string;
  subject: Subject;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  strongTopics: string[];
  weakTopics: string[];
}

export type ThemeMode = "clean" | "focus" | "energy";

// Initial Demo Data
export const DEFAULT_PROFILE: UserProfile = {
  name: "Ailee",
  institution: "Sunway University",
  course: "Computer Science",
  email: "ailee@sunway.edu.my",
  subjects: ["Mathematics", "Physics", "Computer Science", "Biology"],
  avatarInitial: "A",
};

export const INITIAL_ROOMS: RoomData[] = [
  {
    id: "physics-focus",
    name: "Physics Focus",
    subject: "Physics",
    topic: "Electromagnetic Induction & Flux",
    type: "Silent Focus",
    participantCount: 18,
    capacity: 25,
    accent: "#2d6a4f",
    goal: "Complete Chapter 4 Exercise Questions",
    participants: [
      { name: "Ailee", initials: "A", role: "You", online: true, tone: "bg-emerald-100 text-emerald-800" },
      { name: "Aiman", initials: "AI", role: "Room Host", online: true, tone: "bg-sky-100 text-sky-800", isHost: true },
      { name: "Sarah Tan", initials: "ST", role: "Member", online: true, tone: "bg-amber-100 text-amber-800" },
      { name: "Daniel Lim", initials: "DL", role: "Member", online: true, tone: "bg-violet-100 text-violet-800" },
      { name: "Mei Lin", initials: "ML", role: "Member", online: true, tone: "bg-rose-100 text-rose-800" },
      { name: "Farhan", initials: "F", role: "Member", online: true, tone: "bg-indigo-100 text-indigo-800" },
    ],
    initialMessages: [
      { id: "1", name: "Aiman", time: "10:00 AM", text: "Welcome to Silent Focus! Let's lock in for this 25-min block.", tone: "bg-sky-100 text-sky-800" },
      { id: "2", name: "Sarah Tan", time: "10:04 AM", text: "Starting with Faraday's Law numericals.", tone: "bg-amber-100 text-amber-800" },
      { id: "3", name: "Daniel Lim", time: "10:08 AM", text: "Good luck everyone. Keeping notifications on silent.", tone: "bg-violet-100 text-violet-800" },
    ],
  },
  {
    id: "cs-teaching",
    name: "CS Study Hall",
    subject: "Computer Science",
    topic: "Graph Traversal Algorithms (BFS & DFS)",
    type: "Teaching",
    participantCount: 14,
    capacity: 20,
    accent: "#486581",
    host: "Daniel Lim",
    hostRole: "Peer Tutor",
    goal: "Understand Adjacency Lists & DFS Recursion Stack",
    participants: [
      { name: "Daniel Lim", initials: "DL", role: "Teaching", online: true, tone: "bg-violet-100 text-violet-800", isHost: true },
      { name: "Ailee", initials: "A", role: "Attending", online: true, tone: "bg-emerald-100 text-emerald-800" },
      { name: "Kavitha", initials: "K", role: "Attending", online: true, tone: "bg-teal-100 text-teal-800", handRaised: true },
      { name: "Marcus", initials: "M", role: "Attending", online: true, tone: "bg-blue-100 text-blue-800" },
      { name: "Hui Min", initials: "HM", role: "Attending", online: true, tone: "bg-pink-100 text-pink-800" },
    ],
    initialMessages: [
      { id: "1", name: "Daniel Lim", time: "10:15 AM", text: "Hey everyone! Today we are covering Graph representations and comparing BFS vs DFS.", tone: "bg-violet-100 text-violet-800" },
      { id: "2", name: "Kavitha", time: "10:18 AM", text: "Could you explain why DFS uses a stack while BFS uses a FIFO queue?", tone: "bg-teal-100 text-teal-800" },
      { id: "3", name: "Daniel Lim", time: "10:20 AM", text: "Great question Kavitha! Bringing up the recursion stack slide now.", tone: "bg-violet-100 text-violet-800" },
    ],
  },
  {
    id: "chemistry-discussion",
    name: "Chemistry Discussion Hub",
    subject: "Physics",
    topic: "Organic Chemistry & Resonance Structures",
    type: "Discussion",
    participantCount: 9,
    capacity: 16,
    accent: "#b56845",
    discussionQuestion: "Why does benzene have resonance stabilization energy compared to 1,3,5-cyclohexatriene?",
    goal: "Solve Exercise Set 3: Delocalized Pi Electrons",
    participants: [
      { name: "Ailee", initials: "A", role: "Member", online: true, tone: "bg-emerald-100 text-emerald-800" },
      { name: "Chen Wei", initials: "CW", role: "Moderator", online: true, tone: "bg-amber-100 text-amber-800", isHost: true },
      { name: "Priya", initials: "P", role: "Member", online: true, tone: "bg-orange-100 text-orange-800" },
      { name: "Syed", initials: "S", role: "Member", online: true, tone: "bg-purple-100 text-purple-800" },
    ],
    initialMessages: [
      { id: "1", name: "Chen Wei", time: "09:45 AM", text: "Let's tackle question 4 together: resonance hybrid stability in aromatic rings.", tone: "bg-amber-100 text-amber-800" },
      { id: "2", name: "Priya", time: "09:50 AM", text: "Because the 6 pi electrons are completely delocalized across all 6 carbon atoms!", tone: "bg-orange-100 text-orange-800" },
    ],
  },
  {
    id: "maths-clinic",
    name: "Calculus Clinic",
    subject: "Mathematics",
    topic: "Integration Techniques & Partial Fractions",
    type: "Silent Focus",
    participantCount: 12,
    capacity: 18,
    accent: "#1f6f8b",
    goal: "Master Integration by Parts with Trigonometric Substitutions",
    participants: [
      { name: "Ailee", initials: "A", role: "Member", online: true, tone: "bg-emerald-100 text-emerald-800" },
      { name: "Nathan", initials: "N", role: "Room Host", online: true, tone: "bg-cyan-100 text-cyan-800", isHost: true },
      { name: "Chloe", initials: "C", role: "Member", online: true, tone: "bg-fuchsia-100 text-fuchsia-800" },
    ],
    initialMessages: [
      { id: "1", name: "Nathan", time: "11:00 AM", text: "Silent study block for Math Assignment 2. Let's do this.", tone: "bg-cyan-100 text-cyan-800" },
    ],
  },
];

export const INITIAL_DOCUMENTS: AIDocument[] = [
  {
    id: "doc-physics-ch4",
    title: "Physics Chapter 4 - Electromagnetic Induction.pdf",
    subject: "Physics",
    uploadedAt: "Today, 09:30 AM",
    pageCount: 14,
    fileSize: "2.4 MB",
    topics: ["Magnetic Flux", "Faraday's Law", "Lenz's Law", "Eddy Currents", "Transformers"],
    questions: [
      {
        id: "q1",
        question: "According to Faraday's Law, what directly determines the magnitude of induced electromotive force (EMF)?",
        options: [
          "The rate of change of magnetic flux through the circuit",
          "The static strength of the external magnetic field",
          "The electrical resistance of the wire coil",
          "The absolute temperature of the conductor",
        ],
        correctIndex: 0,
        explanation: "Faraday's Law states that EMF = -N(dΦ/dt), meaning induced EMF is directly proportional to the rate of change of magnetic flux.",
        topic: "Faraday's Law",
      },
      {
        id: "q2",
        question: "What physical conservation law is the fundamental basis for Lenz's Law?",
        options: [
          "Conservation of Electric Charge",
          "Conservation of Energy",
          "Conservation of Linear Momentum",
          "Conservation of Mass",
        ],
        correctIndex: 1,
        explanation: "Lenz's Law ensures that mechanical work done against the opposing magnetic force is converted into electrical energy, satisfying conservation of energy.",
        topic: "Lenz's Law",
      },
      {
        id: "q3",
        question: "How is Magnetic Flux (Φ) mathematically defined for a uniform magnetic field B through area A at angle θ to the normal?",
        options: [
          "Φ = B / (A · cos θ)",
          "Φ = B · A · sin θ",
          "Φ = B · A · cos θ",
          "Φ = B² · A",
        ],
        correctIndex: 2,
        explanation: "Magnetic flux is the scalar dot product of the magnetic field vector and area vector: Φ = B · A · cos θ.",
        topic: "Magnetic Flux",
      },
      {
        id: "q4",
        question: "Which technique is most commonly employed to minimize energy loss caused by Eddy Currents in transformer iron cores?",
        options: [
          "Using a single solid block of uninsulated steel",
          "Laminating the core with thin insulated steel sheets",
          "Heating the core to high operating temperatures",
          "Surrounding the core with a copper shield",
        ],
        correctIndex: 1,
        explanation: "Laminating the core into thin sheets separated by insulating varnish restricts eddy current loops, substantially reducing resistive I²R heat losses.",
        topic: "Eddy Currents",
      },
      {
        id: "q5",
        question: "In an ideal step-down transformer where secondary turns Ns < primary turns Np, what happens to voltage and current?",
        options: [
          "Voltage increases, Current decreases",
          "Voltage decreases, Current increases",
          "Both Voltage and Current decrease",
          "Both Voltage and Current increase",
        ],
        correctIndex: 1,
        explanation: "In a step-down transformer, secondary voltage decreases (Vs = Vp · Ns/Np) while secondary current increases (Is = Ip · Np/Ns) to conserve power (P = V · I).",
        topic: "Transformers",
      },
    ],
    flashcards: [
      {
        id: "f1",
        front: "What is Magnetic Flux (Φ) and its SI unit?",
        back: "Magnetic flux measures the total magnetic field passing through a given surface area (Φ = B · A · cos θ). Its SI unit is the Weber (Wb) or Tesla-meter² (T·m²).",
        topic: "Magnetic Flux",
      },
      {
        id: "f2",
        front: "State Faraday's Law of Electromagnetic Induction.",
        back: "The induced electromotive force (EMF) in any closed loop is directly proportional to the time rate of change of magnetic flux through the loop: ε = -N (dΦ / dt).",
        topic: "Faraday's Law",
      },
      {
        id: "f3",
        front: "Explain Lenz's Law in simple terms.",
        back: "The polarity of induced EMF generates an electric current whose magnetic field directly opposes the change in magnetic flux that produced it.",
        topic: "Lenz's Law",
      },
      {
        id: "f4",
        front: "What are Eddy Currents and how are they minimized?",
        back: "Loops of electrical current induced within solid conductors by a changing magnetic field. They are minimized by using laminated cores separated by insulating varnish.",
        topic: "Eddy Currents",
      },
    ],
    summary: {
      keyConcepts: [
        "Electromagnetic Induction occurs whenever there is relative motion or a changing magnetic field relative to a conductor.",
        "Faraday's Law quantifies the induced voltage magnitude as ε = -N (dΦ/dt).",
        "Lenz's Law provides the direction of induced current and represents conservation of energy in electromagnetic systems.",
        "Self-induction vs Mutual induction: Self-induction occurs within a single coil, while mutual induction transfers energy across coupled coils (transformers).",
      ],
      formulas: [
        { name: "Magnetic Flux", formula: "Φ = B · A · cos θ", note: "Unit: Weber (Wb)" },
        { name: "Faraday's Law", formula: "ε = -N · (ΔΦ / Δt)", note: "N = number of turns" },
        { name: "Transformer Ratio", formula: "Vs / Vp = Ns / Np = Ip / Is", note: "Ideal transformer relation" },
      ],
      takeaways: [
        "Always check the angle θ: it is measured between the magnetic field vector and the normal perpendicular to the coil area.",
        "Remember that Lenz's law explains the negative sign in Faraday's formula.",
        "Practice drawing induced current directions using the Right-Hand Grip Rule.",
      ],
    },
  },
  {
    id: "doc-calculus-integration",
    title: "Calculus - Integration Techniques & Applications.pdf",
    subject: "Mathematics",
    uploadedAt: "Yesterday",
    pageCount: 18,
    fileSize: "3.1 MB",
    topics: ["Integration by Parts", "Partial Fractions", "Trigonometric Substitution", "Definite Integrals"],
    questions: [
      {
        id: "cq1",
        question: "What is the standard formula for Integration by Parts?",
        options: [
          "∫ u dv = u·v - ∫ v du",
          "∫ u dv = u·v + ∫ v du",
          "∫ u dv = u'·v - ∫ u·v' dx",
          "∫ u dv = (u·v) / 2",
        ],
        correctIndex: 0,
        explanation: "Derived directly from the product rule of differentiation: ∫ u dv = u·v - ∫ v du.",
        topic: "Integration by Parts",
      },
      {
        id: "cq2",
        question: "According to the LIATE mnemonic, which function should be prioritized first as 'u' in Integration by Parts?",
        options: [
          "Algebraic functions",
          "Logarithmic functions",
          "Trigonometric functions",
          "Exponential functions",
        ],
        correctIndex: 1,
        explanation: "LIATE stands for Logarithmic, Inverse trigonometric, Algebraic, Trigonometric, Exponential. 'L' (Logarithmic) comes first.",
        topic: "Integration by Parts",
      },
      {
        id: "cq3",
        question: "For an integral containing the expression √(a² - x²), which trigonometric substitution is recommended?",
        options: [
          "x = a · tan θ",
          "x = a · sec θ",
          "x = a · sin θ",
          "x = a · cos² θ",
        ],
        correctIndex: 2,
        explanation: "Substituting x = a · sin θ transforms √(a² - a²sin²θ) into √(a²cos²θ) = a·cos θ using the identity 1 - sin²θ = cos²θ.",
        topic: "Trigonometric Substitution",
      },
    ],
    flashcards: [
      {
        id: "cf1",
        front: "State the LIATE rule for Integration by Parts.",
        back: "L = Logarithmic, I = Inverse trig, A = Algebraic, T = Trigonometric, E = Exponential. Pick 'u' in this priority order.",
        topic: "Integration by Parts",
      },
      {
        id: "cf2",
        front: "When is Partial Fraction Decomposition applicable?",
        back: "When integrating rational functions P(x)/Q(x) where the degree of numerator P(x) is strictly less than degree of denominator Q(x).",
        topic: "Partial Fractions",
      },
    ],
    summary: {
      keyConcepts: [
        "Integration by Parts is the inverse of the Product Rule: ∫ u dv = uv - ∫ v du.",
        "Partial fractions split complex rational polynomials into simple integrable components.",
        "Trigonometric substitution uses right triangle geometric identities to eliminate square roots.",
      ],
      formulas: [
        { name: "Integration by Parts", formula: "∫ u dv = u·v - ∫ v du", note: "Use LIATE for 'u'" },
        { name: "Trig Identity 1", formula: "sin²θ + cos²θ = 1", note: "For √(a² - x²)" },
        { name: "Trig Identity 2", formula: "1 + tan²θ = sec²θ", note: "For √(a² + x²)" },
      ],
      takeaways: [
        "If the degree of numerator ≥ denominator, perform polynomial long division first.",
        "Don't forget to add the constant of integration (+ C) for indefinite integrals.",
      ],
    },
  },
  {
    id: "doc-cs-graphs",
    title: "Computer Science - Graph Algorithms & Traversal.pdf",
    subject: "Computer Science",
    uploadedAt: "3 days ago",
    pageCount: 22,
    fileSize: "1.9 MB",
    topics: ["Graph Representations", "Breadth-First Search", "Depth-First Search", "Dijkstra's Algorithm"],
    questions: [
      {
        id: "gq1",
        question: "Which data structure is primarily utilized to implement Breadth-First Search (BFS)?",
        options: [
          "Stack (LIFO)",
          "Queue (FIFO)",
          "Priority Heap only",
          "Binary Search Tree",
        ],
        correctIndex: 1,
        explanation: "BFS explores vertices level by level in first-in-first-out order using a standard Queue.",
        topic: "Breadth-First Search",
      },
      {
        id: "gq2",
        question: "What is the time complexity of Depth-First Search on a graph with V vertices and E edges represented as an Adjacency List?",
        options: [
          "O(V · E)",
          "O(V²)",
          "O(V + E)",
          "O(log V)",
        ],
        correctIndex: 2,
        explanation: "DFS visits every vertex once (V) and examines each edge once (E), resulting in O(V + E) linear time.",
        topic: "Depth-First Search",
      },
    ],
    flashcards: [
      {
        id: "gf1",
        front: "Compare BFS vs DFS traversal orders.",
        back: "BFS visits nearest neighbor nodes level-by-level (Queue). DFS explores as deep as possible along each branch before backtracking (Stack/Recursion).",
        topic: "Graph Representations",
      },
      {
        id: "gf2",
        front: "When is Adjacency List preferred over Adjacency Matrix?",
        back: "For sparse graphs (where E << V²), adjacency lists save significant memory O(V + E) compared to O(V²) matrices.",
        topic: "Graph Representations",
      },
    ],
    summary: {
      keyConcepts: [
        "Graphs consist of Vertices (V) connected by Edges (E) — directed or undirected, weighted or unweighted.",
        "BFS finds the shortest path in unweighted graphs.",
        "DFS is ideal for topological sorting, cycle detection, and connected components.",
      ],
      formulas: [
        { name: "BFS / DFS Complexity", formula: "Time: O(V + E), Space: O(V)", note: "Adjacency List" },
        { name: "Dijkstra's Complexity", formula: "O((V + E) log V)", note: "With Min-Heap / Priority Queue" },
      ],
      takeaways: [
        "Always maintain a `visited` set or boolean array to avoid infinite loops in cyclic graphs.",
      ],
    },
  },
];

export const INITIAL_QUIZ_RESULTS: QuizResultRecord[] = [
  {
    id: "qr-1",
    documentId: "doc-physics-ch4",
    documentTitle: "Physics Chapter 4 - Electromagnetic Induction",
    subject: "Physics",
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    strongTopics: ["Magnetic Flux", "Transformers", "Eddy Currents"],
    weakTopics: ["Faraday's Law", "Lenz's Law"],
  },
  {
    id: "qr-2",
    documentId: "doc-calculus-integration",
    documentTitle: "Calculus - Integration Techniques",
    subject: "Mathematics",
    score: 3,
    totalQuestions: 3,
    percentage: 100,
    date: new Date(Date.now() - 3600000 * 26).toISOString(),
    strongTopics: ["Integration by Parts", "Trigonometric Substitution"],
    weakTopics: [],
  },
  {
    id: "qr-3",
    documentId: "doc-cs-graphs",
    documentTitle: "Computer Science - Graph Algorithms",
    subject: "Computer Science",
    score: 2,
    totalQuestions: 2,
    percentage: 100,
    date: new Date(Date.now() - 3600000 * 72).toISOString(),
    strongTopics: ["Breadth-First Search", "Depth-First Search"],
    weakTopics: [],
  },
];

export const INITIAL_SESSIONS: StudySession[] = [
  { id: "s1", user: "Ailee", subject: "Mathematics", duration: 45, date: new Date().toISOString(), roomName: "Calculus Clinic" },
  { id: "s2", user: "Ailee", subject: "Computer Science", duration: 25, date: new Date().toISOString(), roomName: "CS Study Hall" },
  { id: "s3", user: "Ailee", subject: "Physics", duration: 10, date: new Date().toISOString(), roomName: "Physics Focus" },
  // Past days sessions for progress chart
  { id: "s4", user: "Ailee", subject: "Physics", duration: 60, date: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "s5", user: "Ailee", subject: "Mathematics", duration: 50, date: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "s6", user: "Ailee", subject: "Computer Science", duration: 45, date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "s7", user: "Ailee", subject: "Mathematics", duration: 75, date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "s8", user: "Ailee", subject: "Physics", duration: 50, date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "s9", user: "Ailee", subject: "Biology", duration: 30, date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "s10", user: "Ailee", subject: "Computer Science", duration: 60, date: new Date(Date.now() - 86400000 * 5).toISOString() },
];

const KEYS = {
  PROFILE: "lockin_profile_v0",
  ROOMS: "lockin_rooms_v0",
  DOCUMENTS: "lockin_documents_v0",
  SESSIONS: "lockin-study-sessions",
  QUIZ_RESULTS: "lockin_quiz_results_v0",
  THEME: "lockin_theme_v0",
  STREAK: "lockin_streak_v0",
};

export function getProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export function getRooms(): RoomData[] {
  if (typeof window === "undefined") return INITIAL_ROOMS;
  try {
    const raw = localStorage.getItem(KEYS.ROOMS);
    return raw ? JSON.parse(raw) : INITIAL_ROOMS;
  } catch {
    return INITIAL_ROOMS;
  }
}

export function getRoomById(id: string): RoomData | undefined {
  const rooms = getRooms();
  return rooms.find((r) => r.id === id) || INITIAL_ROOMS.find((r) => r.id === id) || INITIAL_ROOMS[0];
}

export function saveRoomMessage(roomId: string, messageText: string, senderName = "Ailee"): RoomData {
  const rooms = getRooms();
  const room = rooms.find((r) => r.id === roomId) || INITIAL_ROOMS.find((r) => r.id === roomId);
  if (!room) return INITIAL_ROOMS[0];
  
  const newMessage = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: senderName,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    text: messageText,
    tone: "bg-emerald-100 text-emerald-800",
  };
  
  room.initialMessages.push(newMessage);
  const updatedRooms = rooms.map((r) => (r.id === roomId ? room : r));
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(updatedRooms));
  }
  return room;
}

export function getDocuments(): AIDocument[] {
  if (typeof window === "undefined") return INITIAL_DOCUMENTS;
  try {
    const raw = localStorage.getItem(KEYS.DOCUMENTS);
    return raw ? JSON.parse(raw) : INITIAL_DOCUMENTS;
  } catch {
    return INITIAL_DOCUMENTS;
  }
}

export function getDocumentById(id: string): AIDocument | undefined {
  const docs = getDocuments();
  return docs.find((d) => d.id === id) || INITIAL_DOCUMENTS[0];
}

export function saveDocument(doc: AIDocument): void {
  const docs = getDocuments();
  const updated = [doc, ...docs.filter((d) => d.id !== doc.id)];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(updated));
  }
}

export function getSessions(): StudySession[] {
  if (typeof window === "undefined") return INITIAL_SESSIONS;
  try {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : INITIAL_SESSIONS;
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function addSession(subject: Subject, duration = 25, roomName?: string): StudySession {
  const newSession: StudySession = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    user: "Ailee",
    subject,
    duration,
    date: new Date().toISOString(),
    roomName,
  };
  const sessions = [newSession, ...getSessions()];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  }
  return newSession;
}

export function getQuizResults(): QuizResultRecord[] {
  if (typeof window === "undefined") return INITIAL_QUIZ_RESULTS;
  try {
    const raw = localStorage.getItem(KEYS.QUIZ_RESULTS);
    return raw ? JSON.parse(raw) : INITIAL_QUIZ_RESULTS;
  } catch {
    return INITIAL_QUIZ_RESULTS;
  }
}

export function saveQuizResult(result: QuizResultRecord): void {
  const results = [result, ...getQuizResults()];
  if (typeof window !== "undefined") {
    localStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify(results));
  }
}

export function getTheme(): ThemeMode {
  if (typeof window === "undefined") return "clean";
  try {
    const raw = localStorage.getItem(KEYS.THEME) as ThemeMode;
    return raw && ["clean", "focus", "energy"].includes(raw) ? raw : "clean";
  } catch {
    return "clean";
  }
}

export function saveTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.THEME, theme);
}
