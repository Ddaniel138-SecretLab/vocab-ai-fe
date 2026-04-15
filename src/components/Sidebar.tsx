import React from 'react';
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
  useMediaQuery
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useRouter } from 'next/router';

export const SIDEBAR_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  desktopOpen: boolean;
  onMobileClose: () => void;
  onDesktopToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, desktopOpen, onMobileClose, onDesktopToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const overviewMenu = [
    { text: 'Tổng quan', icon: <DashboardRoundedIcon />, path: '/user/dashboard', isDisabled: false },
    { text: 'Sổ tay từ vựng', icon: <MenuBookRoundedIcon />, path: '/user/vocabulary', isDisabled: false },
    { text: 'Luyện tập AI', icon: <AutoFixHighRoundedIcon />, path: '/user/ai-practice', isDisabled: true },
    { text: 'Kiểm tra & Ôn tập', icon: <QuizRoundedIcon />, path: '/user/quizzes', isDisabled: true },
    { text: 'Tiến độ học', icon: <InsertChartRoundedIcon />, path: '/user/progress', isDisabled: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Logo & Toggle Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ p: 0.8, bgcolor: 'primary.main', borderRadius: 2, display: 'flex', color: 'white' }}>
            <AutoAwesomeIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', letterSpacing: 0.5 }}>
            VOCAB AI
          </Typography>
        </Box>
        <IconButton onClick={isMobile ? onMobileClose : onDesktopToggle} size="small" sx={{ color: 'text.secondary' }}>
          <MenuOpenIcon sx={{ transform: desktopOpen ? 'none' : 'rotate(180deg)', transition: '0.3s' }} />
        </IconButton>
      </Box>

      {/* Menu Overview */}
      <Box sx={{ px: 2, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', ml: 2, mb: 1, display: 'block' }}>
          MAIN MENU
        </Typography>
        <List sx={{ pt: 0 }}>
          {overviewMenu.map((item) => {
            // Logic Active: Sáng lên khi URL hiện tại khớp với path
            const isActive = router.pathname.startsWith(item.path);

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  // Chuyển hướng khi click
                  onClick={() => router.push(item.path)}
                  disabled={item.isDisabled}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    // Chỉnh lại màu nền mờ khi active cho đẹp hơn
                    ...(isActive && { bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(106, 75, 255, 0.15)' : 'rgba(106, 75, 255, 0.08)' }),
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={<Typography sx={{ fontWeight: isActive ? 'bold' : 'medium' }}>{item.text}</Typography>} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Menu Settings */}
      <Box sx={{ px: 2, pb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', ml: 2, mb: 1, display: 'block' }}>
          SYSTEM
        </Typography>
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton disabled onClick={() => router.push('/settings')} sx={{ borderRadius: 2, color: 'text.secondary' }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><SettingsRoundedIcon /></ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 'medium' }}>Cài đặt</Typography>} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><LogoutRoundedIcon /></ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 'medium' }}>Đăng xuất</Typography>} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: desktopOpen ? SIDEBAR_WIDTH : 0 }, flexShrink: { md: 0 }, transition: 'width 0.3s' }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH, borderRight: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="persistent"
        open={desktopOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH, borderRight: 1, borderColor: 'divider' },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;