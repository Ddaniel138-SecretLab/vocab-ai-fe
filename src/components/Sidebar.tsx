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
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useRouter } from 'next/router';

// Chiều rộng cố định của Sidebar khi mở
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

  // Danh sách menu OVERVIEW
  const overviewMenu = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Inbox', icon: <MailIcon />, path: '/inbox' },
    { text: 'Lesson', icon: <MenuBookIcon />, path: '/lesson' },
    { text: 'Task', icon: <AssignmentIcon />, path: '/task' },
    { text: 'Group', icon: <GroupIcon />, path: '/group' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  // Nội dung chính của Sidebar
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
        {/* Nút đóng mở Sidebar */}
        <IconButton onClick={isMobile ? onMobileClose : onDesktopToggle} size="small" sx={{ color: 'text.secondary' }}>
          <MenuOpenIcon sx={{ transform: desktopOpen ? 'none' : 'rotate(180deg)', transition: '0.3s' }} />
        </IconButton>
      </Box>

      {/* Menu Overview */}
      <Box sx={{ px: 2, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', ml: 2, mb: 1, display: 'block' }}>
          OVERVIEW
        </Typography>
        <List sx={{ pt: 0 }}>
          {overviewMenu.map((item) => {
            const isActive = router.pathname === item.path; // Check active tạm thời qua route
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  sx={{ 
                    borderRadius: 2,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? 'primary.50' : 'transparent', // Nền mờ nếu active
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
          SETTINGS
        </Typography>
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton sx={{ borderRadius: 2, color: 'text.secondary' }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><SettingsIcon /></ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 'medium' }}>Settings</Typography>} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 'medium' }}>Logout</Typography>} />
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