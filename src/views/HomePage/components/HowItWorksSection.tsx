import React from 'react';
import { Box, Typography, Container, Card, CardContent, alpha, useTheme } from '@mui/material';
import { Search, AutoAwesome, School, EmojiEvents } from '@mui/icons-material';
import { motion } from 'framer-motion';

const steps = [
    {
        id: '01',
        title: 'Chọn chủ đề',
        desc: 'Nhập bất kỳ chủ đề nào bạn quan tâm (IT, Kinh doanh, Du lịch,...). Quên đi những bài học khô khan rập khuôn.',
        icon: <Search />,
        color: '#1976d2' // Xanh dương
    },
    {
        id: '02',
        title: 'AI sinh lộ trình',
        desc: 'Hệ thống tự động biên soạn danh sách từ vựng, kèm câu ví dụ và đoạn hội thoại thực tế chuẩn bản xứ.',
        icon: <AutoAwesome />,
        color: '#9c27b0' // Tím
    },
    {
        id: '03',
        title: 'Luyện tập thực chiến',
        desc: 'Tương tác trực tiếp với AI qua các bài tập điền từ, roleplay giao tiếp và nhận phản hồi sửa lỗi tức thì.',
        icon: <School />,
        color: '#ed6c02' // Cam
    },
    {
        id: '04',
        title: 'Làm chủ từ vựng',
        desc: 'Thuật toán Lặp lại ngắt quãng (Spaced Repetition) sẽ tính toán điểm rơi trí nhớ để nhắc nhở bạn ôn tập.',
        icon: <EmojiEvents />,
        color: '#2e7d32' // Xanh lá
    }
];

export const HowItWorksSection: React.FC = () => {
    const theme = useTheme();

    return (
        <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default', position: 'relative' }}>
            <Container maxWidth="lg">

                {/* Phần Tiêu đề */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    sx={{ mb: { xs: 8, md: 10 }, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '2.5rem', md: '3.75rem' },
                            mb: 3,
                            lineHeight: 1.2,
                            // Giữ đồng nhất dải màu gradient từ Hero/Features
                            background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Cách hoạt động
                    </Typography>

                    <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.25rem' }, px: { xs: 2, md: 8 }, maxWidth: '800px' }}>
                        Chỉ với 4 bước đơn giản, bạn đã có thể cá nhân hóa hoàn toàn lộ trình học của riêng mình.
                    </Typography>
                </Box>

                {/* Các bước hoạt động */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 4, md: 3 },
                        alignItems: 'stretch'
                    }}
                >
                    {steps.map((step, index) => (
                        <Box
                            key={index}
                            component={motion.div}
                            // Hiệu ứng bay lên lần lượt (stagger) dựa vào index
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                            sx={{ flex: 1, display: 'flex' }} // flex: 1 để các cột chia đều chiều rộng trên PC
                        >
                            <Card
                                elevation={0}
                                sx={{
                                    width: '100%',
                                    position: 'relative',
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: alpha(step.color, 0.02),
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.shadows[4],
                                        borderColor: alpha(step.color, 0.3)
                                    }
                                }}
                            >
                                {/* Số thứ tự in chìm siêu to (Watermark Effect) */}
                                <Typography
                                    variant="h1"
                                    sx={{
                                        position: 'absolute',
                                        top: -10,
                                        right: -10,
                                        fontSize: '8rem',
                                        fontWeight: 900,
                                        color: alpha(step.color, 0.05),
                                        zIndex: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none'
                                    }}
                                >
                                    {step.id}
                                </Typography>

                                <CardContent sx={{ p: { xs: 4, md: 4 }, position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 3,
                                            bgcolor: alpha(step.color, 0.1),
                                            color: step.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3
                                        }}
                                    >
                                        {React.cloneElement(step.icon, { fontSize: 'medium' })}
                                    </Box>

                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                                        {step.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1rem', flexGrow: 1 }}>
                                        {step.desc}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>

            </Container>
        </Box>
    );
};