"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Layers,
  HelpCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  getDocuments,
  saveDocument,
  saveQuizResult,
  type AIDocument,
  type QuizQuestion,
  type QuizResultRecord,
} from "@/lib/store";

export function AITutorShell() {
  const [documents, setDocuments] = useState<AIDocument[]>(getDocuments());
  const [selectedDoc, setSelectedDoc] = useState<AIDocument>(documents[0]);
  const [stage, setStage] = useState<"catalog" | "processing" | "resource">("resource");
  const [activeTab, setActiveTab] = useState<"quiz" | "flashcards" | "summary">("quiz");
  const [processingStep, setProcessingStep] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [latestResult, setLatestResult] = useState<QuizResultRecord | null>(null);

  // Flashcards State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<string[]>([]);
  const [reviewCards, setReviewCards] = useState<string[]>([]);

  const handleSimulateUpload = (fileName?: string) => {
    const name = fileName || "Physics Chapter 4 - Electromagnetic Induction.pdf";
    setUploadedFileName(name);
    setStage("processing");
    setProcessingStep(1);

    setTimeout(() => setProcessingStep(2), 700);
    setTimeout(() => setProcessingStep(3), 1400);
    setTimeout(() => setProcessingStep(4), 2100);
    setTimeout(() => {
      setStage("resource");
      setActiveTab("quiz");
      resetQuiz();
    }, 2800);
  };

  const handleSelectDoc = (doc: AIDocument) => {
    setSelectedDoc(doc);
    setStage("resource");
    resetQuiz();
    setCardIndex(0);
    setIsFlipped(false);
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setUserAnswers({});
    setQuizFinished(false);
  };

  const handleAnswer = (optionIndex: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIndex);
    setHasAnswered(true);
    setUserAnswers((prev) => ({ ...prev, [currentQIndex]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < selectedDoc.questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(userAnswers[currentQIndex + 1] ?? null);
      setHasAnswered(userAnswers[currentQIndex + 1] !== undefined);
    } else {
      // Finish Quiz and Calculate Results
      let correctCount = 0;
      const strong: string[] = [];
      const weak: string[] = [];

      selectedDoc.questions.forEach((q, idx) => {
        const ans = userAnswers[idx];
        if (ans === q.correctIndex) {
          correctCount++;
          if (!strong.includes(q.topic)) strong.push(q.topic);
        } else {
          if (!weak.includes(q.topic)) weak.push(q.topic);
        }
      });

      const percentage = Math.round((correctCount / selectedDoc.questions.length) * 100);
      const record: QuizResultRecord = {
        id: "qr-" + Date.now(),
        documentId: selectedDoc.id,
        documentTitle: selectedDoc.title,
        subject: selectedDoc.subject,
        score: correctCount,
        totalQuestions: selectedDoc.questions.length,
        percentage,
        date: new Date().toISOString(),
        strongTopics: strong,
        weakTopics: weak,
      };

      saveQuizResult(record);
      setLatestResult(record);
      setQuizFinished(true);
    }
  };

  const currentQ = selectedDoc.questions[currentQIndex] || selectedDoc.questions[0];
  const currentCard = selectedDoc.flashcards[cardIndex] || selectedDoc.flashcards[0];

  return (
    <AppShell activeNav="ai-tutor">
      <div className="mx-auto max-w-5xl space-y-7 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Bot size={13} />
              AI Active Recall Engine
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              AI Tutor
            </h1>
            <p className="mt-2 text-base text-[var(--muted)]">
              Turn your learning material into active recall quizzes, smart flashcards, and summaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSimulateUpload("Lecture 7 - Advanced Calculus.pdf")}
              className="gap-2 rounded-xl"
            >
              <Upload size={15} />
              Upload PDF Notes
            </Button>
          </div>
        </div>

        {/* Multi-step processing animated screen */}
        {stage === "processing" && (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-10 text-center shadow-sm">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles size={28} className="animate-spin" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[var(--ink)]">
              Processing &ldquo;{uploadedFileName}&rdquo;
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Transforming lecture material into pedagogical active recall resources...
            </p>

            <div className="mx-auto mt-8 max-w-sm space-y-3 text-left">
              <div
                className={`flex items-center gap-3 rounded-xl p-3 text-xs font-semibold transition ${
                  processingStep >= 1
                    ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                    : "text-zinc-400"
                }`}
              >
                <CheckCircle2 size={16} className={processingStep >= 1 ? "text-emerald-600" : "text-zinc-300"} />
                <span>Uploading document &amp; parsing text structure</span>
              </div>

              <div
                className={`flex items-center gap-3 rounded-xl p-3 text-xs font-semibold transition ${
                  processingStep >= 2
                    ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                    : "text-zinc-400"
                }`}
              >
                <CheckCircle2 size={16} className={processingStep >= 2 ? "text-emerald-600" : "text-zinc-300"} />
                <span>Analysing conceptual hierarchy &amp; core formulas</span>
              </div>

              <div
                className={`flex items-center gap-3 rounded-xl p-3 text-xs font-semibold transition ${
                  processingStep >= 3
                    ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                    : "text-zinc-400"
                }`}
              >
                <CheckCircle2 size={16} className={processingStep >= 3 ? "text-emerald-600" : "text-zinc-300"} />
                <span>Generating high-yield active recall questions</span>
              </div>

              <div
                className={`flex items-center gap-3 rounded-xl p-3 text-xs font-semibold transition ${
                  processingStep >= 4
                    ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                    : "text-zinc-400"
                }`}
              >
                <CheckCircle2 size={16} className={processingStep >= 4 ? "text-emerald-600" : "text-zinc-300"} />
                <span>Constructing flashcard deck and executive summary</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Resource Workspace */}
        {stage === "resource" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Left Content Column */}
            <div className="space-y-6">
              {/* Document Info & Mode Switcher Tabs */}
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[var(--line)] pb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <FileText size={20} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {selectedDoc.subject}
                        </span>
                        <span className="text-[11px] text-[var(--muted)]">
                          {selectedDoc.pageCount} pages • {selectedDoc.fileSize}
                        </span>
                      </div>
                      <h2 className="truncate text-base font-bold text-[var(--ink)]">
                        {selectedDoc.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* 3 Learning Resource Tabs */}
                <div className="mt-4 flex rounded-2xl bg-zinc-100 p-1.5 dark:bg-zinc-800/80">
                  <button
                    onClick={() => setActiveTab("quiz")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      activeTab === "quiz"
                        ? "bg-white text-emerald-950 shadow-sm dark:bg-[#162019] dark:text-emerald-200"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <HelpCircle size={15} />
                    Active Recall Quiz ({selectedDoc.questions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("flashcards")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      activeTab === "flashcards"
                        ? "bg-white text-emerald-950 shadow-sm dark:bg-[#162019] dark:text-emerald-200"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <Layers size={15} />
                    Flashcards ({selectedDoc.flashcards.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      activeTab === "summary"
                        ? "bg-white text-emerald-950 shadow-sm dark:bg-[#162019] dark:text-emerald-200"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <BookOpen size={15} />
                    AI Summary
                  </button>
                </div>
              </div>

              {/* TAB 1: ACTIVE RECALL QUIZ */}
              {activeTab === "quiz" && (
                <div>
                  {!quizFinished ? (
                    <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-sm space-y-6">
                      {/* Question Progress Header */}
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Question {currentQIndex + 1} of {selectedDoc.questions.length}
                        </span>
                        <span className="text-xs font-semibold text-[var(--muted)]">
                          Topic: {currentQ.topic}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all duration-300 dark:bg-emerald-400"
                          style={{
                            width: `${((currentQIndex + 1) / selectedDoc.questions.length) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Question Text */}
                      <h3 className="text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl leading-snug">
                        {currentQ.question}
                      </h3>

                      {/* Options Grid */}
                      <div className="space-y-3">
                        {currentQ.options.map((option, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrect = idx === currentQ.correctIndex;
                          let optionStyle =
                            "border-[var(--line)] bg-[var(--card)] hover:border-zinc-300 text-[var(--ink)]";

                          if (hasAnswered) {
                            if (isCorrect) {
                              optionStyle =
                                "border-emerald-600 bg-emerald-50/90 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold ring-2 ring-emerald-400";
                            } else if (isSelected && !isCorrect) {
                              optionStyle =
                                "border-rose-500 bg-rose-50/90 text-rose-950 dark:bg-rose-950/60 dark:text-rose-200";
                            }
                          } else if (isSelected) {
                            optionStyle = "border-emerald-700 bg-emerald-50 text-emerald-900";
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswer(idx)}
                              disabled={hasAnswered}
                              className={`w-full text-left rounded-2xl border p-4 text-sm font-medium transition flex items-center justify-between ${optionStyle}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-black/5 dark:bg-white/10 font-bold text-xs">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{option}</span>
                              </div>
                              {hasAnswered && isCorrect && (
                                <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Feedback Box */}
                      {hasAnswered && (
                        <div
                          className={`rounded-2xl p-4 text-xs leading-relaxed animate-in fade-in duration-200 ${
                            selectedOption === currentQ.correctIndex
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200"
                              : "bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            {selectedOption === currentQ.correctIndex ? (
                              <>
                                <CheckCircle2 size={15} /> Correct!
                              </>
                            ) : (
                              <>
                                <AlertTriangle size={15} /> Explanation
                              </>
                            )}
                          </div>
                          <p>{currentQ.explanation}</p>
                        </div>
                      )}

                      {/* Next / Submit Button */}
                      {hasAnswered && (
                        <div className="flex justify-end pt-2">
                          <Button onClick={handleNextQuestion} className="gap-2 rounded-xl px-6">
                            <span>
                              {currentQIndex + 1 === selectedDoc.questions.length
                                ? "Complete Quiz & View Analysis"
                                : "Next Question"}
                            </span>
                            <ArrowRight size={16} />
                          </Button>
                        </div>
                      )}
                    </section>
                  ) : (
                    /* RESULTS SCREEN */
                    <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-sm space-y-7 animate-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 size={26} />
                          </span>
                          <div>
                            <h3 className="text-xl font-bold text-[var(--ink)]">Quiz Complete</h3>
                            <p className="text-xs text-[var(--muted)]">{selectedDoc.title}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetQuiz} className="gap-1.5 rounded-xl">
                          <RotateCcw size={14} /> Retake Quiz
                        </Button>
                      </div>

                      {/* Score Summary Banner */}
                      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#1b2920] p-6 text-white">
                        <div>
                          <p className="text-xs font-semibold text-emerald-200/80">Overall Accuracy</p>
                          <p className="mt-1 font-mono text-5xl font-extrabold text-[#bfe3cf]">
                            {latestResult?.percentage}%
                          </p>
                          <p className="mt-1 text-xs text-emerald-200/70">
                            {latestResult?.score} of {latestResult?.totalQuestions} answers correct
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            {latestResult && latestResult.percentage >= 80 ? "Mastery Achieved 🌟" : "Review Recommended 📚"}
                          </span>
                        </div>
                      </div>

                      {/* Topic Breakdown: Strong vs Weak */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Strong Topics */}
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                            <CheckCircle2 size={15} className="text-emerald-700 dark:text-emerald-400" />
                            Strong Topics
                          </h4>
                          <div className="mt-3 space-y-1.5">
                            {latestResult?.strongTopics && latestResult.strongTopics.length > 0 ? (
                              latestResult.strongTopics.map((topic) => (
                                <div
                                  key={topic}
                                  className="flex items-center gap-2 rounded-xl bg-white/80 p-2 text-xs font-medium text-emerald-950 dark:bg-zinc-800 dark:text-emerald-200"
                                >
                                  <span>✓</span>
                                  <span>{topic}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-[var(--muted)]">Keep practicing to build topic mastery.</p>
                            )}
                          </div>
                        </div>

                        {/* Weak Topics */}
                        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
                          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                            <AlertTriangle size={15} className="text-amber-700 dark:text-amber-400" />
                            Needs Review
                          </h4>
                          <div className="mt-3 space-y-1.5">
                            {latestResult?.weakTopics && latestResult.weakTopics.length > 0 ? (
                              latestResult.weakTopics.map((topic) => (
                                <div
                                  key={topic}
                                  className="flex items-center gap-2 rounded-xl bg-white/80 p-2 text-xs font-medium text-amber-950 dark:bg-zinc-800 dark:text-amber-200"
                                >
                                  <span>⚠</span>
                                  <span>{topic}</span>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-xl bg-white/80 p-2 text-xs text-emerald-900 dark:bg-zinc-800 dark:text-emerald-200">
                                🎉 No weak areas detected! Excellent comprehension.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Recommended Next Action */}
                      <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/70 p-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <h4 className="text-sm font-bold text-[var(--ink)]">
                            Recommended Next Step
                          </h4>
                          <p className="mt-0.5 text-xs text-[var(--muted)]">
                            {latestResult?.weakTopics && latestResult.weakTopics.length > 0
                              ? `Practice 5 targeted flashcards on ${latestResult.weakTopics.join(", ")}.`
                              : "Reinforce your knowledge with a 25-minute Pomodoro focus block."}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setActiveTab("flashcards");
                          }}
                          className="gap-2 rounded-xl"
                        >
                          Review Flashcards
                          <ArrowRight size={15} />
                        </Button>
                      </div>
                    </section>
                  )}
                </div>
              )}

              {/* TAB 2: FLASHCARDS */}
              {activeTab === "flashcards" && (
                <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Card {cardIndex + 1} of {selectedDoc.flashcards.length}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted)] dark:bg-zinc-800">
                      Topic: {currentCard.topic}
                    </span>
                  </div>

                  {/* 3D Flip Card */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="group relative min-h-[260px] cursor-pointer rounded-3xl border-2 border-dashed border-emerald-300/80 bg-gradient-to-br from-emerald-50/40 to-emerald-100/20 p-8 text-center transition-all hover:border-emerald-600 dark:border-emerald-800 dark:from-emerald-950/20 dark:to-emerald-900/10 flex flex-col justify-between shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                        {isFlipped ? "Answer / Explanation" : "Question / Concept"}
                      </span>
                      <span className="text-[11px] text-zinc-400">Click anywhere to flip</span>
                    </div>

                    <div className="my-auto py-6">
                      <p className="text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl leading-relaxed">
                        {isFlipped ? currentCard.back : currentCard.front}
                      </p>
                    </div>

                    <div className="flex justify-center text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                      <span>{isFlipped ? "↩ Click to see question" : "↪ Click to flip card"}</span>
                    </div>
                  </div>

                  {/* Navigation and Mastery Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={cardIndex === 0}
                        onClick={() => {
                          setCardIndex((i) => Math.max(0, i - 1));
                          setIsFlipped(false);
                        }}
                        className="rounded-xl gap-1"
                      >
                        <ChevronLeft size={16} /> Prev
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={cardIndex === selectedDoc.flashcards.length - 1}
                        onClick={() => {
                          setCardIndex((i) => Math.min(selectedDoc.flashcards.length - 1, i + 1));
                          setIsFlipped(false);
                        }}
                        className="rounded-xl gap-1"
                      >
                        Next <ChevronRight size={16} />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (!reviewCards.includes(currentCard.id)) {
                            setReviewCards([...reviewCards, currentCard.id]);
                            setKnownCards(knownCards.filter((id) => id !== currentCard.id));
                          }
                          if (cardIndex < selectedDoc.flashcards.length - 1) {
                            setCardIndex((i) => i + 1);
                            setIsFlipped(false);
                          }
                        }}
                        className="rounded-xl border-amber-300 text-amber-900 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-950"
                      >
                        ⚠ Needs Review
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!knownCards.includes(currentCard.id)) {
                            setKnownCards([...knownCards, currentCard.id]);
                            setReviewCards(reviewCards.filter((id) => id !== currentCard.id));
                          }
                          if (cardIndex < selectedDoc.flashcards.length - 1) {
                            setCardIndex((i) => i + 1);
                            setIsFlipped(false);
                          }
                        }}
                        className="rounded-xl gap-1"
                      >
                        <CheckCircle2 size={15} /> Got It
                      </Button>
                    </div>
                  </div>
                </section>
              )}

              {/* TAB 3: AI SUMMARY */}
              {activeTab === "summary" && (
                <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-sm space-y-7">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--ink)]">
                      Executive Conceptual Summary
                    </h3>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      AI-distilled essential points from {selectedDoc.title}
                    </p>
                  </div>

                  {/* Key Concepts */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      Key Core Concepts
                    </h4>
                    <div className="mt-3 space-y-2">
                      {selectedDoc.summary.keyConcepts.map((concept, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)]/50 p-3.5 text-xs text-[var(--ink)]"
                        >
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formulas */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      Essential Formulas &amp; Laws
                    </h4>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {selectedDoc.summary.formulas.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-xs"
                        >
                          <p className="text-xs font-semibold text-[var(--muted)]">{item.name}</p>
                          <p className="mt-1.5 font-mono text-base font-bold text-emerald-800 dark:text-emerald-300">
                            {item.formula}
                          </p>
                          <p className="mt-1 text-[11px] text-zinc-400">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Takeaways */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                      Exam Takeaways &amp; Common Pitfalls
                    </h4>
                    <ul className="mt-3 space-y-2 text-xs text-emerald-950 dark:text-emerald-200 list-disc list-inside leading-relaxed">
                      {selectedDoc.summary.takeaways.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar: Document Catalog & Quick Switcher */}
            <aside className="space-y-5">
              {/* Document Library Box */}
              <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <h3 className="text-sm font-bold text-[var(--ink)]">Study Materials</h3>
                  <span className="text-xs text-[var(--muted)]">{documents.length} docs</span>
                </div>

                <div className="mt-3 space-y-2">
                  {documents.map((doc) => {
                    const isSelected = selectedDoc.id === doc.id;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => handleSelectDoc(doc)}
                        className={`w-full text-left rounded-2xl p-3 text-xs transition flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-emerald-100/80 text-emerald-950 font-semibold dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300/60"
                            : "hover:bg-[var(--paper)] text-[var(--ink)] border border-transparent"
                        }`}
                      >
                        <FileText size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{doc.title}</p>
                          <p className="text-[10px] text-[var(--muted)] mt-0.5">
                            {doc.subject} • {doc.uploadedAt}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 border-t border-[var(--line)] pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSimulateUpload("New Chemistry Notes.pdf")}
                    className="w-full gap-1.5 rounded-xl text-xs"
                  >
                    <Upload size={13} />
                    Upload Another PDF
                  </Button>
                </div>
              </div>

              {/* Active Recall Tip Box */}
              <div className="rounded-3xl bg-[#1b2920] p-5 text-white shadow-md">
                <div className="flex items-center gap-2 text-[#bfe3cf]">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Recall Science
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-emerald-100/80">
                  Testing yourself before re-reading increases long-term memory retention by up to <strong>50%</strong> compared to passive review.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </AppShell>
  );
}
