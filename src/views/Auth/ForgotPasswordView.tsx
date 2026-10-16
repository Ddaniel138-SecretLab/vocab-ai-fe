import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import AuthShell from "@/components/auth/AuthShell";
import { authApi } from "@/services/auth-api";
import { errorMessage } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordView() {
    const { clearSession } = useAuth();
    const [step, setStep] = useState<"email" | "code" | "password" | "done">(
        "email",
    );
    const [email, setEmail] = useState(""),
        [code, setCode] = useState(""),
        [password, setPassword] = useState(""),
        [confirmation, setConfirmation] = useState("");
    const [busy, setBusy] = useState(false),
        [error, setError] = useState(""),
        [cooldown, setCooldown] = useState(0),
        [seconds, setSeconds] = useState(0);
    const token = useRef<string | null>(null),
        lock = useRef(false);
    const [expiresAt, setExpiresAt] = useState(0);
    useEffect(() => {
        if (!cooldown) return;
        const timer = setTimeout(
            () => setCooldown((n) => Math.max(0, n - 1)),
            1000,
        );
        return () => clearTimeout(timer);
    }, [cooldown]);
    useEffect(() => {
        if (!expiresAt) return;
        const timer = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
            setSeconds(remaining);
            if (!remaining) token.current = null;
        }, 1000);
        return () => clearInterval(timer);
    }, [expiresAt]);
    useEffect(
        () => () => {
            token.current = null;
        },
        [],
    );
    function startOver() {
        token.current = null;
        setExpiresAt(0);
        setSeconds(0);
        setStep("email");
        setCode("");
        setPassword("");
        setConfirmation("");
        setError("");
    }
    async function run(work: () => Promise<void>) {
        if (lock.current) return;
        lock.current = true;
        setBusy(true);
        setError("");
        try {
            await work();
        } catch (e) {
            setError(errorMessage(e));
        } finally {
            lock.current = false;
            setBusy(false);
        }
    }
    const requestCode = () =>
        run(async () => {
            await authApi.requestPasswordCode(email.trim().toLowerCase());
            setStep("code");
            setCooldown(60);
        });
    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (step === "email") {
            await requestCode();
            return;
        }
        if (step === "code") {
            await run(async () => {
                const result = await authApi.verifyPasswordCode(
                    email.trim().toLowerCase(),
                    code,
                );
                token.current = result.resetToken;
                setExpiresAt(Date.now() + result.expiresIn * 1000);
                setSeconds(result.expiresIn);
                setCode("");
                setStep("password");
            });
            return;
        }
        if (step === "password") {
            if (password !== confirmation) {
                setError("Mật khẩu xác nhận không khớp.");
                return;
            }
            if (
                password.length < 8 ||
                new TextEncoder().encode(password).length > 72
            ) {
                setError("Mật khẩu cần ít nhất 8 ký tự và tối đa 72 byte UTF-8.");
                return;
            }
            if (!token.current || !seconds) {
                setError("Quyền đổi mật khẩu đã hết hạn. Hãy yêu cầu mã mới.");
                return;
            }
            await run(async () => {
                await authApi.resetPassword(token.current!, password);
                token.current = null;
                setExpiresAt(0);
                setPassword("");
                setConfirmation("");
                clearSession();
                setStep("done");
            });
        }
    }
    return (
        <AuthShell title="Quên mật khẩu">
            <Stack component="form" spacing={2} onSubmit={submit}>
                {error && <Alert severity="error">{error}</Alert>}
                {step === "done" ? (
                    <>
                        <Alert severity="success">
                            Đã đổi mật khẩu. Các phiên đăng nhập cũ đã kết thúc.
                        </Alert>
                        <Button component={Link} href="/login" variant="contained">
                            Đăng nhập bằng mật khẩu mới
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary">
                            {step === "email"
                                ? "Nhập email đã đăng ký để nhận mã đặt lại mật khẩu."
                                : step === "code"
                                    ? "Nếu tài khoản đủ điều kiện, mã đã được gửi. Hãy kiểm tra hộp thư và thư rác."
                                    : "Mã đã được xác minh. Nhập mật khẩu mới để hoàn tất."}
                        </Typography>
                        <TextField
                            required
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={busy || step !== "email"}
                        />
                        {step === "code" && (
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
                        )}
                        {step === "password" && (
                            <>
                                <TextField
                                    required
                                    type="password"
                                    label="Mật khẩu mới"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    disabled={busy || !seconds}
                                />
                                <TextField
                                    required
                                    type="password"
                                    label="Nhập lại mật khẩu mới"
                                    value={confirmation}
                                    onChange={(e) => setConfirmation(e.target.value)}
                                    autoComplete="new-password"
                                    disabled={busy || !seconds}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {seconds
                                        ? `Quyền đổi mật khẩu còn ${Math.ceil(seconds / 60)} phút. Mật khẩu hiện tại chưa thay đổi cho đến khi bạn xác nhận.`
                                        : "Quyền đổi mật khẩu đã hết hạn. Yêu cầu mã mới để tiếp tục."}
                                </Typography>
                            </>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={busy || (step === "password" && !seconds)}
                        >
                            {busy
                                ? "Đang xử lý…"
                                : step === "email"
                                    ? "Gửi mã đặt lại mật khẩu"
                                    : step === "code"
                                        ? "Xác minh mã"
                                        : "Đổi mật khẩu"}
                        </Button>
                        {step === "code" && (
                            <Button
                                type="button"
                                disabled={busy || cooldown > 0}
                                onClick={() => void requestCode()}
                            >
                                {cooldown ? `Gửi lại sau ${cooldown}s` : "Gửi lại mã"}
                            </Button>
                        )}
                        {step !== "email" && (
                            <Button type="button" onClick={startOver} disabled={busy}>
                                Bắt đầu lại
                            </Button>
                        )}
                        <Button component={Link} href="/login">
                            Quay lại đăng nhập
                        </Button>
                    </>
                )}
            </Stack>
        </AuthShell>
    );
}
