import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function Sidebar() {
    return (
        <Box
            sx={{
                width: 240,
                bgcolor: "#F1F0CF",
                p: 2,
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }} color="primary">
                Vocab AI
            </Typography>

            <List>
                <ListItem component="button">
                    <ListItemText primary="Dashboard" />
                </ListItem>

                <ListItem component="button">
                    <ListItemText primary="Vocabulary" />
                </ListItem>

                <ListItem component="button">
                    <ListItemText primary="Progress" />
                </ListItem>
            </List>
        </Box>
    );
}