import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
export default function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, error, refresh, isProfileComplete } = useAuth();
  const userPage = router.pathname.startsWith("/user/");
  const adminPage =
    router.pathname.startsWith("/admin") && router.pathname !== "/admin/login";
  useEffect(() => {
    if (!router.isReady || loading || error) return;
    if ((userPage || adminPage) && !user)
      void router.replace(adminPage ? "/admin/login" : "/login");
    else if (
      userPage &&
      user &&
      !isProfileComplete &&
      router.pathname !== "/user/profile"
    )
      void router.replace("/user/profile");
    else if (user && ["/login", "/register"].includes(router.pathname))
      void router.replace(
        isProfileComplete ? "/user/dashboard" : "/user/profile",
      );
    else if (user?.role === "ADMIN" && router.pathname === "/admin/login")
      void router.replace("/admin");
  }, [router, userPage, adminPage, user, loading, error, isProfileComplete]);
  if ((userPage || adminPage) && error)
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => void refresh()}>Thử lại kết nối</Button>
      </Box>
    );
  if (
    (userPage || adminPage) &&
    (loading ||
      !user ||
      (userPage && !isProfileComplete && router.pathname !== "/user/profile"))
  )
    return (
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <CircularProgress aria-label="Đang kiểm tra phiên đăng nhập" />
      </Box>
    );
  if (adminPage && user?.role !== "ADMIN")
    return (
      <Box sx={{ maxWidth: 600, p: 4, mx: "auto" }}>
        <Alert severity="warning">Tài khoản này không có quyền quản trị.</Alert>
        <Button component={Link} href="/user/dashboard">
          Về trang học tập
        </Button>
        <Button component={Link} href="/admin/login">
          Đăng nhập tài khoản admin khác
        </Button>
      </Box>
    );
  if (
    (["/login", "/register"].includes(router.pathname) && (loading || user)) ||
    (router.pathname === "/admin/login" && (loading || user?.role === "ADMIN"))
  )
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  return children;
}
