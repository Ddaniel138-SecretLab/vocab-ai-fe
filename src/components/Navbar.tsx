// src/components/Navbar.tsx
import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, Button, Container, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, alpha, useTheme } from '@mui/material';
import { Menu as MenuIcon, AutoAwesome as SparklesIcon } from '@mui/icons-material';
import { useRouter } from 'next/router'; // Hoặc 'next/navigation' nếu dùng App Router

const navItems = [
    { label: 'Tính năng', id: 'features' },
    { label: 'Cách hoạt động', id: 'how-it-works' },
];

export const Navbar: React.FC = () => {
    const router = useRouter();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Trừ hao chiều cao của Navbar để không bị che khuất tiêu đề
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setMobileOpen(false);
        }
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.8), // Trong suốt 80%
                backdropFilter: 'blur(12px)', // Hiệu ứng kính mờ
                borderBottom: 1,
                borderColor: 'divider',
                color: 'text.primary'
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Box sx={{ p: 0.8, bgcolor: 'primary.main', borderRadius: 1.5, color: 'white', display: 'flex' }}>
                            <SparklesIcon fontSize="small" />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                            VOCAB AI
                        </Typography>
                    </Box>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                            >
                                {item.label}
                            </Button>
                        ))}
                        <Button
                            variant="contained"
                            onClick={() => router.push('/login')}
                            sx={{
                                px: 4,
                                py: 1,
                                borderRadius: 50, // Nút bo tròn hoàn toàn
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                                boxShadow: 'none',
                                '&:hover': { boxShadow: theme.shadows[4] }
                            }}
                        >
                            Đăng nhập
                        </Button>
                    </Box>

                    {/* Mobile Menu Icon */}
                    <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                // SỬA Ở ĐÂY: Dùng sx để target vào class paper của Drawer thay vì dùng PaperProps
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 280,
                        boxSizing: 'border-box' // Thêm cái này để đảm bảo padding/border không làm sai lệch width
                    }
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 3 }}>VOCAB AI</Typography>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton onClick={() => scrollToSection(item.id)} sx={{ borderRadius: 2 }}>
                                    <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontWeight: 600 } }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding sx={{ mt: 3 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => router.push('/login')}
                                sx={{
                                    borderRadius: 50,
                                    py: 1.5,
                                    background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                                    fontWeight: 'bold'
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
};