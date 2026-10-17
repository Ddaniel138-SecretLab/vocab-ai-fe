import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { Vocabulary } from "@/types/learning";
import WordAudio from "./WordAudio";
import ExampleText from "./ExampleText";
export default function VocabularyItem({ word }: { word: Vocabulary }) {
  return (
    <Paper
      data-testid="vocabulary-card"
      variant="outlined"
      sx={{
        p: 2.5,
        minWidth: 0,
        height: "100%",
        borderRadius: 4,
        borderColor: "#E9E5F2",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow .2s, border-color .2s",
        "&:hover": {
          boxShadow: "0 10px 30px #38246A0A",
          borderColor: "#CFC4EF",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 0.75,
          minHeight: 24,
          mb: 2,
        }}
      >
        <Chip
          size="small"
          label={word.partOfSpeech}
          sx={{
            fontSize: 11,
            bgcolor: "#F0ECFF",
            color: "primary.dark",
            fontWeight: 600,
          }}
        />
        {word.progress && (
          <Chip
            size="small"
            color={word.progress.mastery === "KNOWN" ? "success" : "default"}
            label={word.progress.mastery === "KNOWN" ? "Đã nhớ" : "Đang học"}
            sx={{ fontSize: 11 }}
          />
        )}
      </Stack>
      <Typography
        variant="h5"
        lang="en"
        sx={{ fontWeight: 700, overflowWrap: "anywhere", letterSpacing: -0.5 }}
      >
        {word.word}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
        {word.phonetic}
      </Typography>
      <Typography
        lang="vi"
        sx={{ mt: 2, mb: 2.5, fontWeight: 600, fontSize: 17 }}
      >
        {word.meaning}
      </Typography>
      <ExampleText
        sentence={word.exampleSentence}
        translation={word.exampleTranslation}
      />
      <Box sx={{ mt: "auto", pt: 2 }}>
        <WordAudio {...word} />
      </Box>
      {word.generatedBy && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, fontSize: 10 }}
        >
          ✦ Nội dung có AI hỗ trợ
        </Typography>
      )}
    </Paper>
  );
}
