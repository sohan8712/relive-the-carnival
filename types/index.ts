export interface FeedbackResponse {
  overallExperience: string;   // Screen 2: 😍 Amazing, 😊 Great, 🙂 Good, 😐 Average, 😅 Could've been better
  favoritePart: string;        // Screen 3: Food, Games, Music, Awards, Catching up with everyone
  foodRating: number;          // Screen 4: 1 - 5 stars
  entertainmentRating: number; // Screen 5: 1 - 10 rating from range slider
  highlight: string;           // Screen 6: Open text note
  nextYearIdeas: string[];     // Screen 7: Selected chip tags
  nextYearNotes: string;       // Screen 7: Additional wishlist input
  userMemoryImage?: string;    // Memory photo (base64 / blob URL)
  userMemoryCaption?: string;  // Memory caption
  userMemories?: UserMemory[]; // User uploaded memories list
  submittedAt?: string;        // ISO timestamp for future Google Sheets / Drive POST
}

export interface UserMemory {
  id: string;
  image: string;
  caption?: string;
  author: string;
  createdAt: string;
}

export type ReelItem =
  | { id: string; type: "official"; title: string; subtitle?: string; tagline?: string }
  | { id: string; type: "uploadPrompt"; title?: string; subtitle?: string }
  | { id: string; type: "userMemory"; image: string; caption?: string; author: string };

export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
