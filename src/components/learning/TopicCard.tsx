import Link from "next/link";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { Topic } from "@/types/learning";
import { englishLevels } from "@/types/auth";
export default function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 4,
        borderColor: "#E9E5F2",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100%",
        transition: "box-shadow .2s",
        "&:hover": { boxShadow: "0 10px 30px #38246A0D" },
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "flex-end", flexWrap: "wrap", gap: 0.75, mb: 2 }}
      >
        <Chip
          size="small"
          label={englishLevels[topic.level]}
          sx={{ bgcolor: "#F0ECFF", color: "primary.dark", fontSize: 11 }}
        />
        <Chip
          size="small"
          variant="outlined"
          label={`${topic._count.vocabulary} từ`}
          sx={{ fontSize: 11 }}
        />
      </Stack>
      <Avatar
        variant="rounded"
        sx={{
          bgcolor: "#EAF7F2",
          color: "#21866C",
          mb: 2,
          width: 44,
          height: 44,
          borderRadius: 3,
        }}
      >
        <AutoStoriesRounded />
      </Avatar>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, overflowWrap: "anywhere" }}
      >
        {topic.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {topic.englishTitle}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mt: 1.5, lineHeight: 1.8, flexGrow: 1, color: "text.secondary" }}
      >
        {topic.description}
      </Typography>
      {!!topic.matchedTags?.length && (
        <Typography variant="caption" color="primary" sx={{ mt: 2 }}>
          Phù hợp sở thích: {topic.matchedTags.join(", ")}
        </Typography>
      )}
      <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid #F0EDF6" }}>
        <Button
          component={Link}
          href={`/user/topics/${topic.id}`}
          endIcon={<ArrowOutwardRounded />}
          sx={{ p: 0 }}
        >
          Xem từ vựng
        </Button>
      </Box>
    </Paper>
  );
}
