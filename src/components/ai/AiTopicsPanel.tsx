import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
  async function generate() {
    if (lock.current) return;
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
    <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Khám phá chủ đề mới bằng AI</Typography>
        <Typography variant="body2">
          AI tạo chủ đề dựa trên hồ sơ của bạn. Tối đa 3 chủ đề/người/ngày. Chủ
          đề được dùng chung; sau đó bạn có thể tạo từ trong từng chủ đề.
        </Typography>
        <QueryState {...quota} retry={quota.reload} />
        <QueryState {...ai} retry={ai.reload} />
        {quota.data && (
          <Typography variant="body2">
            Hôm nay: đã tạo {quota.data.used}, đang xử lý {quota.data.reserved},
            còn {quota.data.remaining}/{quota.data.limit}. Ngày{" "}
            {quota.data.dateKey} ({quota.data.timeZone}).
          </Typography>
        )}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Số chủ đề AI"
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 1, max: 3 } }}
            disabled={busy}
            size="small"
          />
          <Button
            variant="contained"
            onClick={() => void generate()}
            disabled={
              busy ||
              !ai.data?.enabled ||
              !ai.data.configured ||
              !quota.data ||
              !Number.isInteger(count) ||
              count < 1 ||
              count > 3 ||
              count > quota.data.remaining
            }
          >
            {busy ? "AI đang tạo chủ đề…" : "AI gợi ý chủ đề mới"}
          </Button>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        {topics.length > 0 && (
          <>
            <Alert severity="success">
              Đã lưu {topics.length} chủ đề. Mở chủ đề để tạo từ vựng.
            </Alert>
            <Box sx={cardGrid}>
              {topics.map((t) => (
                <TopicCard key={t.id} topic={t} />
              ))}
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}
