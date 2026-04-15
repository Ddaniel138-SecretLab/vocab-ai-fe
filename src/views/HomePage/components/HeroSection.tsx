import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { AnimatedSection } from '@/components/Animation/AnimatedSection';

export const HeroSection: React.FC = () => {
    const router = useRouter();

    return (
        <Box
            sx={{
                // Chiếm toàn bộ chiều cao màn hình trừ đi độ cao của Navbar (tầm 70px)
                minHeight: 'calc(100vh - 70px)',

                // Dùng Flexbox để căn giữa hoàn toàn theo cả 2 trục
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

                textAlign: 'center',
                px: 2,
                pb: 10 // Đẩy nhẹ nội dung lên một chút để bù trừ thị giác, giúp nhìn không bị trĩu xuống dưới
            }}
        >
            <Container maxWidth="md">
                <AnimatedSection>
                    <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.75rem' }, mb: 3, lineHeight: 1.2, background: 'linear-gradient(to right, #1976d2, #9c27b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Học từ vựng thông minh <br />cùng Trí tuệ Nhân tạo
                    </Typography>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 5, fontSize: { xs: '1rem', md: '1.25rem' }, px: { xs: 2, md: 8 } }}>
                        Quên đi cách học vẹt nhàm chán. Vocab AI tự động sinh ví dụ, ngữ cảnh và bài tập thực hành dựa trên sở thích cá nhân của riêng bạn.
                    </Typography>
                </AnimatedSection>

                <AnimatedSection delay={0.4}>
                    {/* FIX LỖI TYPE STACK: Đưa justifyContent và alignItems vào trong sx */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Button variant="contained" size="large" onClick={() => router.push('/login')} sx={{ py: 1.5, px: 4, borderRadius: 3, fontSize: '1.1rem', width: { xs: '100%', sm: 'auto' } }}>
                            Bắt đầu miễn phí
                        </Button>
                        <Button variant="outlined" size="large" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} sx={{ py: 1.5, px: 4, borderRadius: 3, fontSize: '1.1rem', width: { xs: '100%', sm: 'auto' } }}>
                            Tìm hiểu thêm
                        </Button>
                    </Stack>
                </AnimatedSection>
            </Container>
        </Box>
    );
};