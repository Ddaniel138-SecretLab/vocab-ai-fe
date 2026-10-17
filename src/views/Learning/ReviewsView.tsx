import ExampleText from "@/components/learning/ExampleText";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useApiQuery } from "@/hooks/useApiQuery";
import { learningApi } from "@/services/learning-api";
import { errorMessage } from "@/lib/api-client";
import type { DueWord, PageResult, Streak } from "@/types/learning";
import {
  cardGrid,
  dateTime,
  EmptyState,
  PageTitle,
  Pager,
  QueryState,
} from "@/components/learning/Common";
import WordAudio from "@/components/learning/WordAudio";
export default function ReviewsView() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const due = useApiQuery<PageResult<DueWord>>(
    `/learning/reviews/due?page=${page}&limit=10`,
  );
  const streak = useApiQuery<Streak>("/learning/streak");
  async function create() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await learningApi.createReview();
      await router.push(`/user/study/${result.session.id}`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        title="Ôn tập & Streak"
        subtitle="Ôn những từ đến hạn từ nhiều chủ đề trong một phiên flashcard."
        action={
          <Button
            variant="contained"
            disabled={busy || !due.data?.total}
            onClick={() => void create()}
          >
            {busy ? "Đang tạo phiên…" : "Bắt đầu ôn tập"}
          </Button>
        }
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <QueryState {...streak} retry={streak.reload} />
      {streak.data && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                <LocalFireDepartmentRounded
                  color="warning"
                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                />{" "}
                {streak.data.currentStreak} ngày
              </Typography>
              <Typography>Streak hiện tại</Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {streak.data.longestStreak}
              </Typography>
              <Typography>Chuỗi dài nhất</Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {streak.data.totalStudyDays}
              </Typography>
              <Typography>Tổng ngày đã học</Typography>
            </Box>
          </Stack>
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            {streak.data.studiedToday
              ? "Đã học hôm nay."
              : "Chưa hoàn thành phiên nào hôm nay."}{" "}
            Streak chỉ tăng khi hoàn thành phiên học.
          </Typography>
        </Paper>
      )}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Từ đến hạn ôn {due.data ? `(${due.data.total})` : ""}
      </Typography>
      <QueryState {...due} retry={due.reload} />
      {due.data && (
        <>
          {due.data.items.length ? (
            <Box sx={cardGrid}>
              {due.data.items.map((entry) => (
                <Paper
                  key={entry.id}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    borderColor: "#E9E5F2",
                    minWidth: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "flex-end", mb: 2 }}
                  >
                    <Chip
                      size="small"
                      label={entry.vocabulary.topic.title}
                      sx={{
                        bgcolor: "#F0ECFF",
                        color: "primary.dark",
                        maxWidth: "100%",
                      }}
                    />
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {entry.vocabulary.word}
                  </Typography>
                  <Typography>{entry.vocabulary.meaning}</Typography>
                  <Box sx={{ my: 2 }}>
                    <ExampleText
                      sentence={entry.vocabulary.exampleSentence}
                      translation={entry.vocabulary.exampleTranslation}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {entry.nextReviewAt
                      ? `Đến hạn: ${dateTime(entry.nextReviewAt)}`
                      : "Chưa có lịch ôn trước đó; có thể ôn ngay."}
                  </Typography>
                  <WordAudio {...entry.vocabulary} />
                </Paper>
              ))}
            </Box>
          ) : (
            <EmptyState
              text="Chưa có từ đến hạn ôn. Học một chủ đề trước, rồi quay lại theo lịch ôn."
              href="/user/vocabulary"
            />
          )}
          <Pager {...due.data} onChange={setPage} />
        </>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Đã nhớ: lịch ôn lần lượt 1, 3, 7, 14 và 30 ngày. Cần ôn lại: khoảng 10
        phút. Số từ mỗi phiên được chọn trong Cài đặt học tập.
      </Typography>
    </>
  );
}
