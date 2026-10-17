import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Chip,
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
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { AuditLog } from "@/types/admin";
import type { PageResult } from "@/types/learning";
import {
  PageTitle,
  QueryState,
  Pager,
  dateTime,
} from "@/components/learning/Common";
import { adminPanelSx, adminTableSx } from "@/components/admin/AdminUi";
const actions: Record<string, { label: string; color: string; bg: string }> = {
  USER_CREATED: { label: "Tạo tài khoản", color: "#268066", bg: "#EAF6EF" },
  USER_UPDATED: {
    label: "Cập nhật tài khoản",
    color: "#517FB0",
    bg: "#EDF4FC",
  },
  USER_ARCHIVED: {
    label: "Lưu trữ tài khoản",
    color: "#A37736",
    bg: "#FFF5E5",
  },
  ADMIN_PROMOTED: {
    label: "Cấp quyền quản trị",
    color: "#7851B3",
    bg: "#F2ECFC",
  },
};
export default function AuditView() {
  const [page, setPage] = useState(1),
    q = useApiQuery<PageResult<AuditLog>>(
      `/admin/audit-logs?page=${page}&limit=20`,
    );
  return (
    <>
      <PageTitle
        title="Nhật ký quản trị"
        subtitle="Theo dõi ai đã thực hiện thay đổi trên từng tài khoản."
        action={
          <Button
            onClick={q.reload}
            disabled={q.loading}
            variant="outlined"
            startIcon={<RefreshRounded />}
          >
            Làm mới
          </Button>
        }
      />
      <Paper
        variant="outlined"
        sx={{
          ...adminPanelSx,
          p: 2.5,
          mb: 3,
          bgcolor: "#F7F4FD",
          display: "flex",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <HistoryRounded sx={{ color: "primary.main" }} />
        <Typography
          sx={{ fontSize: 12, lineHeight: 1.8, color: "text.secondary" }}
        >
          Nhật ký chỉ ghi tên trường thay đổi. Mật khẩu, token và mã xác minh
          không được hiển thị.
        </Typography>
      </Paper>
      <QueryState {...q} retry={q.reload} />
      {q.data && (
        <Paper variant="outlined" sx={{ ...adminPanelSx, overflow: "hidden" }}>
          <Stack direction="row" sx={{ p: 2.5, alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
              Lịch sử thao tác
            </Typography>
            <Chip
              size="small"
              label={q.data.total}
              sx={{ fontSize: 10, bgcolor: "#F0EBFA", color: "primary.dark" }}
            />
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
            Vuốt ngang để xem đầy đủ nhật ký →
          </Typography>
          <TableContainer>
            <Table sx={adminTableSx}>
              <TableHead>
                <TableRow>
                  {[
                    "Thời gian",
                    "Thao tác",
                    "Người thực hiện",
                    "Tài khoản đích",
                    "Trường thay đổi",
                  ].map((l) => (
                    <TableCell key={l}>{l}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {q.data.items.map((a) => {
                  const action = actions[a.action];
                  return (
                    <TableRow hover key={a.id}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {dateTime(a.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={action?.label || a.action}
                          sx={{
                            fontSize: 10,
                            color: action?.color,
                            bgcolor: action?.bg,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: 9,
                            color: "text.secondary",
                            mt: 0.75,
                          }}
                        >
                          {a.action}
                        </Typography>
                      </TableCell>
                      {[a.actorId, a.targetId].map((id, i) => (
                        <TableCell key={i}>
                          {id ? (
                            <Button
                              component={Link}
                              href={`/admin/users/${id}`}
                              title={id}
                              sx={{ fontSize: 11, fontFamily: "monospace" }}
                            >
                              {id.length > 12 ? id.slice(0, 8) + "…" : id}
                            </Button>
                          ) : (
                            "Hệ thống"
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Stack
                          direction="row"
                          sx={{ flexWrap: "wrap", gap: 0.5, maxWidth: 280 }}
                        >
                          {a.changedFields.length
                            ? a.changedFields.map((f) => (
                                <Chip
                                  key={f}
                                  size="small"
                                  label={f}
                                  sx={{
                                    fontSize: 9,
                                    bgcolor: "#F3F4F8",
                                    height: 22,
                                  }}
                                />
                              ))
                            : "—"}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {!q.data.items.length && (
            <Typography
              sx={{
                p: 5,
                textAlign: "center",
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              Chưa có nhật ký.
            </Typography>
          )}
          <Box sx={{ p: 2, borderTop: "1px solid #EEF0F5" }}>
            <Pager {...q.data} onChange={setPage} />
          </Box>
        </Paper>
      )}
    </>
  );
}
