import { Box, Typography } from "@mui/material";
export default function ExampleText({
  sentence,
  translation,
}: {
  sentence?: string;
  translation?: string;
}) {
  if (!sentence && !translation) return null;
  return (
    <Box
      sx={{
        borderRadius: 2.5,
        bgcolor: "#F6F5FC",
        p: 2,
        textAlign: "left",
        borderLeft: "3px solid #9C89EF",
        overflowWrap: "anywhere",
      }}
    >
      {sentence && (
        <>
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.1,
              color: "primary.dark",
              mb: 0.75,
            }}
          >
            VÍ DỤ TIẾNG ANH
          </Typography>
          <Typography
            lang="en"
            sx={{ fontSize: 14, lineHeight: 1.8, fontWeight: 500 }}
          >
            {sentence}
          </Typography>
        </>
      )}
      {translation && (
        <Box
          sx={{
            mt: sentence ? 1.5 : 0,
            pt: sentence ? 1.5 : 0,
            borderTop: sentence ? "1px solid #E7E3F3" : "none",
          }}
        >
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.1,
              color: "text.secondary",
              mb: 0.75,
            }}
          >
            DỊCH NGHĨA
          </Typography>
          <Typography
            lang="vi"
            sx={{ fontSize: 13, lineHeight: 1.8, color: "text.secondary" }}
          >
            {translation}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
