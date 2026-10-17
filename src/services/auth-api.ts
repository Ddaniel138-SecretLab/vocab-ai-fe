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
  adminLogin: (email: string, password: string) =>
    apiRequest<{ user: User }>("/admin/auth/login", post({ email, password })),
  adminLogout: () =>
    apiRequest<{ message: string }>("/admin/auth/logout", post()),
  requestPasswordCode: (email: string) =>
    apiRequest<{ message: string }>(
      "/auth/password/request-code",
      post({ email }),
    ),
  verifyPasswordCode: (email: string, code: string) =>
    apiRequest<{ resetToken: string; expiresIn: number }>(
      "/auth/password/verify-code",
      post({ email, code }),
    ),
  resetPassword: (resetToken: string, newPassword: string) =>
    apiRequest<{ message: string }>(
      "/auth/password/reset",
      post({ resetToken, newPassword }),
    ),
  profile: () => apiRequest<ProfileResult>("/users/me/profile"),
  updateProfile: (body: ProfileInput) =>
    apiRequest<ProfileResult>("/users/me/profile", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
