import type { Profile, ProfileInput, UserRole } from "./auth";
export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  deletedAt: string | null;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
  _count: {
    studySessions: number;
    vocabularyProgress: number;
    createdTopics: number;
  };
}
export interface AdminUserInput {
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  profile?: Partial<ProfileInput>;
}
export interface AdminDashboard {
  dateKey: string;
  timeZone: string;
  statistics: Record<string, number>;
  recentUsers: {
    id: string;
    email: string;
    role: UserRole;
    createdAt: string;
  }[];
  applicationAiRequests: {
    unit: string;
    limit: number;
    used: number | null;
    remaining: number | null;
    scope: string;
  };
  cloudflare: {
    unit: string;
    remaining: null;
    liveUsageFetched: boolean;
    dashboardUrl: string;
    docsUrl: string;
    resetTimeZone: string;
  };
}
export interface AuditLog {
  id: string;
  actorId: string;
  targetId: string;
  action: string;
  changedFields: string[];
  createdAt: string;
}
