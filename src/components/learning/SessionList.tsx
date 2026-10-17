import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { SessionSummary } from "@/types/learning";
import { dateTime, sessionLabel } from "./Common";
export default function SessionList({
  sessions,
}: {
  sessions: SessionSummary[];
}) {
  return (
    <Stack spacing={2}>
      {sessions.map((s) => (
        <Paper key={s.id} variant="outlined" sx={{ p: 2.5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { sm: "center" },
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", mb: 1 }}
              >
                <Chip size="small" label={sessionLabel(s.type)} />
                {s.isReview && (
                  <Chip
                    size="small"
                    color="secondary"
                    label="Ôn nhiều chủ đề"
                  />
                )}
                <Chip
                  size="small"
                  color={s.status === "COMPLETED" ? "success" : "warning"}
                  label={
                    s.status === "COMPLETED" ? "Đã hoàn thành" : "Đang học"
                  }
                />
              </Stack>
              <Typography sx={{ fontWeight: 700 }}>
                {s.topic?.title || "Ôn tập nhiều chủ đề"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.answeredItems}/{s.totalItems} mục đã trả lời ·{" "}
                {dateTime(s.updatedAt)}
              </Typography>
              {s.status === "COMPLETED" && s.type === "QUIZ" && (
                <Typography variant="body2">
                  Điểm: {s.score ?? "—"}/100
                </Typography>
              )}
              <LinearProgress
                variant="determinate"
                value={
                  s.totalItems ? (s.answeredItems / s.totalItems) * 100 : 0
                }
                sx={{ mt: 1.5 }}
              />
            </Box>
            <Button
              component={Link}
              href={`/user/study/${s.id}`}
              variant="outlined"
            >
              {s.status === "COMPLETED" ? "Xem kết quả" : "Tiếp tục"}
            </Button>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
