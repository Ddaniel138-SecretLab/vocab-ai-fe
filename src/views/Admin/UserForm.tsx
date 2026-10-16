import { useRef, useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi } from "@/services/admin-api";
import { errorMessage } from "@/lib/api-client";
import type { AdminUser, AdminUserInput } from "@/types/admin";
import {
  englishLevels,
  schoolStages,
  type ProfileInput,
  type UserRole,
} from "@/types/auth";
export default function UserForm({
  user,
  onSaved,
}: {
  user?: AdminUser;
  onSaved: (user: AdminUser) => void;
}) {
  const auth = useAuth(),
    self = user?.id === auth.user?.id;
  const [email, setEmail] = useState(user?.email || ""),
    [password, setPassword] = useState(""),
    [role, setRole] = useState<UserRole>(user?.role || "USER"),
    [active, setActive] = useState(user?.isActive ?? true),
    [verified, setVerified] = useState(!!user?.emailVerifiedAt);
  const initial = {
    displayName: user?.profile?.displayName || "",
    dateOfBirth: user?.profile?.dateOfBirth?.slice(0, 10) || "",
    schoolStage: user?.profile?.schoolStage || "",
    englishLevel: user?.profile?.englishLevel || "",
    interests: user?.profile?.interests.join(", ") || "",
    learningGoal: user?.profile?.learningGoal || "",
  };
  const [profile, setProfile] = useState(initial),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const lock = useRef(false);
  const change = (key: keyof typeof profile, value: string) =>
    setProfile((p) => ({ ...p, [key]: value }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    setError("");
    try {
      const input: AdminUserInput = {};
      const normalized = email.trim().toLowerCase();
      if (!user) {
        if (
          password.length < 8 ||
          new TextEncoder().encode(password).length > 72
        )
          throw new Error(
            "Mật khẩu cần ít nhất 8 ký tự và tối đa 72 byte UTF-8.",
          );
        Object.assign(input, {
          email: normalized,
          password,
          role,
          emailVerified: verified,
        });
      } else {
        if (normalized !== user.email) input.email = normalized;
        if (role !== user.role) input.role = role;
        if (active !== user.isActive) input.isActive = active;
        if (verified !== !!user.emailVerifiedAt || (input.email && verified))
          input.emailVerified = verified;
      }
      const p: Partial<ProfileInput> = {};
      for (const key of [
        "displayName",
        "dateOfBirth",
        "schoolStage",
        "englishLevel",
        "learningGoal",
      ] as const) {
        const v = profile[key].trim();
        if (v === initial[key] && user) continue;
        if (!v && key !== "learningGoal") {
          if (initial[key])
            throw new Error(
              "Không thể xóa trắng tên, ngày sinh, bậc học hoặc trình độ đã có.",
            );
          continue;
        }
        Object.assign(p, { [key]: v });
      }
      const interests = [
        ...new Set(
          profile.interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      ];
      if (interests.length > 10 || interests.some((s) => s.length > 50))
        throw new Error("Tối đa 10 sở thích, mỗi sở thích tối đa 50 ký tự.");
      if (
        !user ||
        JSON.stringify(interests) !==
          JSON.stringify(user.profile?.interests || [])
      )
        p.interests = interests;
      if (Object.keys(p).length) input.profile = p;
      if (user && !Object.keys(input).length) {
        setError("Chưa có thay đổi để lưu.");
        return;
      }
      lock.current = true;
      setBusy(true);
      const result = user
        ? await adminApi.update(user.id, input)
        : await adminApi.create(input);
      setPassword("");
      if (self) await auth.refresh();
      onSaved(result.user);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Paper
      component="form"
      onSubmit={submit}
      variant="outlined"
      sx={{ p: { xs: 2, sm: 3 } }}
    >
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          required
          type="email"
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setVerified(false);
          }}
          disabled={busy || self}
          autoComplete="off"
        />
        {!user && (
          <TextField
            required
            type="password"
            label="Mật khẩu ban đầu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            disabled={busy}
          />
        )}
        <TextField
          select
          label="Vai trò"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          disabled={busy || self}
        >
          <MenuItem value="USER">Học viên</MenuItem>
          <MenuItem value="ADMIN">Quản trị viên</MenuItem>
        </TextField>
        {user && (
          <FormControlLabel
            control={
              <Checkbox
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                disabled={busy || self}
              />
            }
            label="Cho phép tài khoản hoạt động"
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              disabled={busy || self}
            />
          }
          label="Xác nhận email đã được kiểm chứng"
        />
        <Alert severity="info">
          Tài khoản chưa xác minh không thể đăng nhập. Thay đổi email, vai trò
          hoặc trạng thái xác minh/hoạt động sẽ kết thúc các phiên đăng nhập cũ.
          Việc tạo tài khoản không tự gửi email mời.
        </Alert>
        {self && (
          <Typography variant="body2">
            Bạn chỉ có thể sửa hồ sơ của mình tại đây; các trường bảo mật bị
            khóa.
          </Typography>
        )}
        <Typography variant="h6">Hồ sơ (không bắt buộc)</Typography>
        <TextField
          label="Tên hiển thị"
          value={profile.displayName}
          onChange={(e) => change("displayName", e.target.value)}
          slotProps={{ htmlInput: { maxLength: 80 } }}
          disabled={busy}
        />
        <TextField
          type="date"
          label="Ngày sinh"
          value={profile.dateOfBirth}
          onChange={(e) => change("dateOfBirth", e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { max: new Date().toISOString().slice(0, 10) },
          }}
          disabled={busy}
        />
        {(["schoolStage", "englishLevel"] as const).map((key) => (
          <TextField
            select
            key={key}
            label={key === "schoolStage" ? "Bậc học" : "Trình độ"}
            value={profile[key]}
            onChange={(e) => change(key, e.target.value)}
            disabled={busy}
          >
            <MenuItem value="">Chưa chọn</MenuItem>
            {Object.entries(
              key === "schoolStage" ? schoolStages : englishLevels,
            ).map(([v, l]) => (
              <MenuItem key={v} value={v}>
                {l}
              </MenuItem>
            ))}
          </TextField>
        ))}
        <TextField
          label="Sở thích, ngăn cách bằng dấu phẩy"
          value={profile.interests}
          onChange={(e) => change("interests", e.target.value)}
          disabled={busy}
        />
        <TextField
          label="Mục tiêu học tập"
          multiline
          value={profile.learningGoal}
          onChange={(e) => change("learningGoal", e.target.value)}
          slotProps={{ htmlInput: { maxLength: 500 } }}
          disabled={busy}
        />
        <Button type="submit" variant="contained" disabled={busy}>
          {busy ? "Đang lưu…" : user ? "Lưu thay đổi" : "Tạo tài khoản"}
        </Button>
      </Stack>
    </Paper>
  );
}
