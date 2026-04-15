import React from 'react';
import { Box, Typography, Container, Card, CardContent, alpha, useTheme, useMediaQuery } from '@mui/material';
import { AutoFixHigh, Quiz, FactCheck, TrendingUp, MenuBook } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Đã bỏ trường 'image' cho gọn code
const features = [
    { title: 'Tạo từ vựng theo ngữ cảnh', desc: 'Nhập một chủ đề bạn thích (ví dụ: Công nghệ, Phim ảnh), AI sẽ tự động sinh ra danh sách từ vựng kèm ví dụ thực tế.', icon: <AutoFixHigh />, color: '#1976d2' },
    { title: 'Luyện tập tương tác', desc: 'Không chỉ đọc hiểu, bạn sẽ được luyện điền từ, đặt câu và sửa lỗi ngữ pháp ngay lập tức cùng AI.', icon: <Quiz />, color: '#9c27b0' },
    { title: 'Kiểm tra và ôn tập', desc: 'Thực hiện các bài test ngắn và ôn luyện thường xuyên để hệ thống hóa kiến thức, đảm bảo bạn thực sự làm chủ từ vựng.', icon: <FactCheck />, color: '#2e7d32' },
    { title: 'Gợi ý từ vựng nâng cao', desc: 'Dựa trên trình độ hiện tại, AI sẽ đề xuất các từ vựng khó hơn, thành ngữ (Idioms) hoặc cụm động từ (Phrasal Verbs) để bạn thăng hạng.', icon: <TrendingUp />, color: '#d32f2f' },
    { title: 'Sổ tay thông minh', desc: 'Hệ thống tự động theo dõi tiến độ, nhắc nhở ôn tập dựa trên thuật toán Lặp lại ngắt quãng (Spaced Repetition) để bạn nhớ từ mãi mãi.', icon: <MenuBook />, color: '#ed6c02' },
];

export const FeaturesSection: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: alpha(theme.palette.primary.main, 0.02), overflow: 'hidden' }}>
            <Container maxWidth="lg">

                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    sx={{ mb: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '2.5rem', md: '3.75rem' },
                            mb: 3,
                            lineHeight: 1.2,
                            background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Tính năng nổi bật
                    </Typography>

                    <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.25rem' }, px: { xs: 2, md: 8 }, maxWidth: '800px' }}>
                        Lộ trình toàn diện để bạn làm chủ vốn từ vựng
                    </Typography>
                </Box>

                {/* ĐÃ GIẢM KHOẢNG CÁCH (gap) giữa các thẻ */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 5 } }}>
                    {features.map((feat, index) => {
                        const isLeft = index % 2 === 0;
                        const xOffset = isMobile ? 50 : 100;

                        return (
                            <Box
                                key={index}
                                component={motion.div}
                                initial={{ opacity: 0, x: isLeft ? -xOffset : xOffset }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                sx={{
                                    // ĐÃ KÉO DÀI THẺ: Tăng lên 75% chiều rộng trên PC
                                    width: { xs: '100%', md: '75%' },
                                    alignSelf: isLeft ? 'flex-start' : 'flex-end',
                                }}
                            >
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 4,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        bgcolor: 'background.paper',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': { transform: 'translateY(-8px)', boxShadow: theme.shadows[4] }
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            p: { xs: 4, md: 5 },
                                            // Thiết lập Flexbox để căn lề cho nội dung bên trong Card
                                            display: 'flex',
                                            flexDirection: 'column',
                                            // Trên PC: Thẻ bên trái căn trái, bên phải căn phải. Trên Mobile: Luôn căn trái cho dễ đọc.
                                            alignItems: { xs: 'flex-start', md: isLeft ? 'flex-start' : 'flex-end' },
                                            textAlign: { xs: 'left', md: isLeft ? 'left' : 'right' }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 3,
                                                bgcolor: alpha(feat.color, 0.1),
                                                color: feat.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 3
                                            }}
                                        >
                                            {React.cloneElement(feat.icon, { fontSize: 'large' })}
                                        </Box>

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 800,
                                                mb: 2,
                                                fontSize: { xs: '1.5rem', md: '1.75rem' },
                                                background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {feat.title}
                                        </Typography>

                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                                            {feat.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        );
                    })}
                </Box>

            </Container>
        </Box>
    );
};