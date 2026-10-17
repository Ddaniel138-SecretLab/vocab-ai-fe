import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import HistoryRounded from "@mui/icons-material/HistoryRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/contexts/AuthContext";
import type { Dashboard, Recommendation } from "@/types/learning";
import { cardGrid, EmptyState, QueryState } from "@/components/learning/Common";
import SessionList from "@/components/learning/SessionList";
import TopicCard from "@/components/learning/TopicCard";
export default function DashboardView() {
  const { profile } = useAuth(),
    query = useApiQuery<Dashboard>("/dashboard"),
    recommended = useApiQuery<Recommendation>("/topics/recommended"),
    data = query.data;
  return (
    <Stack spacing={3.5}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 3, sm: 4 },
          borderRadius: 5,
          background:
            "linear-gradient(120deg,#403078 0%,#6D4FDB 70%,#8B6CEC 100%)",
          color: "white",
          "&:after": {
            content: '""',
            position: "absolute",
            width: 240,
            height: 240,
            border: "36px solid #FFFFFF0C",
            borderRadius: "50%",
            right: -80,
            top: -70,
            pointerEvents: "none",
          },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{
            alignItems: { sm: "center" },
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ maxWidth: 500 }}>
            <Chip
              size="small"
              label="MỖI NGÀY MỘT BƯỚC TIẾN"
              sx={{
                bgcolor: "#FFFFFF18",
                color: "#E6DCFF",
                fontSize: 9,
                letterSpacing: 1.1,
                mb: 2,
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 27, sm: 33 },
                fontWeight: 700,
                letterSpacing: -1,
                lineHeight: 1.3,
              }}
            >
              Chào {profile?.displayName || "bạn"}!{" "}
              <Box component="span" sx={{ display: "block", color: "#DFD5FF" }}>
                Hôm nay mình học gì nhỉ?
              </Box>
            </Typography>
            <Typography
              sx={{ mt: 2, fontSize: 13, color: "#E0D8F7", lineHeight: 1.9 }}
            >
              Tiếp tục một bài còn dang dở, hoặc học vài từ mới hôm nay.
            </Typography>
            <Button
              component={Link}
              href="/user/vocabulary"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              sx={{
                mt: 3,
                bgcolor: "white",
                color: "#4C358E",
                boxShadow: "none",
                px: 2.5,
                py: 1.3,
                "&:hover": { bgcolor: "#F2EEFF" },
              }}
            >
              Khám phá chủ đề
            </Button>
          </Box>
          <Box
            aria-hidden
            sx={{
              display: { xs: "none", md: "grid" },
              placeItems: "center",
              width: 140,
              height: 140,
              bgcolor: "#FFFFFF12",
              border: "1px solid #FFFFFF25",
              borderRadius: 6,
              transform: "rotate(8deg)",
              flexShrink: 0,
            }}
          >
            <AutoStoriesRounded
              sx={{
                fontSize: 70,
                color: "#F4EFD9",
                transform: "rotate(-8deg)",
              }}
            />
          </Box>
        </Stack>
      </Paper>
      <QueryState {...query} retry={query.reload} />
      {data && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2,minmax(0,1fr))",
                md: "repeat(4,minmax(0,1fr))",
              },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {[
              {
                label: "Từ đã nhớ",
                n: data.statistics.knownWords,
                icon: <CheckCircleRounded />,
                color: "#25856B",
                bg: "#EAF6F0",
              },
              {
                label: "Từ đang học",
                n: data.statistics.learningWords,
                icon: <AutoStoriesRounded />,
                color: "#7951BD",
                bg: "#F1EBFC",
              },
              {
                label: "Phiên hoàn thành",
                n: data.statistics.completedSessions,
                icon: <SchoolRounded />,
                color: "#BD8130",
                bg: "#FFF4DF",
              },
              {
                label: "Bài đang học",
                n: data.statistics.pendingSessions,
                icon: <HistoryRounded />,
                color: "#4D83B2",
                bg: "#ECF4FC",
              },
            ].map((s) => (
              <Paper
                key={s.label}
                variant="outlined"
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 4,
                  borderColor: "#E9E5F2",
                }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: s.bg,
                    color: s.color,
                    borderRadius: 2.5,
                    mb: 2,
                  }}
                >
                  {s.icon}
                </Avatar>
                <Typography
                  sx={{ fontSize: 29, fontWeight: 700, letterSpacing: -1 }}
                >
                  {s.n}
                </Typography>
                <Typography
                  sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
                >
                  {s.label}
                </Typography>
              </Paper>
            ))}
          </Box>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              borderColor: "#EEDFC9",
              bgcolor: "#FFFBF4",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2.5}
              sx={{
                justifyContent: "space-between",
                alignItems: { sm: "center" },
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "#FFF0D8",
                    color: "#D58424",
                  }}
                >
                  <LocalFireDepartmentRounded sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                    Streak {data.streak.currentStreak} ngày
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
                  >
                    {data.streak.studiedToday
                      ? "Bạn đã hoàn thành một phiên học hôm nay."
                      : "Hoàn thành một phiên học để ghi nhận ngày hôm nay."}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#96703E", mt: 1 }}>
                    Kỷ lục {data.streak.longestStreak} ngày · {data.dueReviews}{" "}
                    từ đến hạn ôn
                  </Typography>
                </Box>
              </Stack>
              <Button
                component={Link}
                href="/user/reviews"
                variant="outlined"
                sx={{ flexShrink: 0, borderColor: "#DBBF91", color: "#92692F" }}
              >
                Xem từ cần ôn
              </Button>
            </Stack>
          </Paper>
          <Box>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Tiếp tục học
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  Hoàn thành những gì bạn đã bắt đầu.
                </Typography>
              </Box>
              <Button component={Link} href="/user/sessions" size="small">
                Xem tất cả
              </Button>
            </Stack>
            {data.recentIncomplete.length ? (
              <SessionList sessions={data.recentIncomplete} />
            ) : (
              <EmptyState
                text="Bạn không có bài học dang dở."
                href="/user/vocabulary"
              />
            )}
          </Box>
        </>
      )}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Chủ đề phù hợp với bạn
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
          Một chút tò mò, thêm nhiều từ mới.
        </Typography>
        <QueryState {...recommended} retry={recommended.reload} />
        {recommended.data &&
          (recommended.data.items.length ? (
            <Box sx={cardGrid}>
              {recommended.data.items.map((t) => (
                <TopicCard key={t.id} topic={t} />
              ))}
            </Box>
          ) : (
            <EmptyState
              text="Chưa có chủ đề phù hợp. Thử chọn trình độ khác tại danh sách chủ đề."
              href="/user/vocabulary"
            />
          ))}
      </Box>
    </Stack>
  );
}
