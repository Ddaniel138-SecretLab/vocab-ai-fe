export type SchoolStage = "MIDDLE_SCHOOL" | "HIGH_SCHOOL";
export type EnglishLevel =
  "BEGINNER" | "BASIC" | "INTERMEDIATE" | "UPPER_INTERMEDIATE" | "ADVANCED";
export interface User {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
}
export interface Profile {
  id: string;
  userId: string;
  displayName: string | null;
  dateOfBirth: string | null;
  schoolStage: SchoolStage | null;
  englishLevel: EnglishLevel | null;
  interests: string[];
  learningGoal: string | null;
}
export interface ProfileResult {
  profile: Profile | null;
  isProfileComplete: boolean;
}
export interface ProfileInput {
  displayName: string;
  dateOfBirth: string;
  schoolStage: SchoolStage;
  englishLevel: EnglishLevel;
  interests: string[];
  learningGoal: string;
}
export const schoolStages: Record<SchoolStage, string> = {
  MIDDLE_SCHOOL: "THCS (cấp 2)",
  HIGH_SCHOOL: "THPT (cấp 3)",
};
export const englishLevels: Record<EnglishLevel, string> = {
  BEGINNER: "Mới bắt đầu",
  BASIC: "Cơ bản",
  INTERMEDIATE: "Trung cấp",
  UPPER_INTERMEDIATE: "Trên trung cấp",
  ADVANCED: "Nâng cao",
};
