import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage } from "@/lib/api-client";
export default function LoginView() {
    const router = useRouter();
    const { login, refresh } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            await login(email.trim().toLowerCase(), password);
            await refresh();
            await router.replace("/user/dashboard");
        } catch (e) {
            setError(errorMessage(e));
        } finally {
            setBusy(false);
        }
    }
    return (
        <AuthShell title="Đăng nhập">
            <Stack component="form" onSubmit={submit} spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    required
                    type="email"
                    label="Email"
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
                <Button type="submit" variant="contained" size="large" disabled={busy}>
                    {busy ? "Đang đăng nhập…" : "Vào học ngay"}
                </Button>
                <Typography variant="body2">
                    Chưa có tài khoản? <Link href="/register">Đăng ký</Link>
                </Typography>
            </Stack>
        </AuthShell>
    );
}
