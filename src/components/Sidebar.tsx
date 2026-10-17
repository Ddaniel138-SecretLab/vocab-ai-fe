import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardRounded from "@mui/icons-material/DashboardRounded";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import NotificationsActiveRounded from "@mui/icons-material/NotificationsActiveRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage } from "@/lib/api-client";
export const SIDEBAR_WIDTH = 248;
export const SIDEBAR_MINI_WIDTH = 80;
interface Props {
  mobileOpen: boolean;
  desktopOpen: boolean;
  onMobileClose: () => void;
  onDesktopToggle: () => void;
}
export default function Sidebar({
  mobileOpen,
  desktopOpen,
  onMobileClose,
  onDesktopToggle,
}: Props) {
  const router = useRouter(),
    { user, logout } = useAuth();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const links = [
    { title: "Tổng quan", path: "/user/dashboard", icon: <DashboardRounded /> },
    {
      title: "Chủ đề từ vựng",
      path: "/user/vocabulary",
      icon: <AutoStoriesRounded />,
    },
    {
      title: "Lịch sử học tập",
      path: "/user/sessions",
      icon: <HistoryRounded />,
    },
    {
      title: "Ôn tập & Streak",
      path: "/user/reviews",
      icon: <LocalFireDepartmentRounded />,
    },
    {
      title: "Cài đặt học tập",
      path: "/user/learning-settings",
      icon: <NotificationsActiveRounded />,
    },
    { title: "Hồ sơ cá nhân", path: "/user/profile", icon: <PersonRounded /> },
    ...(user?.role === "ADMIN"
      ? [
          {
            title: "Quản trị",
            path: "/admin",
            icon: <AdminPanelSettingsRounded />,
          },
        ]
      : []),
  ];
  async function signOut() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await logout();
      await router.replace("/login");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  const content = (mini: boolean, mobile = false) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        px: mini ? 1.25 : 2,
        py: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: mini ? 0.5 : 1,
          mb: 4,
          minHeight: 40,
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 36,
            height: 36,
            bgcolor: "primary.main",
            borderRadius: 2.5,
          }}
        >
          <AutoAwesomeRounded fontSize="small" />
        </Avatar>
        {!mini && (
          <Typography sx={{ fontWeight: 700, letterSpacing: -0.7, flex: 1 }}>
            VOCAB{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              AI
            </Box>
          </Typography>
        )}
        {mobile && (
          <IconButton onClick={onMobileClose} aria-label="Đóng menu">
            <CloseRounded />
          </IconButton>
        )}
      </Box>
      {!mini && (
        <Typography
          sx={{
            fontSize: 10,
            letterSpacing: 1.5,
            color: "text.secondary",
            px: 1.5,
            mb: 1.5,
            fontWeight: 600,
          }}
        >
          KHÔNG GIAN HỌC TẬP
        </Typography>
      )}
      <List sx={{ p: 0 }}>
        {links.map((l) => {
          const active =
            router.pathname === l.path ||
            (l.path === "/user/vocabulary" &&
              router.pathname.startsWith("/user/topics")) ||
            (l.path === "/user/sessions" &&
              router.pathname.startsWith("/user/study"));
          return (
            <Tooltip key={l.path} title={mini ? l.title : ""} placement="right">
              <ListItemButton
                component={Link}
                href={l.path}
                aria-label={l.title}
                aria-current={active ? "page" : undefined}
                onClick={onMobileClose}
                selected={active}
                sx={{
                  mb: 0.75,
                  px: mini ? 1.75 : 1.5,
                  py: 1.4,
                  borderRadius: 2.5,
                  justifyContent: mini ? "center" : undefined,
                  color: active ? "primary.main" : "text.secondary",
                  "&.Mui-selected": { bgcolor: "#F0EBFF" },
                  "&.Mui-selected:hover": { bgcolor: "#E9E2FF" },
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: mini ? 0 : 38, color: "inherit" }}
                >
                  {l.icon}
                </ListItemIcon>
                {!mini && (
                  <ListItemText
                    primary={l.title}
                    slotProps={{
                      primary: {
                        sx: { fontSize: 13, fontWeight: active ? 700 : 500 },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
      <Box sx={{ mt: "auto", pt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 1, overflowWrap: "anywhere" }}>
            {error}
          </Alert>
        )}
        <Tooltip title={mini ? "Đăng xuất" : ""} placement="right">
          <ListItemButton
            aria-label="Đăng xuất"
            disabled={busy}
            onClick={() => void signOut()}
            sx={{
              borderRadius: 2.5,
              color: "text.secondary",
              px: mini ? 1.75 : 1.5,
              justifyContent: mini ? "center" : undefined,
            }}
          >
            <ListItemIcon sx={{ minWidth: mini ? 0 : 38, color: "inherit" }}>
              <LogoutRounded />
            </ListItemIcon>
            {!mini && (
              <ListItemText
                primary={busy ? "Đang đăng xuất…" : "Đăng xuất"}
                slotProps={{ primary: { sx: { fontSize: 13 } } }}
              />
            )}
          </ListItemButton>
        </Tooltip>
        {!mobile && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid #F0EDF6",
              display: "flex",
              justifyContent: mini ? "center" : "flex-end",
            }}
          >
            <Tooltip
              title={mini ? "Mở rộng menu" : "Thu gọn menu"}
              placement="right"
            >
              <IconButton
                aria-label={mini ? "Mở rộng menu" : "Thu gọn menu"}
                onClick={onDesktopToggle}
                sx={{ border: "1px solid #E8E3F3", borderRadius: 2 }}
              >
                {mini ? <ChevronRightRounded /> : <ChevronLeftRounded />}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
  return (
    <Box
      component="nav"
      aria-label="Điều hướng học tập"
      sx={{
        width: { lg: desktopOpen ? SIDEBAR_WIDTH : SIDEBAR_MINI_WIDTH },
        flexShrink: 0,
        transition: "width .22s ease",
        "@media(prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{
          display: { lg: "none" },
          "& .MuiDrawer-paper": { width: 280, maxWidth: "90vw", border: 0 },
        }}
      >
        {content(false, true)}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: desktopOpen ? SIDEBAR_WIDTH : SIDEBAR_MINI_WIDTH,
            boxSizing: "border-box",
            overflowX: "hidden",
            borderRight: "1px solid #EDE9F4",
            transition: "width .22s ease",
            "@media(prefers-reduced-motion: reduce)": { transition: "none" },
          },
        }}
      >
        {content(!desktopOpen)}
      </Drawer>
    </Box>
  );
}
