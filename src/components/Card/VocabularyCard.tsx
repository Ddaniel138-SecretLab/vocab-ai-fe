import React from 'react';
import { Card, CardContent, Typography, IconButton, Stack, Box, alpha, useTheme, Button } from '@mui/material';
import { VolumeUp as VolumeUpIcon, CheckCircleOutlined as CheckIcon } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VocabularyCard: React.FC<{ item: any }> = ({ item }) => {
    const theme = useTheme();

    return (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', position: 'relative' }}>
            {item.status === 'mastered' && (
                <Box sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper', borderRadius: '50%' }}>
                    <CheckIcon color="success" fontSize="small" />
                </Box>
            )}
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}> 
                {/* Đưa alignItems, justifyContent vào sx */}
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                        {/* Đưa alignItems vào sx */}
                        <Stack direction="row" sx={{ alignItems: 'center', gap: '0.5' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {item.word}
                            </Typography>
                            <IconButton size="small" sx={{ p: 0.5, color: 'text.secondary' }}>
                                <VolumeUpIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            {item.phonetic} • {item.type}
                        </Typography>
                    </Box>
                    {item.status !== 'mastered' && (
                        <Button size="small" variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', py: 0.2 }}>
                            Học ngay
                        </Button>
                    )}
                </Stack>

                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                    {item.meaning}
                </Typography>

                <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, borderLeft: `3px solid ${theme.palette.primary.main}` }}>
                    <Typography 
                        variant="body2" 
                        sx={{ '& mark': { bgcolor: 'transparent', color: 'primary.main', fontWeight: 700 } }}
                        dangerouslySetInnerHTML={{ __html: item.aiExample }} 
                    />
                </Box>
            </CardContent>
        </Card>
    );
};