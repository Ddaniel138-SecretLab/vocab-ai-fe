import React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Container } from '@mui/material';
import { useRouter } from 'next/router';

const HomeView: React.FC = () => {
    const router = useRouter();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Navbar */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 1, color: 'white', display: 'flex' }}>
                                ✨
                            </Box>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                VOCAB AI
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => router.push('/login')}
                            sx={{ px: 3, borderRadius: 2 }}
                        >
                            Login
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                    Học từ vựng thông minh cùng AI
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                    Cá nhân hoá lộ trình và tạo ví dụ sinh động dựa trên sở thích của riêng bạn.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => router.push('/login')}
                    sx={{ py: 1.5, px: 4, fontSize: '1.1rem', borderRadius: 2 }}
                >
                    Bắt đầu ngay
                </Button>
            </Container>
        </Box>
    );
};

export default HomeView;