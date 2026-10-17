import type { ReactNode } from "react";
import { Avatar, Box, Chip, Paper, Typography } from "@mui/material";
import type { AdminUser } from "@/types/admin";
export const adminPanelSx = {
  borderRadius: "20px",
  borderColor: "#E5E7EF",
  boxShadow: "0 4px 18px #23304D03",
  minWidth: 0,
};
export const adminTableSx = {
  minWidth: 850,
  "& .MuiTableCell-head": {
    bgcolor: "#F8F9FC",
    color: "#687188",
    fontSize: 11,
    fontWeight: 700,
    py: 2,
    whiteSpace: "nowrap",
  },
  "& .MuiTableCell-body": { fontSize: 12, borderColor: "#EEF0F5", py: 2 },
  "& .MuiTableRow-hover:hover": { bgcolor: "#FAF8FF" },
};
export function RoleBadge({ role }: { role: string }) {
  return (
    <Chip
      size="small"
      label={role === "ADMIN" ? "Quản trị viên" : "Học viên"}
      sx={{
        height: 24,
        fontSize: 10,
        fontWeight: 600,
        color: role === "ADMIN" ? "#6C4DB1" : "#47748C",
        bgcolor: role === "ADMIN" ? "#F0EAFB" : "#EDF4F9",
      }}
    />
  );
}
export function UserStatus({
  user,
}: {
  user: Pick<AdminUser, "deletedAt" | "isActive">;
}) {
  return (
    <Chip
      size="small"
      label={
        user.deletedAt ? "Đã lưu trữ" : user.isActive ? "Hoạt động" : "Bị khóa"
      }
      sx={{
        height: 24,
        fontSize: 10,
        color: user.deletedAt
          ? "#7C8394"
          : user.isActive
            ? "#28795F"
            : "#AC7331",
        bgcolor: user.deletedAt
          ? "#F0F1F4"
          : user.isActive
            ? "#EAF6EF"
            : "#FFF4E4",
      }}
    />
  );
}
export function MetricTile({
  label,
  value,
  icon,
  color = "#7454BF",
  bg = "#F2EDFC",
  helper,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: string;
  bg?: string;
  helper?: string;
}) {
  return (
    <Paper variant="outlined" sx={{ ...adminPanelSx, p: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{ fontSize: 12, color: "text.secondary", fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Avatar
          variant="rounded"
          sx={{
            width: 36,
            height: 36,
            bgcolor: bg,
            color,
            borderRadius: "10px",
          }}
        >
          {icon}
        </Avatar>
      </Box>
      <Typography
        sx={{
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: -1,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
      {helper && (
        <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 1 }}>
          {helper}
        </Typography>
      )}
    </Paper>
  );
}
