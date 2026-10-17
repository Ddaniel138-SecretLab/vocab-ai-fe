import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuRounded from "@mui/icons-material/MenuRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import YourProfile from "@/components/profile/YourProfile";
import { useAuth } from "@/contexts/AuthContext";
import { thinScrollbarSx } from "@/styles/scrollbar";
export default function MainLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false),
    [expanded, setExpanded] = useState(true),
    [profileOpen, setProfileOpen] = useState(false),
    [profileExpanded, setProfileExpanded] = useState(true);
  const { profile, user } = useAuth(),
    router = useRouter(),
    theme = useTheme(),
    wide = useMediaQuery(theme.breakpoints.up("xl"));
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      try {
        if (active) {
          setExpanded(localStorage.getItem("vocab-ui-sidebar") !== "mini");
          setProfileExpanded(
            localStorage.getItem("vocab-ui-profile") !== "mini",
          );
        }
      } catch {}
    });
    return () => {
      active = false;
    };
  }, []);
  function toggleSidebar() {
    const next = !expanded;
    setExpanded(next);
    try {
      localStorage.setItem("vocab-ui-sidebar", next ? "expanded" : "mini");
    } catch {}
  }
  function toggleProfile() {
    const next = !profileExpanded;
    setProfileExpanded(next);
    try {
      localStorage.setItem("vocab-ui-profile", next ? "expanded" : "mini");
    } catch {}
  }
  const name = profile?.displayName || user?.email.split("@")[0] || "Bạn",
    section = router.pathname.includes("/study/")
      ? "Góc học tập"
      : router.pathname.includes("/profile")
        ? "Hồ sơ học tập"
        : "Học một chút, tiến bộ mỗi ngày";
  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        maxHeight: "100dvh",
        minHeight: 0,
        overflow: "hidden",
        bgcolor: "#F8F7FC",
      }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        desktopOpen={expanded}
        onMobileClose={() => setMobileOpen(false)}
        onDesktopToggle={toggleSidebar}
      />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            px: { xs: 1, md: 4 },
            py: { xs: 1, md: 2.5 },
            flexShrink: 0,
            borderBottom: "1px solid #EDE9F4",
            bgcolor: "rgba(255,255,255,.75)",
          }}
        >
          <IconButton
            aria-label="Mở menu"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { lg: "none" } }}
          >
            <MenuRounded />
          </IconButton>
          <Typography
            sx={{ fontWeight: 800, fontSize: { xs: 15, md: 20 }, lineHeight: 1.2, background: 'linear-gradient(to right, #1976d2, #9c27b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {section}
          </Typography>
          <Button
            aria-label="Mở hồ sơ"
            onClick={() => setProfileOpen(true)}
            sx={{
              display: { xl: "none" },
              minWidth: 0,
              p: 0.5,
              borderRadius: 3,
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#E8E0FF",
                color: "primary.dark",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {name[0]?.toUpperCase()}
            </Avatar>
          </Button>
        </Box>
        <Box
          data-testid="learning-scroll"
          role="region"
          aria-label="Nội dung học tập"
          tabIndex={0}
          sx={{
            ...thinScrollbarSx,
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflowY: "auto",
            overscrollBehaviorY: "contain",
            "&:focus-visible": {
              outline: "2px solid #C8B5EB",
              outlineOffset: -2,
            },
          }}
        >
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              maxWidth: 1600,
              mx: "auto",
              width: "100%",
              minWidth: 0,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
      <Box
        component="aside"
        aria-label="Hồ sơ bên phải"
        data-testid="profile-sidebar"
        sx={{
          display: { xs: "none", xl: "flex" },
          flexDirection: "column",
          width: profileExpanded ? 288 : 80,
          height: "100%",
          minHeight: 0,
          flexShrink: 0,
          overflow: "hidden",
          borderLeft: "1px solid #EDE9F4",
          bgcolor: "white",
          transition: "width .22s ease",
          "@media(prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        {profileExpanded ? (
          <Box id="desktop-profile-panel" sx={{ height: "100%", minHeight: 0 }}>
            <YourProfile onCollapse={toggleProfile} />
          </Box>
        ) : (
          <Stack sx={{ height: "100%", alignItems: "center", py: 3, gap: 2 }}>
            <Tooltip title="Mở rộng hồ sơ" placement="left">
              <IconButton
                aria-label="Mở rộng hồ sơ"
                aria-expanded={false}
                onClick={toggleProfile}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: 14,
                    bgcolor: "#E8E0FF",
                    color: "primary.dark",
                  }}
                >
                  {name[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Tooltip title="Góc của bạn" placement="left">
              <IconButton
                aria-label="Xem góc của bạn"
                onClick={toggleProfile}
                sx={{ color: "primary.main" }}
              >
                <PersonOutlineRounded />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chỉnh sửa hồ sơ" placement="left">
              <IconButton
                component={Link}
                href="/user/profile"
                aria-label="Chỉnh sửa hồ sơ"
              >
                <EditRounded />
              </IconButton>
            </Tooltip>
            <Box sx={{ mt: "auto" }}>
              <Tooltip title="Mở rộng hồ sơ" placement="left">
                <IconButton
                  aria-label="Mở rộng panel hồ sơ"
                  onClick={toggleProfile}
                  sx={{ border: "1px solid #E8E3F3", borderRadius: 2 }}
                >
                  <ChevronLeftRounded />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        )}
      </Box>
      <Drawer
        anchor="right"
        open={profileOpen && !wide}
        onClose={() => setProfileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 340 },
            maxWidth: "100vw",
            height: "100dvh",
            overflow: "hidden",
          },
        }}
      >
        <YourProfile isMobile onClose={() => setProfileOpen(false)} />
      </Drawer>
    </Box>
  );
}
