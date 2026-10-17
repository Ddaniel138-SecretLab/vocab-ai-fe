import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage } from "@/lib/api-client";
export default function AdminLoginView() {
  const { login, refresh, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await login(email.trim().toLowerCase(), password, true);
      await refresh();
      await router.replace("/admin");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthShell title="Đăng nhập quản trị">
      <Stack component="form" spacing={2} onSubmit={submit}>
        <Typography variant="body2" color="text.secondary">
          Dành cho tài khoản đã được cấp quyền ADMIN.
        </Typography>
        {user && (
          <Alert severity="info">
            Bạn đang dùng tài khoản học tập. Đăng nhập admin sẽ thay phiên hiện
            tại trên trình duyệt này.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          required
          type="email"
          label="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={busy}
        />
        <TextField
          required
          type="password"
          label="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={busy}
        />
        <Button type="submit" variant="contained" disabled={busy}>
          {busy ? "Đang đăng nhập…" : "Vào trang quản trị"}
        </Button>
        <Button component={Link} href="/forgot-password">
          Quên mật khẩu?
        </Button>
        <Button component={Link} href="/login">
          Đăng nhập học tập
        </Button>
      </Stack>
    </AuthShell>
  );
}
