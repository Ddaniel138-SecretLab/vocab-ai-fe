import { useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import { useApiQuery } from "@/hooks/useApiQuery";
import { learningApi } from "@/services/learning-api";
import { errorMessage } from "@/lib/api-client";
import type { DailyQuota, AiStatus, Topic } from "@/types/learning";
import TopicCard from "@/components/learning/TopicCard";
import { QueryState, cardGrid } from "@/components/learning/Common";
export default function AiTopicsPanel({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const quota = useApiQuery<DailyQuota>("/ai/topics/quota"),
    ai = useApiQuery<AiStatus>("/ai/status");
  const [count, setCount] = useState(1),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [topics, setTopics] = useState<Topic[]>([]);
  const lock = useRef(false);
  const ready = !!ai.data?.enabled && !!ai.data?.configured,
    valid =
      ready &&
      !!quota.data &&
      Number.isInteger(count) &&
      count >= 1 &&
      count <= 3 &&
      count <= quota.data.remaining;
  async function generate() {
    if (lock.current || !valid) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await learningApi.generateTopics(count);
      setTopics(
        result.topics.map((t) => ({ ...t, _count: { vocabulary: 0 } })),
      );
      onCreated();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      quota.reload();
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        mb: 4,
        borderRadius: 4,
        borderColor: "#DFD4F4",
        background: "linear-gradient(115deg,#F5F0FF 0%,#FFFFFF 80%)",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0,1.2fr) minmax(0,1fr)",
          },
          gap: 3.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center", mb: 2 }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 44,
                height: 44,
                bgcolor: "primary.main",
                borderRadius: 2.5,
              }}
            >
              <AutoAwesomeRounded />
            </Avatar>
            <Chip
              size="small"
              label="DÀNH RIÊNG CHO HÀNH TRÌNH CỦA BẠN"
              sx={{
                bgcolor: "#EAE1FF",
                color: "primary.dark",
                fontSize: 9,
                letterSpacing: 0.6,
                maxWidth: "100%",
                "& .MuiChip-label": { whiteSpace: "normal", py: 0.5 },
                height: "auto",
              }}
            />
          </Stack>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.4,
              fontSize: { xs: 20, sm: 23 },
            }}
          >
            Khám phá chủ đề mới bằng AI
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
              mt: 1.5,
              lineHeight: 1.9,
            }}
          >
            Thêm một chủ đề thú vị, bắt đầu một hành trình mới. AI gợi ý dựa
            trên hồ sơ học tập của bạn.
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 2.5 }}>
            {[
              { icon: <SchoolRounded />, label: "Đúng trình độ" },
              { icon: <FavoriteBorderRounded />, label: "Theo sở thích" },
              { icon: <AutoStoriesRounded />, label: "Tối đa 3 chủ đề/ngày" },
            ].map((i) => (
              <Chip
                key={i.label}
                size="small"
                icon={i.icon}
                label={i.label}
                sx={{
                  bgcolor: "white",
                  border: "1px solid #E7DEF4",
                  fontSize: 11,
                  "& .MuiChip-icon": { color: "primary.main", fontSize: 15 },
                }}
              />
            ))}
          </Stack>
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2.5,
              bgcolor: "#FFFFFF99",
              border: "1px dashed #D8CCEE",
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.5 }}>
              1. Tạo chủ đề → 2. Mở chủ đề → 3. Tạo từ vựng
            </Typography>
            <Typography
              sx={{ fontSize: 11, lineHeight: 1.8, color: "text.secondary" }}
            >
              Chủ đề được lưu vào danh mục dùng chung. Từ vựng chỉ được tạo khi
              bạn chọn trong từng chủ đề.
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            minWidth: 0,
            bgcolor: "white",
            border: "1px solid #EAE3F3",
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
              Hạn mức hôm nay
            </Typography>
            {quota.data && (
              <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                {quota.data.dateKey.split("-").reverse().join("/")}
              </Typography>
            )}
          </Stack>
          <QueryState {...quota} retry={quota.reload} />
          <QueryState {...ai} retry={ai.reload} />
          {quota.data && (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                  gap: 1,
                }}
              >
                {[
                  {
                    label: "Đã tạo",
                    value: quota.data.used,
                    color: "#7152B7",
                    bg: "#F4EEFF",
                  },
                  {
                    label: "Đang xử lý",
                    value: quota.data.reserved,
                    color: "#A4772D",
                    bg: "#FFF6E5",
                  },
                  {
                    label: "Còn lại",
                    value: `${quota.data.remaining}/${quota.data.limit}`,
                    color: "#278169",
                    bg: "#ECF7F2",
                  },
                ].map((s, i) => (
                  <Box
                    key={s.label}
                    sx={{
                      p: { xs: 1, sm: 1.5 },
                      textAlign: "center",
                      bgcolor: s.bg,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      data-testid={i === 2 ? "quota-remaining" : undefined}
                      sx={{
                        fontSize: { xs: 23, sm: 27 },
                        fontWeight: 700,
                        color: s.color,
                        lineHeight: 1.4,
                      }}
                    >
                      {s.value}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 10, color: "text.secondary", mt: 0.5 }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <LinearProgress
                aria-label="Hạn mức chủ đề đã dùng hoặc đang xử lý"
                variant="determinate"
                value={
                  quota.data.limit > 0
                    ? Math.max(
                        0,
                        Math.min(
                          100,
                          ((quota.data.used + quota.data.reserved) /
                            quota.data.limit) *
                            100,
                        ),
                      )
                    : 0
                }
                sx={{
                  my: 2,
                  height: 6,
                  borderRadius: 2,
                  bgcolor: "#F0EBF7",
                  "& .MuiLinearProgress-bar": { borderRadius: 2 },
                }}
              />
              {quota.data.remaining === 0 && (
                <Alert severity="info" sx={{ mb: 2, fontSize: 12 }}>
                  Hạn mức hôm nay đã được dùng hoặc đang xử lý. Bạn vẫn có thể
                  học các chủ đề đã có.
                </Alert>
              )}
            </>
          )}
          {ai.data && !ready && (
            <Alert severity="info" sx={{ mb: 2, fontSize: 12 }}>
              AI đang tắt hoặc chưa được cấu hình. Các chủ đề có sẵn vẫn học
              được bình thường.
            </Alert>
          )}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 2 }}
          >
            <TextField
              label="Số chủ đề AI"
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              slotProps={{ htmlInput: { min: 1, max: 3 } }}
              size="small"
              disabled={busy}
              sx={{ width: { xs: "100%", sm: 125 }, flexShrink: 0 }}
            />
            <Button
              variant="contained"
              endIcon={!busy && <ArrowForwardRounded />}
              onClick={() => void generate()}
              disabled={busy || !valid}
              sx={{ flex: 1, fontSize: 12, px: 2, py: 1.2, boxShadow: "none" }}
            >
              {busy ? "AI đang tạo chủ đề…" : "AI gợi ý chủ đề mới"}
            </Button>
          </Stack>
          <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 1.5 }}>
            Chọn 1–3 chủ đề trong hạn mức còn lại.
          </Typography>
        </Box>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2.5 }}>
          {error}
        </Alert>
      )}
      {topics.length > 0 && (
        <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #E5DDF2" }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Đã lưu {topics.length} chủ đề. Mở chủ đề để tạo từ vựng.
          </Alert>
          <Box sx={cardGrid}>
            {topics.map((t) => (
              <TopicCard key={t.id} topic={t} />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
