import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton, alpha, useTheme } from '@mui/material';
import { Home as HomeIcon, AutoAwesome as SparklesIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { TEST_ACCOUNT } from '../../utils/constants';

const LoginView: React.FC = () => {
    const router = useRouter();
    const theme = useTheme();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
        if (error) setError('');
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (credentials.username === TEST_ACCOUNT.username && credentials.password === TEST_ACCOUNT.password) {
            localStorage.setItem('isAuthenticated', 'true');
            router.push('/user/dashboard'); 
        } else {
            setError('Sai tài khoản hoặc mật khẩu!');
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Nền hơi xám/xanh nhạt để làm nổi bật khung đăng nhập màu trắng
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                px: 2
            }}
        >
            <Paper 
                elevation={0} 
                sx={{ 
                    p: { xs: 4, md: 5 }, 
                    width: '100%', 
                    maxWidth: 420, 
                    borderRadius: 4, // Bo góc giống các Card ở trang chủ
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                    position: 'relative',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)' // Đổ bóng nhẹ nhàng
                }}
            >
                {/* Nút Trở về Trang chủ */}
                <IconButton 
                    onClick={() => router.push('/')}
                    aria-label="Về trang chủ"
                    sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16,
                        color: 'text.secondary',
                        transition: 'all 0.2s',
                        '&:hover': {
                            color: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            transform: 'scale(1.1)'
                        }
                    }}
                >
                    <HomeIcon />
                </IconButton>

                {/* Logo & Branding */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2, mt: 2 }}>
                    <Box sx={{ p: 0.8, bgcolor: 'primary.main', borderRadius: 1.5, color: 'white', display: 'flex' }}>
                        <SparklesIcon fontSize="small" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'text.primary' }}>
                        VOCAB AI
                    </Typography>
                </Box>

                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 800, 
                        mb: 4,
                        // Dải màu gradient chuẩn của project
                        background: 'linear-gradient(to right, #1976d2, #9c27b0)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent' 
                    }}
                >
                    Đăng nhập
                </Typography>

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Tên đăng nhập"
                        name="username"
                        variant="outlined"
                        margin="normal"
                        onChange={handleChange}
                        sx={{ 
                            '& .MuiOutlinedInput-root': { borderRadius: 2 } 
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Mật khẩu"
                        name="password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        onChange={handleChange}
                        sx={{ 
                            mb: 1,
                            '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                    />
                    
                    {/* Khu vực hiển thị lỗi với chiều cao cố định để không làm giật layout khi hiện lỗi */}
                    <Box sx={{ minHeight: 24, mb: 2, mt: 1 }}>
                        {error && (
                            <Typography color="error" variant="body2" sx={{ fontWeight: 500 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ 
                            py: 1.5, 
                            borderRadius: 50, // Nút tròn trịa giống Navbar
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                            boxShadow: 'none',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': { 
                                boxShadow: theme.shadows[6],
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Vào học ngay
                    </Button>
                </form>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                    Sử dụng tài khoản thử nghiệm để đăng nhập.
                </Typography>
                <Typography variant="body2" sx={{ mt: 4, color: '#F13E3E' }}>
                    Tài khoản thử nghiệm: test || 123
                </Typography>
            </Paper>
        </Box>
    );
};

export default LoginView;