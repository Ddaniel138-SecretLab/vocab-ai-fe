import LocalFireDepartmentRounded from "@mui/icons-material/LocalFireDepartmentRounded";
import Link from "next/link";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import {
    cardGrid,
    EmptyState,
    PageTitle,
    QueryState,
} from "@/components/learning/Common";
import SessionList from "@/components/learning/SessionList";
import TopicCard from "@/components/learning/TopicCard";
import { Dashboard, Recommendation } from "@/types/learning";
import { useApiQuery } from "@/hooks/useApiQuery";
export default function DashboardView() {
    const { profile } = useAuth();
    const query = useApiQuery<Dashboard>("/dashboard");
    const recommended = useApiQuery<Recommendation>("/topics/recommended");
    const data = query.data;
    return (
        <>
            <PageTitle
                title={`Chào ${profile?.displayName || "bạn"}!`}
                subtitle="Tiếp tục một bài còn dang dở, hoặc học vài từ mới hôm nay."
                action={
                    <Button component={Link} href="/user/vocabulary" variant="contained">
                        Khám phá chủ đề
                    </Button>
                }
            />
            <QueryState {...query} retry={query.reload} />
            {data && (
                <>
                    <Box sx={{ ...cardGrid, mb: 3 }}>
                        {[
                            ["Từ đã nhớ", data.statistics.knownWords],
                            ["Từ đang học", data.statistics.learningWords],
                            ["Phiên hoàn thành", data.statistics.completedSessions],
                            ["Bài đang học", data.statistics.pendingSessions],
                        ].map(([label, count]) => (
                            <Paper key={label} variant="outlined" sx={{ p: 3 }}>
                                <Typography color="text.secondary">{label}</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
                                    {count}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                    <Paper
                        sx={{
                            p: 3,
                            mb: 4,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                        }}
                    >
                        <Stack
                            spacing={2}
                            direction={{ xs: "column", sm: "row" }}
                            sx={{
                                justifyContent: "space-between",
                                alignItems: { sm: "center" },
                            }}
                        >
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    <LocalFireDepartmentRounded
                                        sx={{ verticalAlign: "middle", mr: 0.5 }}
                                    />{" "}
                                    Streak {data.streak.currentStreak} ngày
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    {data.streak.studiedToday
                                        ? "Bạn đã hoàn thành một phiên học hôm nay."
                                        : "Hoàn thành một phiên học để ghi nhận ngày hôm nay."}
                                </Typography>
                                <Typography variant="body2">
                                    {data.dueReviews} từ đến hạn ôn · Kỷ lục{" "}
                                    {data.streak.longestStreak} ngày
                                </Typography>
                            </Box>
                            <Button
                                component={Link}
                                href="/user/reviews"
                                variant="contained"
                                sx={{
                                    bgcolor: "white",
                                    color: "primary.main",
                                    "&:hover": { bgcolor: "grey.100" },
                                }}
                            >
                                Xem từ cần ôn
                            </Button>
                        </Stack>
                    </Paper>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Tiếp tục học
                        </Typography>
                        <Button component={Link} href="/user/sessions">
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
                </>
            )}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Chủ đề phù hợp với bạn
                </Typography>
                <QueryState {...recommended} retry={recommended.reload} />
                {recommended.data &&
                    (recommended.data.items.length ? (
                        <Box sx={cardGrid}>
                            {recommended.data.items.map((topic) => (
                                <TopicCard key={topic.id} topic={topic} />
                            ))}
                        </Box>
                    ) : (
                        <EmptyState
                            text="Chưa có chủ đề phù hợp. Thử chọn trình độ khác tại danh sách chủ đề."
                            href="/user/vocabulary"
                        />
                    ))}
            </Box>
        </>
    );
}
