import React from "react";
import { Box, Typography } from "@mui/material";
import HeroBanner from "@/views/Dashboard/components/HeroBanner";
import QuickStats from "@/views/Dashboard/components/QuickStats";
import ContinueLearning from "./components/ContinueLearning";
import AIContextExplore from "./components/AIContextExplore";
import RecentActivities from "./components/RecentActivities";

const DashboardView: React.FC = () => {
    return (
        <Box>
            <Box sx={{ mb: 4, p: 2, bgcolor: "background.paper", borderRadius: 2, border: 1, borderColor: 'divider' }}>
                <Typography color="text.secondary">
                    🔍 Search your vocabulary here...
                </Typography>
            </Box>

            <HeroBanner />
            <QuickStats />

            <Box sx={{ mt: 5, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Tiếp tục học
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Các tác vụ được AI đề xuất cho bạn hôm nay
                </Typography>
            </Box>
            
            <ContinueLearning />
            
            <Box sx={{ mt: 6, mb: 4 }}>
               <AIContextExplore />
            </Box>

            <Box sx={{ mb: 4 }}>
                <RecentActivities />
            </Box>
        </Box>
    );
};

export default DashboardView;