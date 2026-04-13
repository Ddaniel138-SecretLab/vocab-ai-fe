import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography sx={{ flexGrow: 1 }}>
                    Vocab AI
                </Typography>

                <Button color="inherit">Home</Button>
                <Button color="inherit">Vocabulary</Button>
                <Button color="inherit">Dashboard</Button>
            </Toolbar>
        </AppBar>
    );
}