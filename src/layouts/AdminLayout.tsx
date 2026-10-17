import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import SpaceDashboardRounded from "@mui/icons-material/SpaceDashboardRounded";
import PeopleAltRounded from "@mui/icons-material/PeopleAltRounded";
import ReceiptLongRounded from "@mui/icons-material/ReceiptLongRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded";
import { useAuth } from "@/contexts/AuthContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import { QueryState } from "@/components/learning/Common";
import { errorMessage } from "@/lib/api-client";
import type { User } from "@/types/auth";
const WIDTH = 232;
export default function AdminLayout({ children }: { children: ReactNode }) {
  const auth = useAuth(),
    router = useRouter(),
    check = useApiQuery<{ user: User }>("/admin/auth/me");
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [open, setOpen] = useState(false);
  const links = [
    { href: "/admin", label: "Tổng quan", icon: <SpaceDashboardRounded /> },
    { href: "/admin/users", label: "Người dùng", icon: <PeopleAltRounded /> },
    {
      href: "/admin/audit-logs",
      label: "Nhật ký",
      icon: <ReceiptLongRounded />,
    },
  ];
  const active = router.pathname.startsWith("/admin/users")
    ? "/admin/users"
    : router.pathname === "/admin/audit-logs"
      ? "/admin/audit-logs"
      : "/admin";
  async function logout() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await auth.logout(true);
      await router.replace("/admin/login");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  const nav = (mobile = false) => (
    <Box
      sx={{
        px: 2,
        py: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", px: 1, mb: 4 }}
      >
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "primary.main",
            width: 34,
            height: 34,
            borderRadius: "10px",
          }}
        >
          <AutoAwesomeRounded fontSize="small" />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.6 }}
          >
            VOCAB AI
          </Typography>
          <Typography
            sx={{ fontSize: 9, color: "text.secondary", letterSpacing: 1.5 }}
          >
            ADMIN WORKSPACE
          </Typography>
        </Box>
        {mobile && (
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Đóng menu quản trị"
          >
            <CloseRounded />
          </IconButton>
        )}
      </Stack>
      <Typography
        sx={{
          px: 1.5,
          mb: 1.5,
          fontSize: 10,
          color: "text.secondary",
          letterSpacing: 1,
          fontWeight: 600,
        }}
      >
        QUẢN LÝ ỨNG DỤNG
      </Typography>
      <List disablePadding>
        {links.map((l) => (
          <ListItemButton
            key={l.href}
            component={Link}
            href={l.href}
            aria-current={active === l.href ? "page" : undefined}
            selected={active === l.href}
            onClick={() => setOpen(false)}
            sx={{
              mb: 0.75,
              borderRadius: "12px",
              py: 1.4,
              color: active === l.href ? "primary.main" : "#6D7689",
              "&.Mui-selected": { bgcolor: "#F0EBFC" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
              {l.icon}
            </ListItemIcon>
            <ListItemText
              primary={l.label}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: 13,
                    fontWeight: active === l.href ? 700 : 500,
                  },
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: "auto", pt: 4 }}>
        <Box sx={{ p: 2, bgcolor: "#F7F5FC", borderRadius: "14px", mb: 2 }}>
          <AdminPanelSettingsRounded
            sx={{ color: "primary.main", mb: 1, fontSize: 23 }}
          />
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
            Khu vực quản trị
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              lineHeight: 1.8,
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            Theo dõi hoạt động và quản lý tài khoản học tập.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/user/dashboard"
          endIcon={<ArrowOutwardRounded fontSize="small" />}
          fullWidth
          sx={{ fontSize: 12, mb: 1 }}
        >
          Trang học tập
        </Button>
        <Button
          color="inherit"
          fullWidth
          startIcon={<LogoutRounded />}
          disabled={busy}
          onClick={() => void logout()}
          sx={{ fontSize: 12, color: "text.secondary" }}
        >
          Đăng xuất quản trị
        </Button>
      </Box>
    </Box>
  );
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F6F7FB" }}>
      <Box
        component="nav"
        aria-label="Điều hướng quản trị"
        sx={{ width: { md: WIDTH }, flexShrink: 0 }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: WIDTH,
              boxSizing: "border-box",
              borderRight: "1px solid #E7E9F1",
            },
          }}
        >
          {nav()}
        </Drawer>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            display: { md: "none" },
            "& .MuiDrawer-paper": { width: 280, maxWidth: "90vw" },
          }}
        >
          {nav(true)}
        </Drawer>
      </Box>
      <Box component="main" sx={{ minWidth: 0, flex: 1 }}>
        <Box
          component="header"
          sx={{
            px: { xs: 2, md: 4 },
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: "white",
            borderBottom: "1px solid #E7E9F1",
          }}
        >
          <IconButton
            aria-label="Mở menu quản trị"
            onClick={() => setOpen(true)}
            sx={{ display: { md: "none" } }}
          >
            <MenuRounded />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 10, color: "text.secondary", mb: 0.25 }}
            >
              Không gian quản trị
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              {links.find((l) => l.href === active)?.label}
            </Typography>
          </Box>
          <Chip
            size="small"
            label="ADMIN"
            sx={{
              fontSize: 9,
              color: "primary.main",
              bgcolor: "#F1ECFB",
              display: { xs: "none", sm: "flex" },
            }}
          />
          <Avatar
            sx={{
              bgcolor: "#EDE6FC",
              color: "primary.dark",
              width: 34,
              height: 34,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {(auth.user?.email || "A")[0].toUpperCase()}
          </Avatar>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
              display: { xs: "none", lg: "block" },
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {auth.user?.email}
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1700, mx: "auto" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <QueryState {...check} retry={check.reload} />
          {check.data?.user.role === "ADMIN" && children}
        </Box>
      </Box>
    </Box>
  );
}
