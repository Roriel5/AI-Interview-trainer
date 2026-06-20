// ─── Question Banks (5 questions per domain) ───────────────────────────────

export const questionBanks = {
  "Frontend Developer": [
    {
      id: "fe-1",
      text: "Can you explain the difference between CSS Grid and Flexbox, and when you would prefer one over the other?",
    },
    {
      id: "fe-2",
      text: "How does React's virtual DOM work, and what are the performance implications of reconciliation?",
    },
    {
      id: "fe-3",
      text: "Describe your approach to optimizing a React application that's suffering from slow renders and large bundle sizes.",
    },
    {
      id: "fe-4",
      text: "What are closures in JavaScript? Can you give a real-world example where you've used them?",
    },
    {
      id: "fe-5",
      text: "Walk me through how you'd ensure a web application is fully accessible (WCAG 2.1 AA compliant).",
    },
  ],

  "Data Scientist": [
    {
      id: "ds-1",
      text: "Explain the bias-variance tradeoff and how you address it when building machine learning models.",
    },
    {
      id: "ds-2",
      text: "What is the difference between L1 and L2 regularization? When would you choose one over the other?",
    },
    {
      id: "ds-3",
      text: "You're given an imbalanced dataset where positive cases are only 2% of the data. How do you handle this?",
    },
    {
      id: "ds-4",
      text: "Can you describe how gradient boosting works and how it differs from random forests?",
    },
    {
      id: "ds-5",
      text: "How do you handle missing data in a dataset? Walk me through several strategies and when to apply each.",
    },
  ],

  "Backend Engineer": [
    {
      id: "be-1",
      text: "Explain the CAP theorem and how it influences your decisions when designing distributed systems.",
    },
    {
      id: "be-2",
      text: "What are the key differences between REST and GraphQL APIs? When would you use one over the other?",
    },
    {
      id: "be-3",
      text: "How do you design a database schema for a high-traffic application that requires horizontal scaling?",
    },
    {
      id: "be-4",
      text: "Describe how you would implement authentication and authorization securely in a microservices architecture.",
    },
    {
      id: "be-5",
      text: "A production API endpoint is suddenly returning 500 errors. Walk me through your debugging and incident response process.",
    },
  ],
};

// ─── Opening greeting per domain ───────────────────────────────────────────

export const openingMessages = {
  "Frontend Developer":
    "Welcome! I'll be your interviewer today for the Frontend Developer position. We'll cover topics like JavaScript, React, CSS, and web performance. Ready when you are — let's dive in!",
  "Data Scientist":
    "Welcome! I'll be conducting your Data Scientist interview today. We'll explore machine learning, statistics, and data engineering concepts. Let's get started!",
  "Backend Engineer":
    "Welcome! I'm your interviewer for the Backend Engineer role. We'll discuss system design, databases, APIs, and distributed systems. Let's begin!",
};

// ─── Mock Scorecard (replaces a real AI evaluation response) ────────────────

export const mockScorecard = {
  technicalScore: 7.5,
  communicationScore: 8.2,
  feedback: [
    {
      type: "positive",
      text: "Demonstrated solid conceptual understanding across core technical topics.",
    },
    {
      type: "positive",
      text: "Answers were well-structured with clear logical flow and good use of examples.",
    },
    {
      type: "constructive",
      text: "Consider going deeper on edge cases and tradeoffs — interviewers often probe for nuanced thinking.",
    },
    {
      type: "constructive",
      text: "Quantify impact where possible (e.g., 'reduced load time by 40%') to make answers more memorable.",
    },
    {
      type: "constructive",
      text: "Practice the STAR method (Situation, Task, Action, Result) for behavioral follow-ups.",
    },
  ],
  modelAnswers: [
    {
      question: "Core Concepts Question",
      answer:
        "A strong answer starts by clearly defining the concept, then explaining the underlying mechanism with an analogy, followed by a concrete real-world example from your own experience, and finally discussing tradeoffs or alternatives. Interviewers value clarity of thought over completeness.",
    },
    {
      question: "System Design / Architecture Question",
      answer:
        "Begin by clarifying requirements and constraints. Sketch a high-level design, identify components, and reason about scalability, fault tolerance, and data flow. Always mention potential bottlenecks and how you'd address them. Ending with monitoring and observability shows maturity.",
    },
    {
      question: "Problem-Solving & Debugging Question",
      answer:
        "Articulate a systematic approach: reproduce the issue, isolate the component, inspect logs and metrics, form a hypothesis, test and fix, then verify with regression tests. Showing structured thinking under pressure is more valuable than arriving at a perfect answer instantly.",
    },
  ],
};
