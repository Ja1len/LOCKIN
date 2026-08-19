# LOCKIN MASTER PLAN

## Product Vision
LOCKIN is a student-focused digital study environment for college students. It combines accountability, collaborative study rooms, Pomodoro focus, peer learning, AI active recall, and progress analytics.

Core loop:
Study -> Focus -> Recall -> Identify Weakness -> Improve

LOCKIN is not social media, a Discord clone, or a conventional LMS.

## Target User
Version 0: college students (Foundation, Diploma, Matriculation, University).
Version 0 user role: Student only.
Future roles: Teacher, PAL Leader, School/Admin.

## Version 0 Scope
Included:
- Landing page
- Login
- Student dashboard
- Study rooms
- Silent Focus, Teaching, Discussion room types
- Pomodoro and study tracking
- AI Tutor prototype
- PDF/document workflow
- Mock AI quiz
- Quiz results and weak-topic recommendations
- Student profile
- Theme personalization
- Progress analytics
- Demo data
- Final integration/presentation polish

Not included yet:
- Teacher accounts
- PAL system
- School administration
- Real video/audio infrastructure
- Native mobile app
- Payments/business model
- Production AI infrastructure

## Product Philosophy
Balance focus and community. Social accountability should motivate study without becoming social-media distraction. College students should feel autonomous; this should not feel like a teacher-monitoring LMS.

## Dashboard
Should show:
- greeting
- today's goal
- streak
- today's study progress
- subject breakdown
- live study rooms
- AI recommendation
- quick actions

Example quick actions:
Continue Previous Session, Join Study Room, Start Pomodoro, Upload Notes.

## Study Rooms
Core differentiator. Default capacity concept: 25 students.

Room types:
1. Silent Focus — study alongside others with minimal talking.
2. Teaching — one student teaches others; future-ready for raise hand, screen sharing, whiteboard.
3. Discussion — students solve problems together.

Version 0 can use mock/local interactions; do not build WebRTC unless explicitly requested.

Study room page:
- header: name, subject, topic, room type, participant count
- Pomodoro timer
- study goal
- participants
- chat
- controls

## Pomodoro
Default 25-minute focus / 5-minute break.
Controls: start, pause, reset.
Subject selection before starting.
Completed sessions update study time, subject breakdown, and streak where applicable.
Current prototype already has Pomodoro tracking/local-storage study sessions. Preserve working logic.

## AI Tutor / Active Recall
Workflow:
Upload material -> Processing -> Generate resource -> Quiz -> Results -> Weak-topic recommendation.

Route: /ai-tutor

Resources:
- Quiz
- Flashcards
- Summary

Version 0 uses mock AI responses and does not require API keys.
Future: PDF extraction + OpenAI API + adaptive questioning.

Quiz:
- question number
- question
- options
- submit
- explanation

Results:
- score
- correct answers
- weak topics
- recommended revision

## Profile and Themes
Profile:
- name
- institution
- course
- subjects
- study statistics
- quiz accuracy

Themes:
- Deep Focus: dark/minimal
- Clean Study: bright/academic
- Energy Mode: colourful/motivational
Future customization: accent colour, contrast/intensity, animation intensity.

## Progress Analytics
Show:
- weekly study time
- subject breakdown
- quiz performance
- weak topics
Use charts only where useful.

## Demo Data
Demo student: Ailee.
Subjects: Mathematics, Physics, Computer Science.
Use realistic mock study sessions, rooms, documents, quiz results, weak topics, and progress so the presentation does not look empty.

## Future PAL Module
PAL is NOT Version 0.
Current workflow:
- Teacher assigns selected students and PAL leaders.
- Typical group: 1 PAL leader + 3–5 members.
- Teacher communicates through WhatsApp.
- Teacher prepares PDF question sets.
- PAL leader guides members.
- Sessions are normally physical; location usually fixed but teacher may update it.
- Leader takes a photo after the session and posts it to WhatsApp.

Future improvements:
- PAL session notifications
- PAL calendar
- Teacher material upload
- temporary material lifecycle/automatic archive or deletion
- session record
- attendance
- evidence photo

Do not invent current PAL problems; improve organization and reduce manual handling.

## Preferred Technology
Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Future backend:
- Supabase for auth/database/storage/realtime.

Future AI:
- OpenAI API and PDF/text extraction.

Deployment:
- Vercel.

## Database Direction
Future tables:
- users
- study_sessions
- rooms
- room_messages
- documents
- quizzes
- quiz_results

Do not introduce production database complexity before needed.

## Roadmap
1. Foundation — Landing, Login, Dashboard. COMPLETED.
2. Study Environment — Study Rooms and room types. COMPLETED/MOSTLY COMPLETED.
3. Pomodoro Tracking — timer, local study sessions, dashboard updates. COMPLETED.
4. AI Tutor — currently PARTIAL. Existing AITutorShell and mock upload/processing/quiz/result flow exist. Verify /ai-tutor route and connect dashboard navigation.
5. Profile + Themes — NOT COMPLETE.
6. Progress Analytics — NOT COMPLETE.
7. Demo Data + Final Integration/Polish — NOT COMPLETE.

## Current Known Status
DONE:
- Landing
- Login
- Dashboard
- Study Rooms
- Pomodoro tracking
- Local-storage study sessions

PARTIAL:
- AI Tutor
- AITutorShell exists
- mock upload/processing/quiz/result workflow exists
- /ai-tutor route is being connected
- dashboard navigation should be connected

NOT DONE:
- Profile
- Theme persistence/personalization
- Progress Analytics
- Demo data
- Final integration/polish
- PAL

## Coding Rules
1. Inspect existing code before editing.
2. Never rebuild completed features unnecessarily.
3. Implement one milestone at a time.
4. Maintain existing LOCKIN design language.
5. Prefer reusable components.
6. Keep TypeScript clean.
7. Avoid unnecessary dependencies.
8. Use mock data when a real backend is not required.
9. Keep responsive design.
10. Test after meaningful changes.
11. Do not silently change product decisions.
12. If a major requirement is unclear, ask first.

## Presentation Flow
Login -> Dashboard -> Join Study Room -> Start Pomodoro -> Complete Session -> Upload Material -> Generate Quiz -> Answer -> See Weak Topics -> View Progress.

Core message:
LOCKIN combines social accountability with active learning so students can focus, recall, and improve.

## Handover Instruction
Any future LLM/coding assistant should read this document, inspect the current repository, verify the actual implementation, preserve completed work, and continue from the first incomplete milestone. Report changes and remaining issues after each milestone.
