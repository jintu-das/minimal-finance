import type { ChatMessage } from "./types";

// Static conversation shown until the chat API exists.
export const placeholderMessages: Array<ChatMessage> = [
  {
    id: "1",
    role: "user",
    content: "How is my spending looking this week?",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "You've spent ₹8,420 so far this week, about 12% more than your weekly average. Dining out is the main driver: it's up 40% compared to last week, mostly from three weekend orders.",
  },
  {
    id: "3",
    role: "user",
    content: "Which categories are close to their budget?",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Two categories are above 80% of their monthly budget: Dining (92%) and Shopping (85%). Groceries and Transport are on track at under 60%.",
  },
];

export const suggestedPrompts: Array<string> = [
  "Where did I overspend this month?",
  "Summarise my income vs expenses",
  "Suggest a budget for groceries",
];
