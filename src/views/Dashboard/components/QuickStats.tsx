import React from 'react';
import { Box, Typography, Card, Grid } from '@mui/material';

const QuickStats: React.FC = () => {
    const stats = [
        { title: "Từ mới hôm nay", count: "12/20", icon: "📚" },
        { title: "Đang ôn tập", count: "5", icon: "🔄" },
        { title: "Đã thuộc", count: "128", icon: "✅" },
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 4 }}>
            {stats.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            boxShadow: 'none',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                        }}
                    >
                        <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 2, display: 'flex', color: 'white' }}>
                            <Typography sx={{ fontSize: 20 }}>{item.icon}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                {item.title}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {item.count}
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default QuickStats;