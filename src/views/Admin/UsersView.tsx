import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddRounded from "@mui/icons-material/PersonAddRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import RestartAltRounded from "@mui/icons-material/RestartAltRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import { useApiQuery } from "@/hooks/useApiQuery";
import { queryString } from "@/services/learning-api";
import type { AdminUser } from "@/types/admin";
import type { PageResult } from "@/types/learning";
import {
  PageTitle,
  QueryState,
  Pager,
  dateTime,
} from "@/components/learning/Common";
import {
  adminPanelSx,
  adminTableSx,
  RoleBadge,
  UserStatus,
} from "@/components/admin/AdminUi";
export default function UsersView() {
  const [q, setQ] = useState(""),
    [search, setSearch] = useState(""),
    [role, setRole] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1);
  const query = useApiQuery<PageResult<AdminUser>>(
    "/admin/users" + queryString({ q: search, role, status, page, limit: 20 }),
  );
  function submit(e: FormEvent) {
    e.preventDefault();
    setSearch(q.trim());
    setPage(1);
  }
  function reset() {
    setQ("");
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  }
  const filtered = !!(search || role || status);
  return (
    <>
      <PageTitle
        title="Quản lý người dùng"
        subtitle="Tìm tài khoản, xem tiến độ và điều chỉnh quyền truy cập."
        action={
          <Button
            component={Link}
            href="/admin/users/new"
            variant="contained"
            startIcon={<PersonAddRounded />}
          >
            Tạo tài khoản
          </Button>
        }
      />
      <Paper
        component="form"
        onSubmit={submit}
        variant="outlined"
        sx={{ ...adminPanelSx, p: 2.5, mb: 3 }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            Tìm & lọc tài khoản
          </Typography>
          <Button
            size="small"
            type="button"
            startIcon={<RestartAltRounded />}
            onClick={reset}
            disabled={!filtered && !q}
          >
            Xóa bộ lọc
          </Button>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,minmax(0,1fr))",
              lg: "minmax(200px,1.5fr) minmax(140px,1fr) minmax(160px,1fr) auto",
            },
            gap: 2,
          }}
        >
          <TextField
            label="Email hoặc tên"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            select
            label="Vai trò"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            size="small"
            fullWidth
          >
            {[
              ["", "Tất cả"],
              ["USER", "Học viên"],
              ["ADMIN", "Quản trị viên"],
            ].map(([v, l]) => (
              <MenuItem value={v} key={v}>
                {l}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Trạng thái"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            size="small"
            fullWidth
          >
            {[
              ["", "Chưa lưu trữ"],
              ["ACTIVE", "Hoạt động"],
              ["INACTIVE", "Bị khóa"],
              ["DELETED", "Đã lưu trữ"],
            ].map(([v, l]) => (
              <MenuItem key={v} value={v}>
                {l}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchRounded />}
            sx={{ boxShadow: "none" }}
          >
            Tìm kiếm
          </Button>
        </Box>
        {filtered && (
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 2 }}>
            {search && (
              <Chip
                size="small"
                label={`Từ khóa: ${search}`}
                onDelete={() => {
                  setSearch("");
                  setQ("");
                  setPage(1);
                }}
              />
            )}
            {role && (
              <Chip
                size="small"
                label={role === "ADMIN" ? "Quản trị viên" : "Học viên"}
                onDelete={() => {
                  setRole("");
                  setPage(1);
                }}
              />
            )}
            {status && (
              <Chip
                size="small"
                label={
                  {
                    ACTIVE: "Hoạt động",
                    INACTIVE: "Bị khóa",
                    DELETED: "Đã lưu trữ",
                  }[status]
                }
                onDelete={() => {
                  setStatus("");
                  setPage(1);
                }}
              />
            )}
          </Stack>
        )}
      </Paper>
      <QueryState {...query} retry={query.reload} />
      {query.data && (
        <Paper variant="outlined" sx={{ ...adminPanelSx, overflow: "hidden" }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              p: 2.5,
              gap: 1,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                Danh sách tài khoản
              </Typography>
              <Chip
                size="small"
                label={query.data.total}
                sx={{ bgcolor: "#EEE8FA", color: "primary.dark", fontSize: 10 }}
              />
            </Stack>
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
              Trang {query.data.page}
            </Typography>
          </Stack>
          <Typography
            sx={{
              px: 2.5,
              pb: 2,
              fontSize: 10,
              color: "text.secondary",
              display: { xs: "block", lg: "none" },
            }}
          >
            Vuốt ngang để xem trạng thái và thao tác →
          </Typography>
          <TableContainer>
            <Table sx={{ ...adminTableSx, minWidth: 950 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Người dùng",
                    "Vai trò",
                    "Trạng thái",
                    "Xác minh email",
                    "Đăng nhập gần nhất",
                    "Thao tác",
                  ].map((t) => (
                    <TableCell key={t}>{t}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {query.data.items.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                      >
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: "#EFEAF8",
                            color: "#7456A7",
                            fontSize: 12,
                          }}
                        >
                          {(u.profile?.displayName || u.email)[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                            {u.email}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 10,
                              color: "text.secondary",
                              mt: 0.5,
                            }}
                          >
                            {u.profile?.displayName || "Chưa có tên hiển thị"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>
                    <TableCell>
                      <UserStatus user={u} />
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={0.75}
                        sx={{
                          alignItems: "center",
                          color: u.emailVerifiedAt
                            ? "#3D8B70"
                            : "text.secondary",
                        }}
                      >
                        {u.emailVerifiedAt && (
                          <VerifiedRounded sx={{ fontSize: 14 }} />
                        )}
                        <Typography sx={{ fontSize: 11 }}>
                          {u.emailVerifiedAt ? "Đã xác minh" : "Chưa xác minh"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {dateTime(u.lastLoginAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        href={`/admin/users/${u.id}`}
                        endIcon={<ArrowForwardRounded fontSize="small" />}
                        size="small"
                        sx={{ fontSize: 11, whiteSpace: "nowrap" }}
                      >
                        Xem / Sửa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!query.data.items.length && (
            <Box sx={{ textAlign: "center", py: 5, px: 2 }}>
              <SearchRounded sx={{ fontSize: 32, color: "#B8ADC9", mb: 1 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Không có tài khoản phù hợp.
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 1 }}>
                Thử đổi từ khóa hoặc bỏ bớt bộ lọc.
              </Typography>
            </Box>
          )}
          <Box sx={{ p: 2.5, borderTop: "1px solid #EEF0F5" }}>
            <Typography
              sx={{
                fontSize: 10,
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              {query.data.total} tài khoản · Tối đa {query.data.limit} mỗi trang
            </Typography>
            <Pager {...query.data} onChange={setPage} />
          </Box>
        </Paper>
      )}
    </>
  );
}
