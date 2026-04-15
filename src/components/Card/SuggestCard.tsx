/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, CardContent, Typography, Button, Stack, Box, alpha, useTheme } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon, AddCircleOutlined as AddIcon } from '@mui/icons-material';

interface SuggestCardProps {
    item: any;
    onSave: (item: any) => void;
}

export const SuggestCard: React.FC<SuggestCardProps> = ({ item, onSave }) => {
    const theme = useTheme();

    return (
        <Card variant="outlined" sx={{ 
            minWidth: 280, maxWidth: 300, flexShrink: 0, 
            borderRadius: 3, borderStyle: 'dashed', borderColor: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.02)
        }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {/* Chuyển justifyContent, alignItems, mb vào sx */}
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box>
                        {/* Chuyển fontWeight, color, lineHeight vào sx */}
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }}>
                            {item.word}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {item.phonetic} • {item.type}
                        </Typography>
                    </Box>
                    <Button 
                        size="small" variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={() => onSave(item)}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 1.5, minWidth: 0 }}
                    >
                        Lưu
                    </Button>
                </Stack>
                
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }} noWrap>
                    {item.meaning}
                </Typography>

                <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Stack direction="row" sx={{ alignItems: 'center', mb: '0.5', gap: '0.5' }}>
                        <AutoAwesomeIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            VÍ DỤ
                        </Typography>
                    </Stack>
                    <Typography 
                        variant="caption" 
                        sx={{ '& mark': { bgcolor: 'transparent', color: 'primary.main', fontWeight: 700 } }}
                        dangerouslySetInnerHTML={{ __html: item.aiExample }} 
                    />
                </Box>
            </CardContent>
        </Card>
    );
};