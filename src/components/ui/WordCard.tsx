import { Card, CardContent, Typography, Button } from '@mui/material';

export default function WordCard() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Abandon</Typography>
                <Typography color="text.secondary">
                    To leave something behind
                </Typography>

                <Button sx={{ mt: 2 }} variant="contained">
                    Learn
                </Button>
            </CardContent>
        </Card>
    );
}