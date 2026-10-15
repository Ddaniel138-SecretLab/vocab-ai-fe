import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
export default function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, error, refresh, isProfileComplete } = useAuth();
  const protectedPage = router.pathname.startsWith("/user/");
  useEffect(() => {
    if (!router.isReady || loading || error) return;
    if (protectedPage && !user) void router.replace("/login");
    else if (
      protectedPage &&
      user &&
      !isProfileComplete &&
      router.pathname !== "/user/profile"
    )
      void router.replace("/user/profile");
    else if (
      user &&
      (router.pathname === "/login" || router.pathname === "/register")
    )
      void router.replace(
        isProfileComplete ? "/user/dashboard" : "/user/profile",
      );
  }, [router, protectedPage, user, loading, error, isProfileComplete]);
  if (protectedPage && error)
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => void refresh()}>Thử lại kết nối</Button>
      </Box>
    );
  if (
    protectedPage &&
    (loading ||
      !user ||
      (!isProfileComplete && router.pathname !== "/user/profile"))
  )
    return (
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Đang kiểm tra phiên đăng nhập" />
      </Box>
    );
  if (
    (router.pathname === "/login" || router.pathname === "/register") &&
    (loading || user)
  )
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  return children;
}
