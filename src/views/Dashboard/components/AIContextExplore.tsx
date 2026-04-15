import React from 'react';
import { Box, Typography, Card, Grid, alpha, Chip, IconButton, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { RECOMMENDED_TOPICS, WORD_OF_THE_DAY } from '@/utils/dashboardMockData';

const AIContextExplore: React.FC = () => {
  return (
    <Box>
      {/* Tiêu đề khu vực */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <AutoAwesomeIcon sx={{ color: '#6A4BFF' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Khám phá cùng AI
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* --- Cột trái: Word of the Day --- */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              boxShadow: 'none',
              height: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Tag AI Generated */}
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute', top: 0, right: 0, 
                bgcolor: alpha('#6A4BFF', 0.1), color: '#6A4BFF', 
                px: 2, py: 0.5, borderBottomLeftRadius: 12, fontWeight: 'bold' 
              }}
            >
              Word of the Day
            </Typography>

            <Box sx={{ mb: 2, mt: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'inline-block', mr: 1 }}>
                {WORD_OF_THE_DAY.word}
              </Typography>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <VolumeUpRoundedIcon />
              </IconButton>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  {WORD_OF_THE_DAY.phonetic}
                </Typography>
                <Chip label={WORD_OF_THE_DAY.type} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  • {WORD_OF_THE_DAY.meaning}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 2, bgcolor: alpha('#6A4BFF', 0.05), borderRadius: 2, borderLeft: 3, borderColor: '#6A4BFF', mb: 2 }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1, fontWeight: 500 }}>
                {`"${WORD_OF_THE_DAY.aiContext}"`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {WORD_OF_THE_DAY.translation}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" sx={{ borderRadius: 2, px: 3, boxShadow: 'none' }}>
                Lưu từ này
              </Button>
              <Button variant="outlined" startIcon={<BookmarkBorderRoundedIcon />} sx={{ borderRadius: 2 }}>
                Tạo thẻ Flashcard
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* --- Cột phải: Recommended Topics --- */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              boxShadow: 'none',
              height: '100%',
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Chủ đề dành cho bạn
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {RECOMMENDED_TOPICS.map((topic) => (
                <Box
                  key={topic.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: alpha('#6A4BFF', 0.03),
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '1.5rem', mr: 2 }}>{topic.icon}</Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {topic.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {topic.wordsCount} từ vựng
                    </Typography>
                  </Box>
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                </Box>
              ))}
            </Box>
            
            <Button fullWidth sx={{ mt: 2, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              Gợi ý chủ đề khác
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIContextExplore;