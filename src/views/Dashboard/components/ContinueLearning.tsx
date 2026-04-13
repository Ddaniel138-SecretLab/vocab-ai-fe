import React from 'react';
import { Box, Typography, Card, Grid, Button, alpha } from '@mui/material';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { CONTINUE_LEARNING_TASKS } from '@/utils/dashboardMockData';

// Hàm helper để render Icon và Màu sắc tương ứng với từng loại Task
const getTaskStyles = (type: string) => {
    switch (type) {
        case 'review':
            return { icon: <ReplayRoundedIcon />, color: '#FF9800' }; // Màu Cam
        case 'new':
            return { icon: <AutoAwesomeRoundedIcon />, color: '#4CAF50' }; // Màu Xanh lá
        case 'quiz':
            return { icon: <AssignmentTurnedInRoundedIcon />, color: '#2196F3' }; // Màu Xanh dương
        default:
            return { icon: <ArrowForwardRoundedIcon />, color: '#6A4BFF' }; // Màu Tím mặc định
    }
};

const ContinueLearning: React.FC = () => {
    return (
        <Grid container spacing={3}>
            {CONTINUE_LEARNING_TASKS.map((task) => {
                const { icon, color } = getTaskStyles(task.type);

                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
                        <Card
                            sx={{
                                p: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                border: 1,
                                borderColor: 'divider',
                                boxShadow: 'none',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: color,
                                    boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            {/* Header: Icon & Highlight Tag */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: alpha(color, 0.1),
                                        color: color,
                                        display: 'flex',
                                    }}
                                >
                                    {icon}
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: color,
                                        bgcolor: alpha(color, 0.1),
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 4,
                                    }}
                                >
                                    {task.highlightText}
                                </Typography>
                            </Box>

                            {/* Body: Title & Description */}
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {task.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 3 }}>
                                {task.description}
                            </Typography>

                            {/* Footer: Action Button */}
                            <Button
                                variant="outlined"
                                fullWidth
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={{
                                    borderRadius: 2,
                                    color: 'text.primary',
                                    borderColor: 'divider',
                                    '&:hover': {
                                        borderColor: color,
                                        color: color,
                                        bgcolor: alpha(color, 0.05),
                                    },
                                }}
                            >
                                {task.buttonText}
                            </Button>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default ContinueLearning;