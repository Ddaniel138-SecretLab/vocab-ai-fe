import { Avatar, Box, Paper } from "@mui/material";
import ArchiveOutlined from "@mui/icons-material/ArchiveOutlined";
import {
  adminPanelSx,
  RoleBadge,
  UserStatus,
} from "@/components/admin/AdminUi";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import { adminApi } from "@/services/admin-api";
import { errorMessage } from "@/lib/api-client";
import type { AdminUser } from "@/types/admin";
import { PageTitle, QueryState, dateTime } from "@/components/learning/Common";
import UserForm from "./UserForm";
export default function UserDetailView({ id }: { id: string }) {
  const query = useApiQuery<{ user: AdminUser }>(`/admin/users/${id}`),
    auth = useAuth();
  const [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const lock = useRef(false);
  const user = query.data?.user;
  async function archive() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await adminApi.archive(id);
      setConfirm(false);
      setNotice("Đã lưu trữ tài khoản và kết thúc các phiên đăng nhập.");
      query.reload();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <Button component={Link} href="/admin/users">
        ← Danh sách tài khoản
      </Button>
      <PageTitle title="Chi tiết tài khoản" />
      <QueryState {...query} retry={query.reload} />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      {user && (
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ ...adminPanelSx, p: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { sm: "center" }, mb: 3 }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "#EDE7F8",
                  color: "primary.dark",
                  fontWeight: 700,
                  fontSize: 22,
                }}
              >
                {(user.profile?.displayName || user.email)[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    overflowWrap: "anywhere",
                  }}
                >
                  {user.profile?.displayName || user.email}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "text.secondary",
                    mt: 0.5,
                    overflowWrap: "anywhere",
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                <RoleBadge role={user.role} />
                <UserStatus user={user} />
              </Stack>
            </Stack>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,170px),1fr))",
                gap: 2,
              }}
            >
              {[
                { label: "Mã tài khoản", value: user.id },
                { label: "Ngày tạo", value: dateTime(user.createdAt) },
                {
                  label: "Đăng nhập gần nhất",
                  value: dateTime(user.lastLoginAt),
                },
              ].map((i) => (
                <Box key={i.label}>
                  <Typography
                    sx={{ fontSize: 10, color: "text.secondary", mb: 0.75 }}
                  >
                    {i.label}
                  </Typography>
                  <Typography sx={{ fontSize: 11, overflowWrap: "anywhere" }}>
                    {i.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3,minmax(0,1fr))",
              gap: 1.5,
            }}
          >
            {[
              { label: "Phiên học", value: user._count.studySessions },
              { label: "Tiến độ từ", value: user._count.vocabularyProgress },
              { label: "Chủ đề đã tạo", value: user._count.createdTopics },
            ].map((i) => (
              <Paper
                key={i.label}
                variant="outlined"
                sx={{ ...adminPanelSx, p: { xs: 1.5, sm: 2.5 } }}
              >
                <Typography
                  sx={{ fontSize: 26, fontWeight: 700, color: "primary.dark" }}
                >
                  {i.value}
                </Typography>
                <Typography
                  sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}
                >
                  {i.label}
                </Typography>
              </Paper>
            ))}
          </Box>
          {user.deletedAt ? (
            <Alert severity="warning">
              Tài khoản đã lưu trữ lúc {dateTime(user.deletedAt)}. Lịch sử được
              giữ lại; hiện không có chức năng khôi phục.
            </Alert>
          ) : (
            <>
              <UserForm
                key={user.updatedAt}
                user={user}
                onSaved={() => {
                  setNotice("Đã lưu thay đổi.");
                  query.reload();
                }}
              />
              <Paper
                variant="outlined"
                sx={{
                  ...adminPanelSx,
                  p: 2.5,
                  borderColor: "#EFD9D7",
                  bgcolor: "#FFFAF9",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { sm: "center" },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: 700, color: "#A65E55" }}
                    >
                      Lưu trữ tài khoản
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "text.secondary",
                        mt: 0.75,
                        lineHeight: 1.8,
                      }}
                    >
                      Dừng quyền đăng nhập, giữ nguyên lịch sử học tập.
                    </Typography>
                  </Box>
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<ArchiveOutlined />}
                    disabled={user.id === auth.user?.id || busy}
                    onClick={() => setConfirm(true)}
                    sx={{ flexShrink: 0 }}
                  >
                    Lưu trữ tài khoản
                  </Button>
                </Stack>
              </Paper>
            </>
          )}
        </Stack>
      )}
      <Dialog
        open={confirm}
        onClose={() => {
          if (!busy) setConfirm(false);
        }}
      >
        <DialogTitle>Lưu trữ tài khoản?</DialogTitle>
        <DialogContent>
          <Typography sx={{ overflowWrap: "anywhere" }}>
            {user?.email}
          </Typography>
          <Typography>
            Tài khoản sẽ không thể đăng nhập. Lịch sử học tập vẫn được giữ lại.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={() => setConfirm(false)}>
            Hủy
          </Button>
          <Button color="error" disabled={busy} onClick={() => void archive()}>
            {busy ? "Đang xử lý…" : "Xác nhận lưu trữ"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
