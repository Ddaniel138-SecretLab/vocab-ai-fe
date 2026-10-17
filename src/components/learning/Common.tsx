import type { ReactNode } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        justifyContent: "space-between",
        alignItems: { sm: "center" },
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {title}
        </Typography>
        {subtitle && <Typography color="text.secondary">{subtitle}</Typography>}
      </Box>
      {action}
    </Stack>
  );
}
export function QueryState({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: string;
  retry: () => void;
}) {
  if (loading)
    return (
      <Box sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress aria-label="Đang tải dữ liệu" />
      </Box>
    );
  if (error)
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={retry}>
            Thử lại
          </Button>
        }
      >
        {error}
      </Alert>
    );
  return null;
}
export function Pager({
  total,
  page,
  limit,
  onChange,
}: {
  total: number;
  page: number;
  limit: number;
  onChange: (page: number) => void;
}) {
  return total > limit ? (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
      <Pagination
        count={Math.ceil(total / limit)}
        page={page}
        onChange={(_, n) => onChange(n)}
        size="small"
        color="primary"
      />
    </Box>
  ) : null;
}
export function EmptyState({
  text,
  href,
  label,
}: {
  text: string;
  href?: string;
  label?: string;
}) {
  return (
    <Alert severity="info">
      {text}
      {href && (
        <Button component={Link} href={href}>
          {label || "Khám phá chủ đề"}
        </Button>
      )}
    </Alert>
  );
}
export const dateTime = (
  value: string | null | undefined,
  timeZone = "Asia/Ho_Chi_Minh",
) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        timeZone,
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(value))
    : "Chưa có";
export const sessionLabel = (type: string) =>
  type === "QUIZ" ? "Trắc nghiệm" : "Flashcard";
export const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 2,
};
