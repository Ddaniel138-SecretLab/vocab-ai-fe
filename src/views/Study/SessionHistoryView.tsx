import { useState } from "react";
import Link from "next/link";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { useApiQuery } from "@/hooks/useApiQuery";
import { queryString } from "@/services/learning-api";
import type { PageResult, SessionSummary } from "@/types/learning";
import {
  EmptyState,
  PageTitle,
  Pager,
  QueryState,
} from "@/components/learning/Common";
import SessionList from "@/components/learning/SessionList";
export default function SessionHistoryView() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const query = useApiQuery<PageResult<SessionSummary>>(
    "/study/sessions" + queryString({ page, limit: 10, status, type }),
  );
  return (
    <>
      <PageTitle
        title="Lịch sử học tập"
        subtitle="Tiếp tục bài chưa hoàn thành hoặc xem lại kết quả."
        action={
          <Button component={Link} href="/user/vocabulary" variant="contained">
            Chọn chủ đề học
          </Button>
        }
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          size="small"
          label="Trạng thái"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="IN_PROGRESS">Đang học</MenuItem>
          <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Loại bài"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="FLASHCARD">Flashcard</MenuItem>
          <MenuItem value="QUIZ">Trắc nghiệm</MenuItem>
        </TextField>
      </Stack>
      <QueryState {...query} retry={query.reload} />
      {query.data && (
        <>
          {query.data.items.length ? (
            <SessionList sessions={query.data.items} />
          ) : (
            <EmptyState
              text="Chưa có phiên học theo bộ lọc này."
              href="/user/vocabulary"
            />
          )}
          <Pager {...query.data} onChange={setPage} />
        </>
      )}
    </>
  );
}
