import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { AutoAwesome as SparklesIcon } from '@mui/icons-material';

export const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{ py: 6, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                
                {/* Logo trong Footer */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ p: 0.8, bgcolor: 'primary.main', borderRadius: 1.5, color: 'white', display: 'flex' }}>
                        <SparklesIcon fontSize="small" />
                    </Box>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 800, 
                            letterSpacing: '-0.5px',
                            background: 'linear-gradient(to right, #1976d2, #9c27b0)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        VOCAB AI
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" align="center">
                    Nền tảng học từ vựng thông minh ứng dụng trí tuệ nhân tạo.
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'text.disabled', mt: 2 }}>
                    © {new Date().getFullYear()} Vocab AI. All rights reserved.
                </Typography>

            </Container>
        </Box>
    );
};