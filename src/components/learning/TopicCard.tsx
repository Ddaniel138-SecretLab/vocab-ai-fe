import Link from "next/link";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { Topic } from "@/types/learning";
import { englishLevels } from "@/types/auth";
export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        minWidth: 0,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
        <Chip size="small" color="primary" label={englishLevels[topic.level]} />
        <Chip size="small" label={`${topic._count.vocabulary} từ`} />
      </Stack>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {topic.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {topic.englishTitle}
      </Typography>
      <Typography variant="body2" sx={{ flexGrow: 1 }}>
        {topic.description}
      </Typography>
      {!!topic.matchedTags?.length && (
        <Typography variant="caption" color="primary">
          Phù hợp sở thích: {topic.matchedTags.join(", ")}
        </Typography>
      )}
      <Box>
        <Button
          component={Link}
          href={`/user/topics/${topic.id}`}
          variant="outlined"
        >
          Xem từ vựng
        </Button>
      </Box>
    </Paper>
  );
}
