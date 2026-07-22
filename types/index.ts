// Core Type Definitions for Sugar.fit 5th Anniversary Experience

export interface FeedbackResponse {
  userName?: string;
  userEmail?: string;
  overallExperience: string;
  favoritePart: string;
  foodRating: number;
  entertainmentRating: number;
  highlight: string;
  nextYearIdeas: string[];
  nextYearNotes: string;
  userMemoryImage?: string;
  userMemoryCaption?: string;
  submittedAt?: string;
}

export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface ReelItem {
  id: string;
  type: "official" | "uploadPrompt" | "userMemory";
  title: string;
  subtitle?: string;
  image?: string;
  caption?: string;
  author?: string;
  aspectRatio?: string;
}
