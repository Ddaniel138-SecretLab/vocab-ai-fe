import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import AuthShell from "@/components/auth/AuthShell";
import { authApi } from "@/services/auth-api";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage } from "@/lib/api-client";
export default function RegisterView() {
  const router = useRouter();
  const { register, refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [sent, setSent] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!remaining) return;
    const timer = setTimeout(
      () => setRemaining((n) => Math.max(0, n - 1)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [remaining]);
  async function requestCode(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (busy || remaining) return;
    setBusy(true);
    setError("");
    try {
      await authApi.requestCode(email.trim().toLowerCase());
      setSent(true);
      setRemaining(60);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function verify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
      setError("Mật khẩu cần ít nhất 8 ký tự và tối đa 72 byte UTF-8.");
      return;
    }
    setBusy(true);
    try {
      await register(email.trim().toLowerCase(), code, password);
      await refresh();
      await router.replace("/user/profile");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthShell title="Tạo tài khoản">
      <Stack
        component="form"
        onSubmit={sent ? verify : requestCode}
        spacing={2}
      >
        <Typography variant="body2" color="text.secondary">
          Xác minh email trước, sau đó hoàn thiện hồ sơ để nhận chủ đề phù hợp.
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          required
          label="Email"
          type="email"
          autoComplete="email"
          disabled={busy || sent}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {sent && (
          <>
            <Alert severity="info">
              Nếu email đủ điều kiện đăng ký, mã đã được gửi. Kiểm tra hộp thư
              và thư rác.
            </Alert>
            <TextField
              required
              label="Mã xác minh 6 chữ số"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              autoComplete="one-time-code"
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  pattern: "[0-9]{6}",
                  maxLength: 6,
                },
              }}
              disabled={busy}
            />
            <TextField
              required
              label="Mật khẩu"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Ít nhất 8 ký tự, tối đa 72 byte UTF-8."
              disabled={busy}
            />
            <TextField
              required
              label="Nhập lại mật khẩu"
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              disabled={busy}
            />
          </>
        )}
        <Button variant="contained" type="submit" size="large" disabled={busy}>
          {busy
            ? "Đang xử lý…"
            : sent
              ? "Xác minh và đăng ký"
              : "Gửi mã xác minh"}
        </Button>
        {sent && (
          <Stack direction="row" spacing={1}>
            <Button
              disabled={busy || remaining > 0}
              onClick={() => void requestCode()}
            >
              {remaining ? `Gửi lại sau ${remaining}s` : "Gửi lại mã"}
            </Button>
            <Button
              disabled={busy}
              onClick={() => {
                setSent(false);
                setCode("");
                setPassword("");
                setConfirmation("");
                setError("");
              }}
            >
              Đổi email
            </Button>
          </Stack>
        )}
        <Typography variant="body2">
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
