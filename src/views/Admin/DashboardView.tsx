import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PeopleAltRounded from "@mui/icons-material/PeopleAltRounded";
import TaskAltRounded from "@mui/icons-material/TaskAltRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import PersonAddRounded from "@mui/icons-material/PersonAddRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { AdminDashboard } from "@/types/admin";
import { PageTitle, QueryState, dateTime } from "@/components/learning/Common";
import {
  adminPanelSx,
  adminTableSx,
  MetricTile,
  RoleBadge,
} from "@/components/admin/AdminUi";
export default function DashboardView() {
  const query = useApiQuery<AdminDashboard>("/admin/dashboard"),
    d = query.data;
  const count = (key: string) => d?.statistics[key] ?? "—";
  return (
    <>
      <PageTitle
        title="Tổng quan quản trị"
        subtitle="Nắm nhanh hoạt động học tập và tình trạng tài khoản."
        action={
          <Stack direction="row" spacing={1}>
            <Button
              aria-label="Làm mới tổng quan"
              onClick={query.reload}
              disabled={query.loading}
              variant="outlined"
              startIcon={<RefreshRounded />}
            >
              Làm mới
            </Button>
            <Button
              component={Link}
              href="/admin/users/new"
              variant="contained"
              startIcon={<PersonAddRounded />}
            >
              Tạo tài khoản
            </Button>
          </Stack>
        }
      />
      <QueryState {...query} retry={query.reload} />
      {d && (
        <Stack spacing={3}>
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
            Số liệu ngày {d.dateKey.split("-").reverse().join("/")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2,minmax(0,1fr))",
                lg: "repeat(4,minmax(0,1fr))",
              },
              gap: 2,
            }}
          >
            {[
              {
                label: "Tổng tài khoản",
                value: count("users"),
                icon: <PeopleAltRounded />,
                color: "#7153B3",
                bg: "#F1ECFC",
                helper: "Tài khoản chưa lưu trữ",
              },
              {
                label: "Tài khoản hoạt động",
                value: count("activeUsers"),
                icon: <TaskAltRounded />,
                color: "#2B8A6D",
                bg: "#EAF7F0",
                helper: "Đang được phép hoạt động",
              },
              {
                label: "Phiên đã hoàn thành",
                value: count("completedSessions"),
                icon: <SchoolRounded />,
                color: "#B58132",
                bg: "#FFF5E4",
                helper: "Tổng phiên học đã nộp",
              },
              {
                label: "Từ vựng",
                value: count("vocabulary"),
                icon: <AutoStoriesRounded />,
                color: "#4D83B2",
                bg: "#ECF4FC",
                helper: "Trong danh mục học tập",
              },
            ].map((s) => (
              <MetricTile key={s.label} {...s} />
            ))}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(min(100%,300px),1fr))",
              gap: 3,
            }}
          >
            <Paper variant="outlined" sx={{ ...adminPanelSx, p: 3 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2 }}>
                Tình trạng tài khoản
              </Typography>
              {[
                ["inactiveUsers", "Tài khoản bị khóa"],
                ["archivedUsers", "Đã lưu trữ"],
                ["verifiedUsers", "Email đã xác minh"],
                ["activeAdmins", "Quản trị viên hoạt động"],
              ].map(([k, l]) => (
                <Stack
                  key={k}
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    gap: 2,
                    py: 1.3,
                    borderBottom: "1px solid #F0F1F6",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {l}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                    {count(k)}
                  </Typography>
                </Stack>
              ))}
              <Button
                component={Link}
                href="/admin/users"
                endIcon={<ArrowOutwardRounded />}
                sx={{ mt: 2, fontSize: 12, p: 0 }}
              >
                Quản lý người dùng
              </Button>
            </Paper>
            <Paper variant="outlined" sx={{ ...adminPanelSx, p: 3 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 2 }}>
                Hoạt động & nội dung
              </Typography>
              {[
                ["loggedInLast24Hours", "Đăng nhập trong 24 giờ"],
                ["usersCompletedStudyToday", "Người hoàn thành bài hôm nay"],
                ["topics", "Chủ đề học tập"],
                ["pendingSessions", "Phiên chưa hoàn thành"],
              ].map(([k, l]) => (
                <Stack
                  key={k}
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    gap: 2,
                    py: 1.3,
                    borderBottom: "1px solid #F0F1F6",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {l}
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                    {count(k)}
                  </Typography>
                </Stack>
              ))}
              <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 2 }}>
                Lượt đăng nhập không phản ánh số người đang online.
              </Typography>
            </Paper>
          </Box>
          <Paper variant="outlined" sx={{ ...adminPanelSx, p: 3 }}>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", mb: 2.5 }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "#F0EAFB",
                  color: "primary.main",
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                }}
              >
                <AutoAwesomeRounded />
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                  Ngân sách yêu cầu AI
                </Typography>
                <Typography
                  sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}
                >
                  Bộ đếm của ứng dụng trong ngày
                </Typography>
              </Box>
            </Stack>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(0,1fr) minmax(0,1fr)",
                },
                gap: 3,
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                    gap: 1.5,
                  }}
                >
                  {[
                    ["Đã dùng", d.applicationAiRequests.used],
                    ["Còn lại", d.applicationAiRequests.remaining],
                    ["Giới hạn", d.applicationAiRequests.limit],
                  ].map(([l, v]) => (
                    <Box
                      key={l}
                      sx={{ p: 1.5, bgcolor: "#F8F7FC", borderRadius: "12px" }}
                    >
                      <Typography
                        sx={{ fontSize: 10, color: "text.secondary", mb: 1 }}
                      >
                        {l}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: typeof v === "number" ? 26 : 11,
                          fontWeight: 700,
                          color:
                            typeof v === "number"
                              ? "text.primary"
                              : "text.secondary",
                        }}
                      >
                        {v ?? "Chưa có dữ liệu"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {d.applicationAiRequests.used !== null &&
                  d.applicationAiRequests.limit > 0 && (
                    <LinearProgress
                      aria-label="Ngân sách yêu cầu AI đã dùng"
                      variant="determinate"
                      value={Math.max(
                        0,
                        Math.min(
                          100,
                          (d.applicationAiRequests.used /
                            d.applicationAiRequests.limit) *
                            100,
                        ),
                      )}
                      sx={{ height: 6, borderRadius: 2, mt: 2 }}
                    />
                  )}
                <Typography
                  sx={{ fontSize: 10, color: "text.secondary", mt: 1.5 }}
                >
                  Đơn vị: yêu cầu API của ứng dụng.
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: "#FFF8EF",
                  border: "1px solid #F0E3D2",
                  borderRadius: "14px",
                }}
              >
                <Chip
                  label="CLOUDFLARE"
                  size="small"
                  sx={{
                    fontSize: 9,
                    bgcolor: "#FFEBD2",
                    color: "#A56720",
                    mb: 1,
                  }}
                />
                <Typography
                  sx={{ fontSize: 12, lineHeight: 1.9, color: "#8A7258" }}
                >
                  Cloudflare tính hạn mức bằng Neurons. Số dư chưa được lấy trực
                  tiếp; xem mức sử dụng thật trong dashboard dịch vụ.
                </Typography>
                <Stack
                  direction="row"
                  sx={{ flexWrap: "wrap", gap: 1, mt: 1.5 }}
                >
                  <Button
                    component="a"
                    href={d.cloudflare.dashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<ArrowOutwardRounded />}
                    sx={{ fontSize: 11, color: "#A06D31", p: 0 }}
                  >
                    Xem mức sử dụng Cloudflare
                  </Button>
                  <Button
                    component="a"
                    href={d.cloudflare.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontSize: 11, color: "#A06D31", p: 0 }}
                  >
                    Cách tính hạn mức
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Paper>
          <Paper
            variant="outlined"
            sx={{ ...adminPanelSx, overflow: "hidden" }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                p: 2.5,
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                Tài khoản mới
              </Typography>
              <Button component={Link} href="/admin/users" size="small">
                Xem tất cả
              </Button>
            </Stack>
            <TableContainer>
              <Table sx={{ ...adminTableSx, minWidth: 550 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Vai trò</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Chi tiết</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {d.recentUsers.map((u) => (
                    <TableRow hover key={u.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{u.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={u.role} />
                      </TableCell>
                      <TableCell>{dateTime(u.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          href={`/admin/users/${u.id}`}
                          size="small"
                        >
                          Xem tài khoản
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!d.recentUsers.length && (
              <Typography sx={{ p: 3, fontSize: 13, color: "text.secondary" }}>
                Chưa có tài khoản mới.
              </Typography>
            )}
          </Paper>
        </Stack>
      )}
    </>
  );
}
