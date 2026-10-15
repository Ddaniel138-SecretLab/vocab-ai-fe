import { apiRequest } from "@/lib/api-client";
import type { User, ProfileInput, ProfileResult } from "@/types/auth";
const post = (body?: unknown) => ({
  method: "POST",
  ...(body ? { body: JSON.stringify(body) } : {}),
});
export const authApi = {
  me: () => apiRequest<{ user: User }>("/auth/me"),
  login: (email: string, password: string) =>
    apiRequest<{ user: User }>("/auth/login", post({ email, password })),
  requestCode: (email: string) =>
    apiRequest<{ message: string }>(
      "/auth/register/request-code",
      post({ email }),
    ),
  verifyCode: (email: string, code: string, password: string) =>
    apiRequest<{ user: User }>(
      "/auth/register/verify-code",
      post({ email, code, password }),
    ),
  logout: () => apiRequest<{ message: string }>("/auth/logout", post()),
  profile: () => apiRequest<ProfileResult>("/users/me/profile"),
  updateProfile: (body: ProfileInput) =>
    apiRequest<ProfileResult>("/users/me/profile", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
