import { Avatar, Chip, Divider } from "@mui/material";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import SaveRounded from "@mui/icons-material/SaveRounded";
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
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          borderRadius: 5,
          background: "linear-gradient(120deg,#EDE5FF,#F4F0FF 60%,#EAF6F2)",
          border: "1px solid #E3D9F5",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2.5}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Avatar
            sx={{
              width: 76,
              height: 76,
              bgcolor: "#7653CB",
              fontSize: 30,
              fontWeight: 700,
              border: "5px solid white",
              boxShadow: "0 6px 20px #6A4BFF15",
            }}
          >
            {(form.displayName || user?.email || "B")[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: "primary.dark",
                mb: 1,
              }}
            >
              KHÔNG GIAN CỦA RIÊNG BẠN
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 26, sm: 30 },
                fontWeight: 700,
                letterSpacing: -0.8,
              }}
            >
              Hồ sơ học tập
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                mt: 1,
                lineHeight: 1.8,
              }}
            >
              {isProfileComplete
                ? "Cập nhật thông tin để nội dung học phù hợp hơn."
                : "Hoàn thiện 4 thông tin bắt buộc trước khi bắt đầu học."}
            </Typography>
          </Box>
          <Chip
            size="small"
            color={isProfileComplete ? "success" : "warning"}
            variant="outlined"
            label={isProfileComplete ? "Sẵn sàng học tập" : "Cần hoàn thiện"}
            sx={{
              alignSelf: { xs: "flex-start", sm: "center" },
              bgcolor: "white",
              fontSize: 11,
            }}
          />
        </Stack>
      </Paper>
      <Box component="form" onSubmit={submit}>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
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
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Đã lưu hồ sơ.
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
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              borderColor: "#E9E2F3",
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", mb: 2.5 }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "#F0EBFF",
                  color: "primary.main",
                  width: 38,
                  height: 38,
                  borderRadius: 2.5,
                }}
              >
                <PersonOutlineRounded />
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                  Thông tin cá nhân
                </Typography>
                <Typography
                  sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}
                >
                  Một chút về bạn, để học cùng nhau tốt hơn.
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Email"
                value={user?.email || ""}
                disabled
                helperText={
                  user?.emailVerifiedAt
                    ? "Email của bạn đã được xác minh."
                    : "Email chưa được xác minh."
                }
              />
              <TextField
                fullWidth
                required
                label="Tên hiển thị"
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 80 } }}
                disabled={busy}
              />
              <TextField
                fullWidth
                required
                label="Ngày sinh"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm({ ...form, dateOfBirth: e.target.value })
                }
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { max: new Date().toLocaleDateString("en-CA") },
                }}
                disabled={busy}
              />
              <TextField
                fullWidth
                required
                select
                label="Bậc học"
                value={form.schoolStage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    schoolStage: e.target.value as SchoolStage,
                  })
                }
                disabled={busy}
              >
                {Object.entries(schoolStages).map(([v, l]) => (
                  <MenuItem key={v} value={v}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                required
                select
                label="Trình độ tiếng Anh"
                value={form.englishLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    englishLevel: e.target.value as EnglishLevel,
                  })
                }
                disabled={busy}
              >
                {Object.entries(englishLevels).map(([v, l]) => (
                  <MenuItem key={v} value={v}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              borderColor: "#E9E2F3",
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", mb: 2.5 }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "#EAF6F0",
                  color: "#27836A",
                  width: 38,
                  height: 38,
                  borderRadius: 2.5,
                }}
              >
                <AutoAwesomeRounded />
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                  Cách bạn muốn học
                </Typography>
                <Typography
                  sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}
                >
                  Sở thích giúp gợi ý chủ đề gần gũi hơn.
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Sở thích"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                helperText="Ngăn cách bằng dấu phẩy. Tối đa 10 sở thích."
                disabled={busy}
              />
              <Box>
                <Typography
                  sx={{ fontSize: 11, color: "text.secondary", mb: 1 }}
                >
                  Gợi ý nhanh · chạm để thêm
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  {[
                    "Âm nhạc",
                    "Thể thao",
                    "Công nghệ",
                    "Du lịch",
                    "Phim ảnh",
                  ].map((tag) => (
                    <Chip
                      key={tag}
                      size="small"
                      label={tag}
                      disabled={busy}
                      onClick={() => {
                        const values = interests
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean);
                        if (
                          !values.some(
                            (v) => v.toLowerCase() === tag.toLowerCase(),
                          ) &&
                          values.length < 10
                        )
                          setInterests([...values, tag].join(", "));
                      }}
                      sx={{ bgcolor: "#F3EEFC", color: "primary.dark" }}
                    />
                  ))}
                </Stack>
              </Box>
              <TextField
                fullWidth
                label="Mục tiêu học tập"
                multiline
                minRows={4}
                placeholder="Ví dụ: Mỗi ngày học vài từ mới để tự tin hơn khi nói tiếng Anh."
                value={form.learningGoal}
                onChange={(e) =>
                  setForm({ ...form, learningGoal: e.target.value })
                }
                slotProps={{ htmlInput: { maxLength: 500 } }}
                helperText={`${form.learningGoal.length}/500 ký tự`}
                disabled={busy}
              />
              <Box sx={{ p: 2.5, bgcolor: "#F6F3FC", borderRadius: 3 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 1 }}>
                  Bắt đầu từ điều bạn yêu thích
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    lineHeight: 1.9,
                    color: "text.secondary",
                  }}
                >
                  Không cần học thật nhiều một lúc. Một chủ đề thú vị và vài từ
                  mới mỗi ngày cũng là một bước tiến.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 3, justifyContent: "flex-end" }}
        >
          {isProfileComplete && (
            <Button onClick={() => void router.push("/user/dashboard")}>
              Đến trang tổng quan →
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRounded />}
            disabled={busy || !loaded}
            sx={{ px: 3, py: 1.4, borderRadius: 3 }}
          >
            {busy ? "Đang lưu…" : "Lưu hồ sơ"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
