import Link from "next/link";
import { Box, Paper, Typography, Button } from "@mui/material";
import type { ReactNode } from "react";
export default function AuthShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 5,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
        }}
      >
        <Button component={Link} href="/" size="small">
          ← Trang chủ
        </Button>
        <Typography color="primary" sx={{ fontWeight: 800, mt: 2 }}>
          VOCAB AI
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, mb: 3 }}>
          {title}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
}
