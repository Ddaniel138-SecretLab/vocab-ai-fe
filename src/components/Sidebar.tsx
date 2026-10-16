import { useState } from "react";
import { Alert } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { errorMessage } from "@/lib/api-client";
import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import InsertChartRoundedIcon from "@mui/icons-material/InsertChartRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useRouter } from "next/router";

export const SIDEBAR_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  desktopOpen: boolean;
  onMobileClose: () => void;
  onDesktopToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  desktopOpen,
  onMobileClose,
  onDesktopToggle,
}) => {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const router = useRouter();

  const overviewMenu = [
    {
      text: "Tổng quan",
      icon: <DashboardRoundedIcon />,
      path: "/user/dashboard",
      isDisabled: false,
    },
    {
      text: "Chủ đề từ vựng",
      icon: <MenuBookRoundedIcon />,
      path: "/user/vocabulary",
      isDisabled: false,
    },
    {
      text: "Lịch sử học tập",
      icon: <QuizRoundedIcon />,
      path: "/user/sessions",
      isDisabled: false,
    },
    {
      text: "Ôn tập & Streak",
      icon: <InsertChartRoundedIcon />,
      path: "/user/reviews",
      isDisabled: false,
    },
    {
      text: "Cài đặt học tập",
      icon: <SettingsRoundedIcon />,
      path: "/user/learning-settings",
      isDisabled: false,
    },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      await router.replace("/login");
    } catch (e) {
      setLogoutError(errorMessage(e));
    } finally {
      setLoggingOut(false);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* Logo & Toggle Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              p: 0.8,
              bgcolor: "primary.main",
              borderRadius: 2,
              display: "flex",
              color: "white",
            }}
          >
            <AutoAwesomeIcon fontSize="small" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              letterSpacing: 0.5,
            }}
          >
            VOCAB AI
          </Typography>
        </Box>
        <IconButton
          aria-label={isMobile ? "Đóng menu" : "Thu gọn menu"}
          onClick={isMobile ? onMobileClose : onDesktopToggle}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <MenuOpenIcon
            sx={{
              transform: desktopOpen ? "none" : "rotate(180deg)",
              transition: "0.3s",
            }}
          />
        </IconButton>
      </Box>

      {/* Menu Overview */}
      <Box sx={{ px: 2, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "text.secondary",
            ml: 2,
            mb: 1,
            display: "block",
          }}
        >
          MAIN MENU
        </Typography>
        <List sx={{ pt: 0 }}>
          {overviewMenu.map((item) => {
            // Logic Active: Sáng lên khi URL hiện tại khớp với path
            const isActive =
              router.pathname.startsWith(item.path) ||
              (item.path === "/user/vocabulary" &&
                router.pathname.startsWith("/user/topics/")) ||
              (item.path === "/user/sessions" &&
                router.pathname.startsWith("/user/study/"));

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  // Chuyển hướng khi click
                  onClick={() => {
                    void router.push(item.path);
                    onMobileClose();
                  }}
                  disabled={item.isDisabled}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? "primary.main" : "text.secondary",
                    bgcolor: isActive ? "primary.light" : "transparent",
                    // Chỉnh lại màu nền mờ khi active cho đẹp hơn
                    ...(isActive && {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(106, 75, 255, 0.15)"
                          : "rgba(106, 75, 255, 0.08)",
                    }),
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{ fontWeight: isActive ? "bold" : "medium" }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {logoutError && <Alert severity="error">{logoutError}</Alert>}
      {/* Menu Settings */}
      <Box sx={{ px: 2, pb: 3 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "text.secondary",
            ml: 2,
            mb: 1,
            display: "block",
          }}
        >
          SYSTEM
        </Typography>
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => {
                void router.push("/user/profile");
                onMobileClose();
              }}
              sx={{ borderRadius: 2, color: "text.secondary" }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <SettingsRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: "medium" }}>
                    Hồ sơ cá nhân
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              disabled={loggingOut}
              onClick={() => void handleLogout()}
              sx={{ borderRadius: 2, color: "error.main" }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <LogoutRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: "medium" }}>
                    Đăng xuất
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { lg: desktopOpen ? SIDEBAR_WIDTH : 0 },
        flexShrink: { lg: 0 },
        transition: "width 0.3s",
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            borderRight: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="persistent"
        open={desktopOpen}
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
