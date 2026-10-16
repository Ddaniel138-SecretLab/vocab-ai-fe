import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import { QueryState } from "@/components/learning/Common";
import { errorMessage } from "@/lib/api-client";
import type { User } from "@/types/auth";
export default function AdminLayout({ children }: { children: ReactNode }) {
  const auth = useAuth(),
    router = useRouter(),
    check = useApiQuery<{ user: User }>("/admin/auth/me");
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await auth.logout(true);
      await router.replace("/admin/login");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Paper square variant="outlined" sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ alignItems: { sm: "center" }, flexWrap: "wrap" }}
        >
          <Typography variant="h6" sx={{ mr: "auto" }}>
            Vocab AI · Quản trị
          </Typography>
          {[
            ["/admin", "Tổng quan"],
            ["/admin/users", "Người dùng"],
            ["/admin/audit-logs", "Nhật ký"],
            ["/user/dashboard", "Trang học tập"],
          ].map(([href, label]) => (
            <Button
              key={href}
              component={Link}
              href={href}
              variant={router.asPath === href ? "contained" : "text"}
            >
              {label}
            </Button>
          ))}
          <Button color="error" disabled={busy} onClick={() => void logout()}>
            Đăng xuất quản trị
          </Button>
        </Stack>
      </Paper>
      <Container maxWidth="xl" sx={{ py: 4, minWidth: 0 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <QueryState {...check} retry={check.reload} />
        {check.data?.user.role === "ADMIN" && children}
      </Container>
    </Box>
  );
}
