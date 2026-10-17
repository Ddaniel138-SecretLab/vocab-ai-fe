import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import FlipCameraAndroidRounded from "@mui/icons-material/FlipCameraAndroidRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import type { StudyItem } from "@/types/learning";
import ExampleText from "./ExampleText";
import WordAudio from "./WordAudio";
export default function FlipStudyCard({
  item,
  flipped,
  onFlip,
  disabled,
}: {
  item: StudyItem;
  flipped: boolean;
  onFlip: () => void;
  disabled: boolean;
}) {
  const face = {
    gridArea: "1 / 1",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: 5,
    border: "1px solid #DDD4F3",
    p: { xs: 3, sm: 4 },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: { xs: 310, sm: 340 },
    minWidth: 0,
    overflowWrap: "anywhere",
  } as const;
  return (
    <Box>
      <Box sx={{ perspective: "1600px", maxWidth: 680, mx: "auto" }}>
        <Box
          data-testid="flip-card"
          data-flipped={flipped}
          sx={{
            display: "grid",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform .62s cubic-bezier(.2,.7,.2,1)",
            "@media(prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        >
          <Box
            aria-hidden={flipped}
            inert={flipped}
            sx={{
              ...face,
              background: "linear-gradient(150deg,#F5F1FF,#FEFDFF)",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Stack
              direction="row"
              sx={{ alignSelf: "stretch", justifyContent: "flex-end", mb: 2 }}
            >
              <Chip
                size="small"
                label="MẶT TỪ VỰNG"
                sx={{
                  fontSize: 9,
                  letterSpacing: 1,
                  color: "primary.dark",
                  bgcolor: "#EAE1FF",
                }}
              />
            </Stack>
            <AutoAwesomeRounded
              aria-hidden
              sx={{ color: "#AB95DA", mb: 2, fontSize: 26 }}
            />
            <Typography
              lang="en"
              sx={{
                fontSize: { xs: 34, sm: 46 },
                fontWeight: 700,
                letterSpacing: -1,
                lineHeight: 1.3,
              }}
            >
              {item.word}
            </Typography>
            <Typography sx={{ color: "text.secondary", mt: 1.5, fontSize: 15 }}>
              {item.phonetic}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 3 }}>
              Thử nhớ nghĩa trước khi lật thẻ nhé!
            </Typography>
          </Box>
          <Box
            aria-hidden={!flipped}
            inert={!flipped}
            sx={{
              ...face,
              transform: "rotateY(180deg)",
              bgcolor: "white",
              textAlign: "left",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "flex-end", mb: 2 }}>
              <Chip
                size="small"
                label="NGHĨA & VÍ DỤ"
                sx={{
                  fontSize: 9,
                  letterSpacing: 1,
                  color: "#287E67",
                  bgcolor: "#EAF6F0",
                }}
              />
            </Stack>
            <Typography
              lang="en"
              sx={{
                fontSize: 15,
                color: "primary.main",
                fontWeight: 600,
                mb: 1,
              }}
            >
              {item.word}
            </Typography>
            <Typography
              lang="vi"
              sx={{ fontSize: { xs: 25, sm: 31 }, fontWeight: 700, mb: 3 }}
            >
              {item.meaning}
            </Typography>
            <ExampleText
              sentence={item.exampleSentence}
              translation={item.exampleTranslation}
            />
          </Box>
        </Box>
      </Box>
      <Stack sx={{ alignItems: "center", mt: 2.5 }} spacing={1}>
        <WordAudio key={item.id} {...item} />
        <Button
          startIcon={<FlipCameraAndroidRounded />}
          disabled={disabled}
          onClick={onFlip}
          variant="outlined"
          aria-pressed={flipped}
        >
          {flipped ? "Lật lại xem từ" : "Lật thẻ xem nghĩa"}
        </Button>
      </Stack>
    </Box>
  );
}
