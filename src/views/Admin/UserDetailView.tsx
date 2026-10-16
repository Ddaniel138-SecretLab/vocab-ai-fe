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
          <Typography sx={{ overflowWrap: "anywhere" }}>
            ID: {user.id} · Tạo: {dateTime(user.createdAt)} · Đăng nhập:{" "}
            {dateTime(user.lastLoginAt)}
          </Typography>
          <Typography>
            {user._count.studySessions} phiên học ·{" "}
            {user._count.vocabularyProgress} tiến độ từ ·{" "}
            {user._count.createdTopics} chủ đề đã tạo
          </Typography>
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
              <Button
                color="error"
                variant="outlined"
                disabled={user.id === auth.user?.id || busy}
                onClick={() => setConfirm(true)}
              >
                Lưu trữ tài khoản
              </Button>
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
