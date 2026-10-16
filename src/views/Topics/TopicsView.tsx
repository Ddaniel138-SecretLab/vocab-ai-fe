import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useApiQuery } from "@/hooks/useApiQuery";
import { queryString } from "@/services/learning-api";
import { englishLevels, schoolStages } from "@/types/auth";
import type { PageResult, Topic, Recommendation } from "@/types/learning";
import {
  cardGrid,
  EmptyState,
  PageTitle,
  Pager,
  QueryState,
} from "@/components/learning/Common";
import TopicCard from "@/components/learning/TopicCard";
export default function TopicsView() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);
  const list = useApiQuery<PageResult<Topic>>(
    "/topics" +
      queryString({ q: search, level, schoolStage: stage, page, limit: 12 }),
  );
  const recommended = useApiQuery<Recommendation>("/topics/recommended");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearch(q.trim());
    setPage(1);
  }
  return (
    <>
      <PageTitle
        title="Chủ đề từ vựng"
        subtitle="Học theo chủ đề và trình độ của bạn, mỗi lần một chút."
      />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Gợi ý cho bạn
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Dựa trên bậc học, trình độ và sở thích trong hồ sơ.
        </Typography>
        <QueryState {...recommended} retry={recommended.reload} />
        {recommended.data &&
          (recommended.data.items.length ? (
            <Box sx={cardGrid}>
              {recommended.data.items.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </Box>
          ) : (
            <EmptyState text="Chưa có chủ đề phù hợp với hồ sơ hiện tại. Bạn có thể đổi bộ lọc bên dưới." />
          ))}
      </Box>
      <Paper
        component="form"
        onSubmit={submit}
        variant="outlined"
        sx={{ p: 2, mb: 3 }}
      >
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          sx={{ flexWrap: "wrap" }}
        >
          <TextField
            label="Tìm chủ đề"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 150 }}
          />
          <TextField
            select
            size="small"
            label="Trình độ"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="">Theo hồ sơ</MenuItem>
            {Object.entries(englishLevels).map(([v, l]) => (
              <MenuItem key={v} value={v}>
                {l}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Bậc học"
            value={stage}
            onChange={(e) => {
              setStage(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Theo hồ sơ</MenuItem>
            {Object.entries(schoolStages).map(([v, l]) => (
              <MenuItem key={v} value={v}>
                {l}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" type="submit">
            Tìm kiếm
          </Button>
        </Stack>
      </Paper>
      <QueryState {...list} retry={list.reload} />
      {list.data && (
        <>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {list.data.total} chủ đề
          </Typography>
          {list.data.items.length ? (
            <Box sx={cardGrid}>
              {list.data.items.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </Box>
          ) : (
            <EmptyState text="Không tìm thấy chủ đề. Thử đổi từ khóa hoặc trình độ." />
          )}
          <Pager {...list.data} onChange={setPage} />
        </>
      )}
    </>
  );
}
