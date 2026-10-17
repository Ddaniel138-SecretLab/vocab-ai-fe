import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useApiQuery } from "@/hooks/useApiQuery";
import { learningApi } from "@/services/learning-api";
import { errorMessage } from "@/lib/api-client";
import type {
  DailyQuota,
  Topic,
  Vocabulary,
  PageResult,
  AiStatus,
  GeneratedResult,
  SessionType,
} from "@/types/learning";
import { englishLevels } from "@/types/auth";
import {
  cardGrid,
  EmptyState,
  PageTitle,
  Pager,
  QueryState,
} from "@/components/learning/Common";
import VocabularyItem from "@/components/learning/VocabularyItem";
export default function TopicDetailView({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(4);
  const [busy, setBusy] = useState("");
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [batch, setBatch] = useState<GeneratedResult | null>(null);
  const topic = useApiQuery<{ topic: Topic }>(`/topics/${topicId}`);
  const words = useApiQuery<PageResult<Vocabulary>>(
    `/topics/${topicId}/vocabulary?page=${page}&limit=12`,
  );
  const ai = useApiQuery<AiStatus>("/ai/status");
  const quota = useApiQuery<DailyQuota>(
    `/ai/topics/${topicId}/vocabulary/quota`,
  );
  async function action(name: string, run: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(name);
    setError("");
    setNotice("");
    try {
      await run();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy("");
      if (name === "ai") quota.reload();
    }
  }
  const start = (type: SessionType) =>
    action(type, async () => {
      const result = await learningApi.createSession(topicId, type, size);
      await router.push(`/user/study/${result.session.id}`);
    });
  const refreshWords = () => {
    words.reload();
    topic.reload();
  };
  return (
    <>
      <Button component={Link} href="/user/vocabulary" sx={{ mb: 2 }}>
        ← Các chủ đề
      </Button>
      <QueryState {...topic} retry={topic.reload} />
      {topic.data && (
        <>
          <PageTitle
            title={topic.data.topic.title}
            subtitle={
              topic.data.topic.description || topic.data.topic.englishTitle
            }
          />
          <Chip
            color="primary"
            label={englishLevels[topic.data.topic.level]}
            sx={{ mb: 3 }}
          />
          <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Bắt đầu học
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { sm: "center" }, flexWrap: "wrap" }}
            >
              <TextField
                label="Số từ mỗi phiên"
                type="number"
                size="small"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1, max: 20 } }}
                sx={{ width: { sm: 160 } }}
                disabled={!!busy}
              />
              <Button
                variant="contained"
                disabled={
                  !!busy ||
                  !Number.isInteger(size) ||
                  size < 1 ||
                  size > 20 ||
                  topic.data.topic._count.vocabulary === 0
                }
                onClick={() => void start("FLASHCARD")}
              >
                {busy === "FLASHCARD" ? "Đang tạo…" : "Học Flashcard"}
              </Button>
              <Button
                variant="outlined"
                disabled={
                  !!busy ||
                  !Number.isInteger(size) ||
                  size < 1 ||
                  size > 20 ||
                  topic.data.topic._count.vocabulary < 4
                }
                onClick={() => void start("QUIZ")}
              >
                {busy === "QUIZ" ? "Đang tạo…" : "Làm trắc nghiệm"}
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Tối đa 20 từ; số mục thực tế phụ thuộc chủ đề. Trắc nghiệm cần ít
              nhất 4 nghĩa khác nhau.
            </Typography>
            <Divider sx={{ my: 2.5 }} />
            <Stack
              spacing={2}
              direction={{ xs: "column", sm: "row" }}
              sx={{ alignItems: { sm: "center" }, flexWrap: "wrap" }}
            >
              <TextField
                type="number"
                label="Số từ AI"
                slotProps={{ htmlInput: { min: 1, max: 20 } }}
                size="small"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                sx={{ minWidth: 110 }}
                disabled={!!busy}
              />
              <Button
                disabled={
                  !!busy ||
                  !ai.data?.enabled ||
                  !ai.data?.configured ||
                  !quota.data ||
                  !Number.isInteger(count) ||
                  count < 1 ||
                  count > 20 ||
                  count > quota.data.remaining
                }
                onClick={() =>
                  void action("ai", async () => {
                    const result = await learningApi.generate(topicId, count);
                    setBatch(result);
                    setNotice(
                      result.cached
                        ? "Đang hiển thị bộ từ đã tạo gần đây, không tạo thêm bản trùng."
                        : result.message ||
                            `Đã tạo và lưu ${result.words.length} từ mới.`,
                    );
                    refreshWords();
                  })
                }
              >
                {busy === "ai" ? "AI đang tạo từ…" : "Tạo thêm từ bằng AI"}
              </Button>
              <Button
                disabled={!!busy}
                onClick={() =>
                  void action("audio", async () => {
                    const result = await learningApi.resolveAudio(topicId);
                    setNotice(
                      `Đã tìm được audio cho ${result.resolved} từ; ${result.missing} từ chưa có audio trong lượt này.`,
                    );
                    refreshWords();
                  })
                }
              >
                {busy === "audio"
                  ? "Đang tìm audio…"
                  : "Bổ sung audio còn thiếu"}
              </Button>
            </Stack>
            <QueryState {...quota} retry={quota.reload} />
            {quota.data && (
              <Box
                role="group"
                aria-label="Hạn mức từ vựng của bạn"
                sx={{ mt: 2.5, p: 2, bgcolor: "#F6F2FF", borderRadius: "14px" }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 1.5 }}>
                  Hạn mức của bạn trong chủ đề này hôm nay
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                  <Chip size="small" label={`Đã tạo: ${quota.data.used}`} />
                  <Chip
                    size="small"
                    label={`Đang xử lý: ${quota.data.reserved}`}
                  />
                  <Chip
                    data-testid="word-quota-remaining"
                    size="small"
                    color="success"
                    variant="outlined"
                    label={`Còn lại: ${quota.data.remaining}/${quota.data.limit}`}
                  />
                </Stack>
                <Typography
                  sx={{ fontSize: 10, color: "text.secondary", mt: 1.5 }}
                >
                  Tối đa 20 từ mới/người/chủ đề/ngày. Lượt tạo của người khác
                  không trừ hạn mức của bạn.
                </Typography>
              </Box>
            )}
            {ai.error ? (
              <Typography variant="caption" color="error">
                Chưa kiểm tra được AI: {ai.error}{" "}
                <Button size="small" onClick={ai.reload}>
                  Thử lại
                </Button>
              </Typography>
            ) : (
              ai.data &&
              (!ai.data.enabled || !ai.data.configured) && (
                <Typography variant="caption" color="text.secondary">
                  AI đang tắt hoặc chưa đủ cấu hình; bạn vẫn học được các từ đã
                  có.
                </Typography>
              )
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              Từ AI được lưu vào chủ đề dùng chung. Audio bổ sung tối đa 10 từ
              thiếu mỗi lượt. Nội dung AI có thể cần rà soát.
            </Typography>
          </Paper>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {notice && (
            <Alert
              severity={batch?.partial ? "info" : "success"}
              sx={{ mb: 2 }}
            >
              {notice}
            </Alert>
          )}
          {batch && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bộ từ AI vừa trả về
              </Typography>
              <Box sx={cardGrid}>
                {batch.words.map((word) => (
                  <VocabularyItem key={word.id} word={word} />
                ))}
              </Box>
            </Box>
          )}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Danh sách từ vựng {words.data ? `(${words.data.total})` : ""}
          </Typography>
          <QueryState {...words} retry={words.reload} />
          {words.data && (
            <>
              {words.data.items.length ? (
                <Box sx={cardGrid}>
                  {words.data.items.map((word) => (
                    <VocabularyItem key={word.id} word={word} />
                  ))}
                </Box>
              ) : (
                <EmptyState text="Chủ đề chưa có từ. Bạn có thể tạo từ bằng AI nếu đã được bật." />
              )}
              <Pager {...words.data} onChange={setPage} />
            </>
          )}
        </>
      )}
    </>
  );
}
