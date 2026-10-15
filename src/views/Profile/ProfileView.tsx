import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/services/auth-api";
import { errorMessage } from "@/lib/api-client";
import {
  englishLevels,
  schoolStages,
  type ProfileInput,
  type SchoolStage,
  type EnglishLevel,
} from "@/types/auth";
const empty: ProfileInput = {
  displayName: "",
  dateOfBirth: "",
  schoolStage: "MIDDLE_SCHOOL",
  englishLevel: "BEGINNER",
  interests: [],
  learningGoal: "",
};
export default function ProfileView() {
  const router = useRouter();
  const { user, saveProfile, isProfileComplete } = useAuth();
  const [form, setForm] = useState(empty);
  const [interests, setInterests] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    authApi
      .profile()
      .then(({ profile }) => {
        if (!active) return;
        if (profile) {
          setForm({
            displayName: profile.displayName || "",
            dateOfBirth: profile.dateOfBirth?.slice(0, 10) || "",
            schoolStage: profile.schoolStage || "MIDDLE_SCHOOL",
            englishLevel: profile.englishLevel || "BEGINNER",
            interests: profile.interests,
            learningGoal: profile.learningGoal || "",
          });
          setInterests(profile.interests.join(", "));
        }
        setError("");
        setLoaded(true);
        setLoading(false);
      })
      .catch((e) => {
        if (active) {
          setError(errorMessage(e));
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!loaded) return;
    setError("");
    setSuccess(false);
    const tags = [
      ...new Set(
        interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    ];
    if (tags.length > 10 || tags.some((s) => s.length > 50)) {
      setError("Tối đa 10 sở thích, mỗi sở thích tối đa 50 ký tự.");
      return;
    }
    if (!form.displayName.trim()) {
      setError("Vui lòng nhập tên hiển thị.");
      return;
    }
    setBusy(true);
    try {
      await saveProfile({
        ...form,
        displayName: form.displayName.trim(),
        interests: tags,
      });
      setSuccess(true);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <CircularProgress aria-label="Đang tải hồ sơ" />;
  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Hồ sơ học tập
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {isProfileComplete
          ? "Cập nhật thông tin để nội dung học phù hợp hơn."
          : "Hoàn thiện 4 thông tin bắt buộc trước khi bắt đầu học."}
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
        <Stack component="form" onSubmit={submit} spacing={2.5}>
          {error && (
            <Alert
              severity="error"
              action={
                <Button
                  onClick={() => {
                    setLoading(true);
                    setAttempt((n) => n + 1);
                  }}
                >
                  Tải lại
                </Button>
              }
            >
              {error}
            </Alert>
          )}
          {success && <Alert severity="success">Đã lưu hồ sơ.</Alert>}
          <TextField
            label="Email"
            value={user?.email || ""}
            disabled
            helperText="Email đã được xác minh khi đăng ký."
          />
          <TextField
            required
            label="Tên hiển thị"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            slotProps={{ htmlInput: { maxLength: 80 } }}
            disabled={busy}
          />
          <TextField
            required
            label="Ngày sinh"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: new Date().toLocaleDateString("en-CA") },
            }}
            disabled={busy}
          />
          <TextField
            select
            required
            label="Bậc học"
            value={form.schoolStage}
            onChange={(e) =>
              setForm({ ...form, schoolStage: e.target.value as SchoolStage })
            }
            disabled={busy}
          >
            {Object.entries(schoolStages).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            required
            label="Trình độ tiếng Anh"
            value={form.englishLevel}
            onChange={(e) =>
              setForm({ ...form, englishLevel: e.target.value as EnglishLevel })
            }
            disabled={busy}
          >
            {Object.entries(englishLevels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Sở thích"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            helperText="Ngăn cách bằng dấu phẩy. Ví dụ: âm nhạc, thể thao, công nghệ."
            disabled={busy}
          />
          <TextField
            label="Mục tiêu học tập"
            multiline
            minRows={3}
            value={form.learningGoal}
            onChange={(e) => setForm({ ...form, learningGoal: e.target.value })}
            slotProps={{ htmlInput: { maxLength: 500 } }}
            disabled={busy}
          />
          <Button type="submit" variant="contained" disabled={busy || !loaded}>
            {busy ? "Đang lưu…" : "Lưu hồ sơ"}
          </Button>
          {isProfileComplete && (
            <Button onClick={() => void router.push("/user/dashboard")}>
              Đến trang tổng quan →
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
