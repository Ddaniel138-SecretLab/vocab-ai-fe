/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import { Box, Typography, Stack, alpha, useTheme } from '@mui/material';
import { SuggestCard } from '@/components/Card/SuggestCard';

interface GeneratedWordsSectionProps {
    words: any[];
    onSave: (word: any) => void;
}

const GeneratedWordsSectionBase: React.FC<GeneratedWordsSectionProps> = ({ words, onSave }) => {
    const theme = useTheme();

    if (words.length === 0) return null;

    return (
        <Box sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), border: `1px dashed ${theme.palette.primary.main}` }}>
            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700, mb: 2, textTransform: 'uppercase' }}>
                Từ vựng AI vừa tạo (Lưu để đưa vào sổ tay)
            </Typography>
            <Stack
                direction="row"
                sx={{
                    overflowX: 'auto',
                    gap: 2,
                    pb: 1,
                    // Tối ưu CSS để trình duyệt cuộn mượt hơn bằng hardware acceleration
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    '&::-webkit-scrollbar': { height: 6 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 10 }
                }}
            >
                {words.map(item => (
                    <SuggestCard key={item.id} item={item} onSave={onSave} />
                ))}
            </Stack>
        </Box>
    );
};

// Sử dụng React.memo để ngăn component này re-render bừa bãi
export const GeneratedWordsSection = memo(GeneratedWordsSectionBase);