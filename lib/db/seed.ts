import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { users, rooms } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const passwordHash = await bcrypt.hash("lockin123", 10);

  const [demoUser] = await db
    .insert(users)
    .values({
      name: "Ailee",
      email: "ailee@sunway.edu.my",
      passwordHash,
      institution: "Sunway University",
      course: "Computer Science",
      subjects: ["Mathematics", "Physics", "Computer Science", "Biology"],
      avatarInitial: "A",
    })
    .onConflictDoNothing({ target: users.email })
    .returning();

  const demoRooms = [
    {
      slug: "physics-focus",
      name: "Physics Focus",
      subject: "Physics",
      topic: "Electromagnetic Induction & Flux",
      type: "Silent Focus",
      capacity: 25,
      accent: "#2d6a4f",
      goal: "Complete Chapter 4 Exercise Questions",
    },
    {
      slug: "cs-teaching",
      name: "CS Study Hall",
      subject: "Computer Science",
      topic: "Graph Traversal Algorithms (BFS & DFS)",
      type: "Teaching",
      capacity: 20,
      accent: "#486581",
      hostRole: "Peer Tutor",
      goal: "Understand Adjacency Lists & DFS Recursion Stack",
    },
    {
      slug: "chemistry-discussion",
      name: "Chemistry Discussion Hub",
      subject: "Physics",
      topic: "Organic Chemistry & Resonance Structures",
      type: "Discussion",
      capacity: 16,
      accent: "#b56845",
      discussionQuestion:
        "Why does benzene have resonance stabilization energy compared to 1,3,5-cyclohexatriene?",
      goal: "Solve Exercise Set 3: Delocalized Pi Electrons",
    },
    {
      slug: "maths-clinic",
      name: "Calculus Clinic",
      subject: "Mathematics",
      topic: "Integration Techniques & Partial Fractions",
      type: "Silent Focus",
      capacity: 18,
      accent: "#1f6f8b",
      goal: "Master Integration by Parts with Trigonometric Substitutions",
    },
  ];

  for (const room of demoRooms) {
    await db
      .insert(rooms)
      .values({ ...room, hostUserId: demoUser?.id })
      .onConflictDoNothing({ target: rooms.slug });
  }

  console.log("Seed complete. Demo login: ailee@sunway.edu.my / lockin123");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
