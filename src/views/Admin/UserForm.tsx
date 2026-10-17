import Link from "next/link";
import { Box, Divider } from "@mui/material";
import SaveRounded from "@mui/icons-material/SaveRounded";
import { adminPanelSx } from "@/components/admin/AdminUi";
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
    <Box component="form" onSubmit={submit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))",
          gap: 3,
        }}
      >
        <Paper
          variant="outlined"
          sx={{ ...adminPanelSx, p: { xs: 2.5, sm: 3 } }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: "primary.main",
              letterSpacing: 1.2,
              fontWeight: 700,
              mb: 1,
            }}
          >
            01 · TÀI KHOẢN
          </Typography>
          <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 1 }}>
            Truy cập & phân quyền
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              lineHeight: 1.8,
              mb: 2.5,
            }}
          >
            Kiểm soát thông tin đăng nhập và trạng thái tài khoản.
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={2.5}>
            <TextField
              fullWidth
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
                fullWidth
                required
                type="password"
                label="Mật khẩu ban đầu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={busy}
                helperText="Ít nhất 8 ký tự, tối đa 72 byte UTF-8."
              />
            )}
            <TextField
              fullWidth
              select
              label="Vai trò"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled={busy || self}
            >
              <MenuItem value="USER">Học viên</MenuItem>
              <MenuItem value="ADMIN">Quản trị viên</MenuItem>
            </TextField>
            <Box
              sx={{
                p: 2,
                bgcolor: "#F8F9FC",
                border: "1px solid #ECEEF4",
                borderRadius: "12px",
              }}
            >
              {user && (
                <FormControlLabel
                  sx={{ alignItems: "flex-start" }}
                  control={
                    <Checkbox
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      disabled={busy || self}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 12, pt: 1 }}>
                      Cho phép tài khoản hoạt động
                    </Typography>
                  }
                />
              )}
              <FormControlLabel
                sx={{ alignItems: "flex-start" }}
                control={
                  <Checkbox
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    disabled={busy || self}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 12, pt: 1 }}>
                    Xác nhận email đã được kiểm chứng
                  </Typography>
                }
              />
            </Box>
            <Alert severity="info" sx={{ fontSize: 11, lineHeight: 1.8 }}>
              Tài khoản chưa xác minh không thể đăng nhập. Thay đổi email, vai
              trò hoặc trạng thái bảo mật sẽ kết thúc các phiên cũ. Không tự gửi
              thư mời khi tạo tài khoản.
            </Alert>
            {self && (
              <Alert severity="warning" sx={{ fontSize: 11 }}>
                Bạn đang sửa chính mình. Chỉ hồ sơ được phép thay đổi tại đây.
              </Alert>
            )}
          </Stack>
        </Paper>
        <Paper
          variant="outlined"
          sx={{ ...adminPanelSx, p: { xs: 2.5, sm: 3 } }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: "#33846D",
              letterSpacing: 1.2,
              fontWeight: 700,
              mb: 1,
            }}
          >
            02 · HỒ SƠ HỌC TẬP
          </Typography>
          <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 1 }}>
            Thông tin người học
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              lineHeight: 1.8,
              mb: 2.5,
            }}
          >
            Không bắt buộc khi quản trị viên tạo tài khoản.
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Tên hiển thị"
              value={profile.displayName}
              onChange={(e) => change("displayName", e.target.value)}
              slotProps={{ htmlInput: { maxLength: 80 } }}
              disabled={busy}
            />
            <TextField
              fullWidth
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
                fullWidth
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
              fullWidth
              label="Sở thích, ngăn cách bằng dấu phẩy"
              value={profile.interests}
              onChange={(e) => change("interests", e.target.value)}
              disabled={busy}
              helperText="Tối đa 10 sở thích, mỗi mục tối đa 50 ký tự."
            />
            <TextField
              fullWidth
              label="Mục tiêu học tập"
              multiline
              minRows={3}
              value={profile.learningGoal}
              onChange={(e) => change("learningGoal", e.target.value)}
              slotProps={{ htmlInput: { maxLength: 500 } }}
              disabled={busy}
            />
          </Stack>
        </Paper>
      </Box>
      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={1.5}
        sx={{ mt: 3, justifyContent: "flex-end" }}
      >
        <Button component={Link} href="/admin/users" disabled={busy}>
          Về danh sách
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveRounded />}
          disabled={busy}
          sx={{ px: 3, py: 1.3, boxShadow: "none" }}
        >
          {busy ? "Đang lưu…" : user ? "Lưu thay đổi" : "Tạo tài khoản"}
        </Button>
      </Stack>
    </Box>
  );
}
