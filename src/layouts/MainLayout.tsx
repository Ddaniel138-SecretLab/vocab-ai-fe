import React, { ReactNode, useState } from 'react';
import { Box, IconButton, Drawer, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import YourProfile from '../components/profile/YourProfile';
import Sidebar, { SIDEBAR_WIDTH } from '@/components/Sidebar';

const PROFILE_WIDTH = 320;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  // isMobile thực chất đang bao gồm cả màn hình Tablet (dưới chuẩn lg - 1200px)
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleMobileSidebarToggle = () => setMobileSidebarOpen(!mobileSidebarOpen);
  const handleDesktopSidebarToggle = () => setDesktopSidebarOpen(!desktopSidebarOpen);
  const handleProfileToggle = () => setProfileOpen(!profileOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

      <Sidebar
        mobileOpen={mobileSidebarOpen}
        desktopOpen={desktopSidebarOpen}
        onMobileClose={handleMobileSidebarToggle}
        onDesktopToggle={handleDesktopSidebarToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: {
            xs: '100%',
            md: `calc(100% - ${desktopSidebarOpen ? SIDEBAR_WIDTH : 0}px - ${isMobile ? 0 : PROFILE_WIDTH}px)`
          },
          transition: 'width 0.3s'
        }}
      >
        {/* --- TOP BAR CONTAINER --- */}
        <Box sx={{
          // Logic quan trọng: Luôn hiện ở màn hình nhỏ (xs). Ở Desktop (lg), nếu sidebar mở -> ẩn hẳn Box này.
          display: { xs: 'flex', lg: desktopSidebarOpen ? 'none' : 'flex' },
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 4 },
          py: 2, // Thay vì pt quá to, dùng py (padding top & bottom) bằng 2 cho gọn gàng
        }}>
          {/* Nhóm nút mở Sidebar */}
          <Box>
            {/* Nút Hamburger cho Mobile/Tablet */}
            <IconButton onClick={handleMobileSidebarToggle} sx={{ display: { lg: 'none' } }}>
              <MenuIcon />
            </IconButton>

            {/* Nút Hamburger cho Desktop (Chỉ hiện khi sidebar Desktop đang đóng) */}
            <IconButton
              onClick={handleDesktopSidebarToggle}
              sx={{ display: { xs: 'none', lg: desktopSidebarOpen ? 'none' : 'inline-flex' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Nút mở Profile (Chỉ hiện trên Mobile/Tablet) */}
          <IconButton
            onClick={handleProfileToggle}
            sx={{ display: { xs: 'inline-flex', lg: 'none' }, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
          >
            <PersonOutlinedIcon color="primary" />
          </IconButton>
        </Box>

        {/* --- DASHBOARD CONTENT --- */}
        <Box sx={{
          px: { xs: 2, md: 4 },
          pb: { xs: 2, md: 4 },
          // Bù padding-top cho Desktop nếu Top Bar ở trên bị ẩn đi
          pt: { xs: 0, lg: desktopSidebarOpen ? 4 : 0 },
          overflowY: 'auto',
          flexGrow: 1
        }}>
          {children}
        </Box>
      </Box>

      {/* Profile Sidebar cho Mobile/Tablet */}
      <Drawer
        anchor="right"
        open={profileOpen}
        onClose={handleProfileToggle}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: { xs: '100%', sm: PROFILE_WIDTH } },
        }}
      >
        <YourProfile isMobile={true} onClose={handleProfileToggle} />
      </Drawer>

      {/* Profile Panel cố định cho Desktop */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: PROFILE_WIDTH,
          flexShrink: 0,
          borderLeft: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <YourProfile isMobile={false} />
      </Box>

    </Box>
  );
};

export default MainLayout;