import { Box, List, ListItem, ListItemText } from '@mui/material';

export default function AdminSidebar() {
    return (
        <Box sx={{ width: 250, bgcolor: "#4baea0", color: "#fff", minHeight: "100vh" }}>
            <List>
                <ListItem component="button">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem component="button">
                    <ListItemText primary="Users" />
                </ListItem>
            </List>
        </Box>
    );
}