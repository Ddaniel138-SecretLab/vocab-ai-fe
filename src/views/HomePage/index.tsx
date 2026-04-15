// src/views/HomeView.tsx
import React from 'react';
import { Box, Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { Navbar } from '@/components/Navbar'; // Đổi đường dẫn cho khớp dự án của bạn
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Footer } from '@/components/Footer'; // Import Footer bạn vừa tạo

// Component xử lý hiệu ứng hiện nút cuộn lên
const ScrollTop = (props: { children: React.ReactElement }) => {
    const { children } = props;
    // trigger sẽ là true khi cuộn xuống qua 400px
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 400,
    });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <Zoom in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
            >
                {children}
            </Box>
        </Zoom>
    );
};

const HomeView: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden' }}>
            <Navbar />

            {/* Dùng id="back-to-top-anchor" nếu bạn muốn scroll tới chính xác một div nào đó, 
                nhưng ở đây mình đã dùng window.scrollTo({ top: 0 }) nên thẻ main cứ để bình thường */}
            <Box sx={{ marginTop: '70px' }} component="main">
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
            </Box>

            <Footer />

            {/* Nút FAB Scroll to top */}
            <ScrollTop>
                <Fab
                    size="medium"
                    aria-label="scroll back to top"
                    sx={{
                        background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                        color: 'white',
                        '&:hover': {
                            opacity: 0.9,
                        }
                    }}
                >
                    <KeyboardArrowUp />
                </Fab>
            </ScrollTop>
        </Box>
    );
};

export default HomeView;