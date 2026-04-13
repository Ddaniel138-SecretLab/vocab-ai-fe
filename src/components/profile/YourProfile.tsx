import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    LinearProgress,
    Stack
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CloseIcon from '@mui/icons-material/Close';

// Mock data: Các thông số tiến độ học tập
const PROGRESS_STATS = [
    { title: "Từ vựng đã học", value: "120/500", progress: 24 },
    { title: "Mục tiêu tuần", value: "5/7 ngày", progress: 71 },
    { title: "Độ chính xác", value: "85%", progress: 85 },
    { title: "Hoàn thành bài tập", value: "12/15", progress: 80 },
];

interface YourProfileProps {
    isMobile?: boolean;
    onClose?: () => void;
}

const YourProfile: React.FC<YourProfileProps> = ({ isMobile, onClose }) => {
    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>

            {/* Header Profile (Mobile có nút Close) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Your Profile
                </Typography>
                {isMobile && onClose && (
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            {/* Avatar & Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                {/* Tạo viền giả (Ring) cho Avatar */}
                <Box
                    sx={{
                        p: 0.5,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #6A4BFF 50%, transparent 50%)', // Vòng màu tím
                        mb: 2
                    }}
                >
                    <Avatar
                        src="https://i.pravatar.cc/150?img=11" // Ảnh đại diện ảo
                        sx={{ width: 80, height: 80, border: '4px solid white' }}
                    />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Good Morning Prashant
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 0.5 }}>
                    Continue Your Journey And Achieve Your Target
                </Typography>
            </Box>

            {/* Action Icons */}
            <Stack direction="row" spacing={2} sx={{ mb: 5, justifyContent: 'center' }}>
                <IconButton sx={{ border: 1, borderColor: 'divider' }}><NotificationsNoneIcon /></IconButton>
                <IconButton sx={{ border: 1, borderColor: 'divider' }}><MailOutlinedIcon /></IconButton>
                <IconButton sx={{ border: 1, borderColor: 'divider' }}><EmojiEventsOutlinedIcon /></IconButton>
            </Stack>

            {/* Progress Stats */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Tiến trình học tập
                </Typography>
                <Stack spacing={3}>
                    {PROGRESS_STATS.map((stat, index) => (
                        <Box key={index}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                    {stat.title}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {stat.value}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={stat.progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'primary.50',
                                    '& .MuiLinearProgress-bar': { borderRadius: 4 }
                                }}
                            />
                        </Box>
                    ))}
                </Stack>
            </Box>

        </Box>
    );
};

export default YourProfile;