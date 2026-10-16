import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useApiQuery } from "@/hooks/useApiQuery";
import type { AuditLog } from "@/types/admin";
import type { PageResult } from "@/types/learning";
import {
  PageTitle,
  QueryState,
  Pager,
  dateTime,
} from "@/components/learning/Common";
export default function AuditView() {
  const [page, setPage] = useState(1);
  const q = useApiQuery<PageResult<AuditLog>>(
    `/admin/audit-logs?page=${page}&limit=20`,
  );
  return (
    <>
      <PageTitle
        title="Nhật ký quản trị"
        subtitle="Theo dõi thao tác và trường được thay đổi; không hiển thị mật khẩu hoặc mã xác minh."
      />
      <QueryState {...q} retry={q.reload} />
      {q.data && (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 850 }}>
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
                {q.data.items.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{dateTime(a.createdAt)}</TableCell>
                    <TableCell>{a.action}</TableCell>
                    {[a.actorId, a.targetId].map((id, i) => (
                      <TableCell key={i}>
                        {id ? (
                          <Button
                            component={Link}
                            href={`/admin/users/${id}`}
                            title={id}
                          >
                            {id.slice(0, 8)}…
                          </Button>
                        ) : (
                          "Hệ thống"
                        )}
                      </TableCell>
                    ))}
                    <TableCell>{a.changedFields.join(", ") || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!q.data.items.length && (
            <Typography sx={{ my: 2 }}>Chưa có nhật ký.</Typography>
          )}
          <Pager {...q.data} onChange={setPage} />
        </>
      )}
    </>
  );
}
