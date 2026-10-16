import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useApiQuery } from "@/hooks/useApiQuery";
import { learningApi } from "@/services/learning-api";
import { errorMessage } from "@/lib/api-client";
import type { StudySession, Rating } from "@/types/learning";
import {
  dateTime,
  PageTitle,
  QueryState,
  sessionLabel,
} from "@/components/learning/Common";
import WordAudio from "@/components/learning/WordAudio";
export default function StudySessionView({ sessionId }: { sessionId: string }) {
  const query = useApiQuery<{ session: StudySession }>(
    `/study/sessions/${sessionId}`,
  );
  const [index, setIndex] = useState(0);
  const initial = useRef(false);
  const [flipped, setFlipped] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const session = query.data?.session;
  const item = session?.items[index];
  const completed = session?.status === "COMPLETED";
  useEffect(() => {
    if (!session || initial.current) return;
    initial.current = true;
    const first = session.items.findIndex((i) => !i.answeredAt);
    Promise.resolve().then(() => setIndex(first >= 0 ? first : 0));
  }, [session]);
  function navigate(n: number) {
    if (busy) return;
    setIndex(n);
    setSelected(null);
    setFlipped(false);
    setError("");
  }
  async function answer(value: Rating | number) {
    if (!session || !item || lock.current || completed) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await learningApi.answer(
        sessionId,
        item.id,
        session.type,
        typeof value === "number"
          ? { selectedIndex: value }
          : { rating: value },
      );
      query.setData((prev) => {
        if (!prev) return prev;
        const items = prev.session.items.map((entry) =>
          entry.id === item.id ? { ...entry, ...result } : entry,
        );
        return {
          session: {
            ...prev.session,
            items,
            answeredItems: items.filter((entry) => entry.answeredAt !== null)
              .length,
          },
        };
      });
      if (index < session.items.length - 1) {
        setIndex(index + 1);
        setFlipped(false);
        setSelected(null);
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function complete() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setConfirm(false);
    try {
      const result = await learningApi.complete(sessionId);
      query.setData(result);
      setSelected(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <Button component={Link} href="/user/sessions" sx={{ mb: 2 }}>
        ← Lịch sử học tập
      </Button>
      <QueryState {...query} retry={query.reload} />
      {session && (
        <>
          <PageTitle
            title={completed ? "Kết quả học tập" : sessionLabel(session.type)}
            subtitle={session.topic?.title || "Ôn tập nhiều chủ đề"}
          />
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={completed ? "Đã hoàn thành" : "Đang học"}
              color={completed ? "success" : "primary"}
            />
            {session.isReview && <Chip label="Phiên ôn tập" />}
          </Stack>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error} Nếu kết nối bị ngắt sau khi gửi, hãy tải lại phiên để kiểm
              tra dữ liệu đã lưu trước khi thao tác lại.
              <Button onClick={query.reload} disabled={busy}>
                Tải lại phiên
              </Button>
            </Alert>
          )}
          {completed ? (
            <>
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {session.type === "QUIZ"
                    ? `Điểm: ${session.score ?? "—"}/100`
                    : "Bạn đã hoàn thành phiên flashcard!"}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  {session.type === "QUIZ"
                    ? `Đúng ${session.correctCount ?? "—"}/${session.totalItems} câu`
                    : `${session.items.filter((i) => i.rating === "KNOWN").length} từ đã nhớ · ${session.items.filter((i) => i.rating === "AGAIN").length} từ cần ôn lại`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hoàn thành lúc {dateTime(session.completedAt)}. Tiến độ,
                  streak và lịch ôn được backend cập nhật.
                </Typography>
              </Paper>
              <Stack spacing={2}>
                {session.items.map((entry) => (
                  <Paper key={entry.id} variant="outlined" sx={{ p: 3 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", mb: 1 }}
                    >
                      <Typography variant="h6">{entry.word}</Typography>
                      <Chip
                        size="small"
                        color={
                          session.type === "QUIZ"
                            ? entry.isCorrect
                              ? "success"
                              : "error"
                            : entry.rating === "KNOWN"
                              ? "success"
                              : "warning"
                        }
                        label={
                          session.type === "QUIZ"
                            ? entry.isCorrect
                              ? "Đúng"
                              : "Chưa đúng"
                            : entry.rating === "KNOWN"
                              ? "Đã nhớ"
                              : "Cần ôn lại"
                        }
                      />
                    </Stack>
                    <Typography>{entry.meaning}</Typography>
                    {session.type === "QUIZ" && (
                      <>
                        <Typography variant="body2">
                          Bạn chọn:{" "}
                          {entry.options?.[entry.selectedIndex ?? -1] ?? "—"}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          Đáp án đúng:{" "}
                          {entry.options?.[entry.correctIndex ?? -1] ?? "—"}
                        </Typography>
                      </>
                    )}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {entry.exampleSentence}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {entry.exampleTranslation}
                    </Typography>
                    {session.type === "FLASHCARD" && <WordAudio {...entry} />}
                  </Paper>
                ))}
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 3, flexWrap: "wrap" }}
              >
                <Button
                  component={Link}
                  href="/user/dashboard"
                  variant="contained"
                >
                  Về tổng quan
                </Button>
                <Button component={Link} href="/user/reviews">
                  Xem lịch ôn
                </Button>
              </Stack>
            </>
          ) : item ? (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Đã lưu {session.answeredItems}/{session.totalItems} mục
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  session.totalItems
                    ? (session.answeredItems / session.totalItems) * 100
                    : 0
                }
                sx={{ mb: 3 }}
              />
              <Paper
                variant="outlined"
                sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", mb: 3 }}
              >
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Mục {index + 1}/{session.items.length}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, overflowWrap: "anywhere", mb: 2 }}
                >
                  {item.word}
                </Typography>
                {session.type === "FLASHCARD" ? (
                  <>
                    <Typography color="text.secondary">
                      {item.phonetic}
                    </Typography>
                    <WordAudio key={item.id} {...item} />
                    {flipped ? (
                      <Box sx={{ my: 3 }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                          {item.meaning}
                        </Typography>
                        <Typography>{item.exampleSentence}</Typography>
                        <Typography color="text.secondary">
                          {item.exampleTranslation}
                        </Typography>
                      </Box>
                    ) : (
                      <Button
                        onClick={() => setFlipped(true)}
                        sx={{ my: 3 }}
                        variant="outlined"
                      >
                        Lật thẻ xem nghĩa
                      </Button>
                    )}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{ justifyContent: "center" }}
                    >
                      <Button
                        variant={
                          item.rating === "AGAIN" ? "contained" : "outlined"
                        }
                        color="warning"
                        disabled={busy || !flipped}
                        onClick={() => void answer("AGAIN")}
                      >
                        Cần ôn lại
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={busy || !flipped}
                        onClick={() => void answer("KNOWN")}
                      >
                        Đã nhớ
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography sx={{ mb: 2 }}>
                      Chọn nghĩa đúng của từ này:
                    </Typography>
                    <RadioGroup
                      aria-label="Các đáp án"
                      value={selected ?? item.selectedIndex ?? ""}
                      onChange={(e) => setSelected(Number(e.target.value))}
                      sx={{ textAlign: "left" }}
                    >
                      {item.options?.map((option, n) => (
                        <FormControlLabel
                          key={n}
                          value={n}
                          control={<Radio />}
                          label={option}
                          disabled={busy}
                          sx={{
                            p: 1,
                            mb: 1,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                          }}
                        />
                      ))}
                    </RadioGroup>
                    <Button
                      variant="contained"
                      disabled={
                        busy ||
                        (selected === null && item.selectedIndex == null)
                      }
                      onClick={() =>
                        void answer(selected ?? item.selectedIndex!)
                      }
                      sx={{ mt: 2 }}
                    >
                      Lưu câu trả lời
                    </Button>
                  </>
                )}
                {item.answeredAt && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ display: "block", mt: 2 }}
                  >
                    Mục này đã được lưu. Bạn có thể thay đổi trước khi hoàn
                    thành phiên.
                  </Typography>
                )}
              </Paper>
              <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "space-between", mb: 2 }}
              >
                <Button
                  disabled={busy || index === 0}
                  onClick={() => navigate(index - 1)}
                >
                  ← Trước
                </Button>
                <Button
                  disabled={busy || index === session.items.length - 1}
                  onClick={() => navigate(index + 1)}
                >
                  Tiếp →
                </Button>
              </Stack>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}>
                {session.items.map((entry, n) => (
                  <Button
                    size="small"
                    key={entry.id}
                    aria-label={`Đến mục ${n + 1}`}
                    variant={index === n ? "contained" : "outlined"}
                    color={entry.answeredAt ? "success" : "primary"}
                    disabled={busy}
                    onClick={() => navigate(n)}
                    sx={{ minWidth: 40 }}
                  >
                    {n + 1}
                  </Button>
                ))}
              </Stack>
              <Button
                fullWidth
                variant="contained"
                disabled={
                  busy || session.items.some((entry) => !entry.answeredAt)
                }
                onClick={() => setConfirm(true)}
              >
                Hoàn thành phiên học
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Bạn cần trả lời tất cả các mục trước khi hoàn thành. Bài chưa
                xong được lưu trong mục Lịch sử học tập.
              </Typography>
            </>
          ) : (
            <Alert severity="warning">Phiên này chưa có mục học tập.</Alert>
          )}
        </>
      )}
      <Dialog open={confirm} onClose={() => setConfirm(false)}>
        <DialogTitle>Hoàn thành phiên học?</DialogTitle>
        <DialogContent>
          Sau khi nộp, bạn sẽ xem kết quả và không thể sửa câu trả lời của phiên
          này.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>Quay lại</Button>
          <Button variant="contained" onClick={() => void complete()}>
            Xác nhận hoàn thành
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
