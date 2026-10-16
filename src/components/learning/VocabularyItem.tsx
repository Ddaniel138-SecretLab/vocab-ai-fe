import { Chip, Paper, Stack, Typography } from "@mui/material";
import type { Vocabulary } from "@/types/learning";
import WordAudio from "./WordAudio";
export default function VocabularyItem({ word }: { word: Vocabulary }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, overflowWrap: "anywhere" }}
        >
          {word.word}
        </Typography>
        <Chip size="small" label={word.partOfSpeech} />
        {word.progress && (
          <Chip
            size="small"
            color={word.progress.mastery === "KNOWN" ? "success" : "default"}
            label={word.progress.mastery === "KNOWN" ? "Đã nhớ" : "Đang học"}
          />
        )}
      </Stack>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        {word.phonetic}
      </Typography>
      <Typography sx={{ my: 1, fontWeight: 600 }}>{word.meaning}</Typography>
      <Typography variant="body2">{word.exampleSentence}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {word.exampleTranslation}
      </Typography>
      <WordAudio {...word} />
      {word.generatedBy && (
        <Typography variant="caption" color="text.secondary">
          Nội dung có AI hỗ trợ
        </Typography>
      )}
    </Paper>
  );
}
