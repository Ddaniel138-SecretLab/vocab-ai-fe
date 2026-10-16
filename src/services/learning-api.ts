import { apiRequest } from "@/lib/api-client";
import type {
  StudySession,
  SessionType,
  Rating,
  LearningSettings,
  SettingsResponse,
  GeneratedResult,
} from "@/types/learning";
export function queryString(
  values: Record<string, string | number | undefined>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values))
    if (value !== undefined && value !== "") params.set(key, String(value));
  return params.size ? `?${params}` : "";
}
const post = (body?: unknown): RequestInit => ({
  method: "POST",
  ...(body ? { body: JSON.stringify(body) } : {}),
});
export const learningApi = {
  generateTopics: (count: number) =>
    apiRequest<{
      topics: import("@/types/learning").Topic[];
      model: string;
      quota: import("@/types/learning").DailyQuota;
      vocabularyGenerated: boolean;
    }>("/ai/topics", {
      ...post({ count }),
      signal: AbortSignal.timeout(180000),
    }),
  createSession: (topicId: string, type: SessionType, size: number) =>
    apiRequest<{ session: StudySession }>(
      type === "FLASHCARD" ? "/study/flashcards" : "/study/quizzes",
      post({ topicId, size }),
    ),
  answer: (
    sessionId: string,
    itemId: string,
    type: SessionType,
    answer: { rating: Rating } | { selectedIndex: number },
  ) =>
    apiRequest<{
      itemId: string;
      answeredAt: string;
      rating?: Rating;
      selectedIndex?: number;
    }>(
      `/study/${type === "FLASHCARD" ? "flashcards" : "quizzes"}/${sessionId}/items/${itemId}`,
      { method: "PATCH", body: JSON.stringify(answer) },
    ),
  complete: (id: string) =>
    apiRequest<{ session: StudySession }>(
      `/study/sessions/${id}/complete`,
      post(),
    ),
  generate: (topicId: string, count: number) =>
    apiRequest<GeneratedResult>(`/ai/topics/${topicId}/vocabulary`, {
      ...post({ count, fresh: true }),
      signal: AbortSignal.timeout(180000),
    }),
  resolveAudio: (topicId: string) =>
    apiRequest<{
      resolved: number;
      missing: number;
      items: { id: string; audioUrl: string | null }[];
    }>(`/topics/${topicId}/audio/resolve`, {
      ...post(),
      signal: AbortSignal.timeout(120000),
    }),
  createReview: () =>
    apiRequest<{ session: StudySession }>("/learning/review-sessions", post()),
  saveSettings: (input: LearningSettings) =>
    apiRequest<Omit<SettingsResponse, "schedulerEnabled">>(
      "/learning/settings",
      { method: "PATCH", body: JSON.stringify(input) },
    ),
  testReminder: () =>
    apiRequest<{ message: string }>("/learning/reminders/test", post()),
};
