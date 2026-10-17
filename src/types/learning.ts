import type { EnglishLevel, SchoolStage } from "./auth";
export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
export interface Topic {
  id: string;
  title: string;
  englishTitle: string;
  description: string | null;
  level: EnglishLevel;
  schoolStages: SchoolStage[];
  tags: string[];
  _count: { vocabulary: number };
  matchedTags?: string[];
  previouslyCompleted?: boolean;
}
export interface Recommendation {
  source: string;
  isAiGenerated: boolean;
  needsProfile: boolean;
  items: Topic[];
}
export interface AudioMetadata {
  audioUrl?: string | null;
  audioProvider?: string | null;
  audioSourceUrl?: string | null;
  audioLicense?: string | null;
  audioLicenseUrl?: string | null;
}
export interface Vocabulary extends AudioMetadata {
  id: string;
  topicId: string;
  word: string;
  meaning: string;
  phonetic: string | null;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
  generatedBy?: string | null;
  progress?: {
    mastery: "KNOWN" | "LEARNING";
    reviewCount: number;
    lastReviewedAt: string | null;
  } | null;
}
export type SessionType = "FLASHCARD" | "QUIZ";
export type SessionStatus = "IN_PROGRESS" | "COMPLETED";
export type Rating = "KNOWN" | "AGAIN";
export interface StudyItem extends AudioMetadata {
  id: string;
  vocabularyId: string;
  position: number;
  word: string;
  answeredAt: string | null;
  meaning?: string;
  phonetic?: string | null;
  exampleSentence?: string;
  exampleTranslation?: string;
  rating?: Rating | null;
  options?: string[];
  selectedIndex?: number | null;
  correctIndex?: number;
  isCorrect?: boolean;
}
export interface SessionSummary {
  id: string;
  topicId: string | null;
  topic: { id: string; title: string; level?: EnglishLevel } | null;
  type: SessionType;
  status: SessionStatus;
  isReview?: boolean;
  totalItems: number;
  answeredItems: number;
  score: number | null;
  correctCount: number | null;
  updatedAt: string;
  completedAt: string | null;
}
export interface StudySession extends SessionSummary {
  items: StudyItem[];
}
export interface Streak {
  currentStreak: number;
  longestStreak: number;
  studiedToday: boolean;
  lastStudyDate: string | null;
  totalStudyDays: number;
  timeZone: string;
}
export interface Dashboard {
  statistics: {
    knownWords: number;
    learningWords: number;
    completedSessions: number;
    pendingSessions: number;
  };
  recentIncomplete: SessionSummary[];
  streak: Streak;
  dueReviews: number;
  isProfileComplete: boolean;
}
export interface DueWord {
  id: string;
  nextReviewAt: string | null;
  successfulReviews: number;
  mastery: "KNOWN" | "LEARNING";
  vocabulary: Vocabulary & { topic: { id: string; title: string } };
}
export interface LearningSettings {
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  reviewBatchSize: number;
}
export interface SettingsResponse {
  settings: LearningSettings;
  timeZone: string;
  schedulerEnabled: boolean;
}
export interface ReminderDelivery {
  id: string;
  dateKey: string;
  status: "SENDING" | "SENT" | "FAILED";
  attempts: number;
  sentAt: string | null;
  lastError: string | null;
}
export interface AiStatus {
  enabled: boolean;
  configured: boolean;
  model: string;
  credentialsVerified: boolean;
}
export interface GeneratedResult {
  cached: boolean;
  model: string;
  words: Vocabulary[];
  audioMissing?: number;
  partial?: boolean;
  requestedCount?: number;
  createdCount?: number;
  attempts?: number;
  message?: string;
}

export interface DailyQuota {
  dateKey: string;
  timeZone: string;
  limit: number;
  used: number;
  reserved: number;
  remaining: number;
}
