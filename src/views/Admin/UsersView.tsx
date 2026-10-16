import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Button,
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
  return (
    <>
      <PageTitle
        title="Quản lý người dùng"
        action={
          <Button component={Link} href="/admin/users/new" variant="contained">
            Tạo tài khoản
          </Button>
        }
      />
      <Stack
        component="form"
        onSubmit={submit}
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          label="Email hoặc tên"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          size="small"
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
          sx={{ minWidth: 150 }}
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
          sx={{ minWidth: 170 }}
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
        <Button type="submit" variant="outlined">
          Tìm kiếm
        </Button>
      </Stack>
      <QueryState {...query} retry={query.reload} />
      {query.data && (
        <>
          <Typography sx={{ mb: 2 }}>{query.data.total} tài khoản</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 850 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Email",
                    "Tên",
                    "Vai trò",
                    "Trạng thái",
                    "Xác minh",
                    "Đăng nhập gần nhất",
                    "Chi tiết",
                  ].map((t) => (
                    <TableCell key={t}>{t}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {query.data.items.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.profile?.displayName || "Chưa có"}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      {u.deletedAt
                        ? "Đã lưu trữ"
                        : u.isActive
                          ? "Hoạt động"
                          : "Bị khóa"}
                    </TableCell>
                    <TableCell>
                      {u.emailVerifiedAt ? "Đã xác minh" : "Chưa xác minh"}
                    </TableCell>
                    <TableCell>{dateTime(u.lastLoginAt)}</TableCell>
                    <TableCell>
                      <Button component={Link} href={`/admin/users/${u.id}`}>
                        Xem / Sửa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!query.data.items.length && (
            <Typography sx={{ my: 2 }}>Không có tài khoản phù hợp.</Typography>
          )}
          <Pager {...query.data} onChange={setPage} />
        </>
      )}
    </>
  );
}
