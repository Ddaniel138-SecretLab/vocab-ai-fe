import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { Streak } from "@/types/learning";

export default function StreakSummary({ streak }: { streak: Streak }) {
  const stats = [
    {
      label: "Chuỗi hiện tại",
      value: streak.currentStreak,
      icon: LocalFireDepartmentRounded,
      color: "#C45513",
      background: "#FFF2E7",
      caption: "Mỗi ngày một chút, tiến bộ từng ngày",
    },
    {
      label: "Chuỗi dài nhất",
      value: streak.longestStreak,
      icon: EmojiEventsRounded,
      color: "#7952C7",
      background: "#F3EEFF",
      caption: "Kỷ lục kiên trì của bạn",
    },
    {
      label: "Tổng ngày đã học",
      value: streak.totalStudyDays,
      icon: CalendarMonthRounded,
      color: "#197B67",
      background: "#EAF8F2",
      caption: "Mỗi ngày học đều đáng ghi nhận",
    },
  ];
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        borderRadius: 4,
        borderColor: "#E9E5F2",
        overflow: "hidden",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{
          justifyContent: "space-between",
          alignItems: { sm: "center" },
          mb: 2.5,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Hành trình chăm chỉ của bạn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hoàn thành một phiên học để ghi nhận ngày học.
          </Typography>
        </Box>
        <Chip
          icon={
            streak.studiedToday ? (
              <CheckCircleRounded />
            ) : (
              <LocalFireDepartmentRounded />
            )
          }
          label={
            streak.studiedToday ? "Đã học hôm nay" : "Cùng giữ nhịp học hôm nay"
          }
          color={streak.studiedToday ? "success" : "warning"}
          variant="outlined"
          sx={{ alignSelf: { xs: "flex-start", sm: "auto" }, maxWidth: "100%" }}
        />
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        {stats.map(
          ({ label, value, icon: Icon, color, background, caption }) => (
            <Box
              key={label}
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: 3,
                bgcolor: background,
                minWidth: 0,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", mb: 2 }}
              >
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    color,
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color }}>
                  {label}
                </Typography>
              </Stack>
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  fontWeight: 850,
                  letterSpacing: "-1px",
                  lineHeight: 1.2,
                  color,
                  overflowWrap: "anywhere",
                }}
              >
                {value.toLocaleString("vi-VN")}{" "}
                <Box
                  component="span"
                  sx={{ fontSize: 14, fontWeight: 600, letterSpacing: 0 }}
                >
                  ngày
                </Box>
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 1, color: "text.secondary" }}
              >
                {caption}
              </Typography>
            </Box>
          ),
        )}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {streak.studiedToday
          ? "Bạn đã dành thời gian cho tiếng Anh hôm nay. Hẹn gặp bạn vào ngày mai!"
          : "Một phiên ôn tập ngắn hôm nay sẽ giúp bạn duy trì thói quen."}
      </Typography>
    </Paper>
  );
}
