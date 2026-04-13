import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import { TEST_ACCOUNT } from '../../utils/constants';

const LoginView: React.FC = () => {
    const router = useRouter();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (credentials.username === TEST_ACCOUNT.username && credentials.password === TEST_ACCOUNT.password) {
            localStorage.setItem('isAuthenticated', 'true');
            router.push('/dashboard'); // Đổi chuyển hướng vào Dashboard
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
                bgcolor: 'background.default'
            }}
        >
            <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: 400, borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Đăng nhập
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        margin="normal"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        onChange={handleChange}
                    />
                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        Vào học ngay
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginView;