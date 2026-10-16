import { apiRequest } from "@/lib/api-client";
import type { AdminUser, AdminUserInput } from "@/types/admin";
export const adminApi = {
  create: (input: AdminUserInput) =>
    apiRequest<{ user: AdminUser }>("/admin/users", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: AdminUserInput) =>
    apiRequest<{ user: AdminUser }>(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  archive: (id: string) =>
    apiRequest<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" }),
};
