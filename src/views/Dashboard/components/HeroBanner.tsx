import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

const HeroBanner: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        p: { xs: 3, md: 5 }, // Mobile padding nhỏ hơn desktop
        borderRadius: 3,
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Vòng tròn trang trí background (tùy chọn để UI bớt trống) */}
      <Box 
        sx={{ 
          position: 'absolute', top: -50, right: -50, width: 200, height: 200, 
          bgcolor: 'white', opacity: 0.1, borderRadius: '50%' 
        }} 
      />

      <Typography variant="overline" sx={{ letterSpacing: 1, fontWeight: 'bold', opacity: 0.8 }}>
        AI PERSONALIZED LEARNING
      </Typography>
      
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: "bold", 
          mt: 1, 
          mb: 3,
          fontSize: { xs: '1.75rem', md: '2.125rem' }
        }}
      >
        Sharpen Your Vocabulary With
        <Box component="br" sx={{ display: { xs: 'none', sm: 'block' } }} /> AI Generated Context
      </Typography>

      {/* Nút Call-to-Action */}
      <Button 
        variant="contained" 
        size="large"
        startIcon={<PlayArrowRoundedIcon />}
        sx={{ 
          bgcolor: 'white', 
          color: 'primary.main',
          fontWeight: 'bold',
          px: 4,
          py: 1.5,
          borderRadius: 2,
          '&:hover': {
            bgcolor: 'grey.100',
          }
        }}
      >
        Bắt đầu bài học hôm nay
      </Button>
    </Box>
  );
};

export default HeroBanner;