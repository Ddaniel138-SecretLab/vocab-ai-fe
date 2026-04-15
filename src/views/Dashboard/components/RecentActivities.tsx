import React from 'react';
import { Box, Typography, Card, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, alpha } from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { RECENT_ACTIVITIES } from '@/utils/dashboardMockData';

const getActivityStyles = (type: string) => {
    switch (type) {
        case 'streak':
            return { icon: <EmojiEventsRoundedIcon fontSize="small" />, color: '#FFC107', bgcolor: alpha('#FFC107', 0.15) };
        case 'word_mastered':
            return { icon: <CheckCircleRoundedIcon fontSize="small" />, color: '#4CAF50', bgcolor: alpha('#4CAF50', 0.15) }; 
        case 'lesson_completed':
            return { icon: <MenuBookRoundedIcon fontSize="small" />, color: '#2196F3', bgcolor: alpha('#2196F3', 0.15) };
        default:
            return { icon: <HistoryRoundedIcon fontSize="small" />, color: '#9E9E9E', bgcolor: alpha('#9E9E9E', 0.15) };
    }
};

const RecentActivities: React.FC = () => {
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <HistoryRoundedIcon sx={{ color: 'text.secondary' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Hoạt động gần đây
                </Typography>
            </Box>

            <Card
                sx={{
                    borderRadius: 3,
                    border: 1,
                    borderColor: 'divider',
                    boxShadow: 'none',
                    bgcolor: 'background.paper',
                }}
            >
                <List disablePadding>
                    {RECENT_ACTIVITIES.map((activity, index) => {
                        const { icon, color, bgcolor } = getActivityStyles(activity.type);
                        const isLastItem = index === RECENT_ACTIVITIES.length - 1;

                        return (
                            <ListItem
                                key={activity.id}
                                sx={{
                                    py: 2, px: { xs: 2, sm: 3 },
                                    borderBottom: isLastItem ? 'none' : 1,
                                    borderColor: 'divider',
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                            >
                                <ListItemAvatar sx={{ minWidth: 56 }}>
                                    <Avatar sx={{ bgcolor: bgcolor, color: color }}>
                                        {icon}
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {activity.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {activity.time}
                                        </Typography>
                                    }
                                />

                                {/* <Chip
                                    label={activity.points}
                                    size="small"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: color,
                                        bgcolor: bgcolor,
                                        borderRadius: 2
                                    }}
                                /> */}
                            </ListItem>
                        );
                    })}
                </List>
            </Card>
        </Box>
    );
};

export default RecentActivities;