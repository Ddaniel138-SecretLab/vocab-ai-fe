import Link from "next/link";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { AdminDashboard } from "@/types/admin";
import {
  PageTitle,
  QueryState,
  cardGrid,
  dateTime,
} from "@/components/learning/Common";
const labels: Record<string, string> = {
  users: "Tổng tài khoản",
  activeUsers: "Tài khoản hoạt động",
  inactiveUsers: "Tài khoản bị khóa",
  archivedUsers: "Tài khoản đã lưu trữ",
  activeAdmins: "Quản trị viên hoạt động",
  verifiedUsers: "Đã xác minh email",
  loggedInLast24Hours: "Đăng nhập trong 24 giờ",
  usersCompletedStudyToday: "Người hoàn thành bài hôm nay",
  topics: "Chủ đề",
  vocabulary: "Từ vựng",
  completedSessions: "Phiên đã hoàn thành",
  pendingSessions: "Phiên chưa hoàn thành",
};
export default function DashboardView() {
  const query = useApiQuery<AdminDashboard>("/admin/dashboard");
  const d = query.data;
  return (
    <>
      <PageTitle
        title="Tổng quan quản trị"
        subtitle="Số liệu được lấy từ backend."
      />
      <QueryState {...query} retry={query.reload} />
      {d && (
        <Stack spacing={3}>
          <Typography variant="body2">
            Ngày {d.dateKey} · {d.timeZone}
          </Typography>
          <Box sx={cardGrid}>
            {Object.entries(d.statistics).map(([k, v]) => (
              <Paper variant="outlined" sx={{ p: 3 }} key={k}>
                <Typography color="text.secondary">{labels[k] || k}</Typography>
                <Typography variant="h4">{v}</Typography>
              </Paper>
            ))}
          </Box>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6">
              Ngân sách yêu cầu AI của ứng dụng
            </Typography>
            <Typography>
              Đã dùng: {d.applicationAiRequests.used ?? "Chưa có dữ liệu"} · Còn
              lại: {d.applicationAiRequests.remaining ?? "Chưa có dữ liệu"} ·
              Giới hạn: {d.applicationAiRequests.limit} yêu cầu
            </Typography>
            <Alert severity="info" sx={{ my: 2 }}>
              Đây là bộ đếm yêu cầu của ứng dụng. Hạn mức Cloudflare tính bằng
              Neurons; API hiện không lấy số dư trực tiếp.
            </Alert>
            <Button
              component="a"
              href={d.cloudflare.dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem mức sử dụng Cloudflare
            </Button>
            <Button
              component="a"
              href={d.cloudflare.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cách tính hạn mức
            </Button>
          </Paper>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6">Tài khoản mới</Typography>
            {d.recentUsers.map((u) => (
              <Stack
                key={u.id}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ py: 1, overflowWrap: "anywhere" }}
              >
                <Button component={Link} href={`/admin/users/${u.id}`}>
                  {u.email}
                </Button>
                <Typography>
                  {u.role} · {dateTime(u.createdAt)}
                </Typography>
              </Stack>
            ))}
          </Paper>
        </Stack>
      )}
    </>
  );
}
