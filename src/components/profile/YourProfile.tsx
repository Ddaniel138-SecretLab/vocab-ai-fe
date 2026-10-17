import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import TranslateRounded from "@mui/icons-material/TranslateRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import FlagRounded from "@mui/icons-material/FlagRounded";
import { useAuth } from "@/contexts/AuthContext";
import { englishLevels, schoolStages } from "@/types/auth";
import OverflowInterests from "@/components/profile/OverflowInterests";
const short = "@container profile-panel (max-height: 520px)";
const tiny = "@container profile-panel (max-height: 440px)";
const compact = "@container profile-panel (max-height: 640px)";
export default function YourProfile({
  isMobile,
  onClose,
  onCollapse,
}: {
  isMobile?: boolean;
  onClose?: () => void;
  onCollapse?: () => void;
}) {
  const { user, profile, isProfileComplete } = useAuth();
  const name = profile?.displayName || user?.email.split("@")[0] || "Bạn";
  const goal =
    profile?.learningGoal ||
    "Thêm một mục tiêu nhỏ để bắt đầu hành trình học tập của bạn.";
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        containerType: "size",
        containerName: "profile-panel",
      }}
    >
      <Box
        sx={{
          height: "100%",
          minHeight: 0,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          [compact]: { p: 2, gap: 1 },
          [short]: { p: 1.5, gap: 1 },
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            Góc của bạn
          </Typography>
          <Tooltip title={goal} placement={isMobile ? "top" : "left"} arrow>
            <IconButton
              aria-label="Xem mục tiêu học tập"
              size="small"
              sx={{
                display: "none",
                [tiny]: { display: "inline-flex" },
                ml: "auto",
                color: "primary.main",
              }}
            >
              <FlagRounded fontSize="small" />
            </IconButton>
          </Tooltip>
          {isMobile ? (
            <IconButton aria-label="Đóng hồ sơ" onClick={onClose} size="small">
              <CloseRounded fontSize="small" />
            </IconButton>
          ) : (
            <Tooltip title="Thu gọn hồ sơ" placement="left">
              <IconButton
                aria-label="Thu gọn hồ sơ"
                aria-expanded
                aria-controls="desktop-profile-panel"
                onClick={onCollapse}
                size="small"
              >
                <ChevronRightRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        <Box sx={{ textAlign: "center", flexShrink: 0 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              mx: "auto",
              bgcolor: "#7653CB",
              fontSize: 24,
              fontWeight: 700,
              boxShadow: "0 0 0 5px #F3EDFC",
              mb: 1.5,
              [compact]: { width: 36, height: 36, fontSize: 16, mb: 0.75 },
              [short]: { display: "none" },
            }}
          >
            {name[0]?.toUpperCase()}
          </Avatar>
          <Tooltip title={name}>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                [compact]: { fontSize: 14 },
              }}
            >
              {name}
            </Typography>
          </Tooltip>
          <Tooltip title={user?.email || ""}>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 10,
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email}
            </Typography>
          </Tooltip>
          <Chip
            size="small"
            variant="outlined"
            color={isProfileComplete ? "success" : "warning"}
            label={
              isProfileComplete ? "Đã hoàn thiện hồ sơ" : "Cần hoàn thiện hồ sơ"
            }
            sx={{
              mt: 1,
              fontSize: 9,
              height: 22,
              [compact]: { mt: 0.5, height: 20 },
              [short]: { display: "none" },
            }}
          />
        </Box>
        <Stack spacing={1} sx={{ flexShrink: 0 }}>
          {[
            {
              icon: <SchoolRounded fontSize="small" />,
              label: "Bậc học",
              value: profile?.schoolStage
                ? schoolStages[profile.schoolStage]
                : "Chưa chọn",
            },
            {
              icon: <TranslateRounded fontSize="small" />,
              label: "Trình độ tiếng Anh",
              value: profile?.englishLevel
                ? englishLevels[profile.englishLevel]
                : "Chưa chọn",
            },
          ].map((i) => (
            <Stack
              key={i.label}
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                px: 1.5,
                py: 1,
                bgcolor: "#F8F6FC",
                borderRadius: "12px",
                [compact]: { py: 0.5 },
              }}
            >
              <Box sx={{ color: "primary.main", display: "flex" }}>
                {i.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 9,
                    color: "text.secondary",
                    [short]: { display: "none" },
                  }}
                >
                  {i.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    mt: 0.25,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {i.value}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
        <Box
          sx={{
            p: 1.75,
            bgcolor: "#F4F0FF",
            borderRadius: "14px",
            flexShrink: 0,
            [compact]: { p: 1.25 },
            [tiny]: { display: "none" },
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center", mb: 0.75 }}
          >
            <FlagRounded sx={{ color: "primary.main", fontSize: 16 }} />
            <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
              Mục tiêu của bạn
            </Typography>
          </Stack>
          <Tooltip title={goal} placement={isMobile ? "top" : "left"} arrow>
            <Typography
              sx={{
                fontSize: 11,
                lineHeight: 1.8,
                color: "text.secondary",
                overflowWrap: "anywhere",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                [compact]: { WebkitLineClamp: 1 },
              }}
            >
              {goal}
            </Typography>
          </Tooltip>
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: 48,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.4,
              flexShrink: 0,
            }}
          >
            ĐIỀU BẠN YÊU THÍCH
          </Typography>
          {profile?.interests.length ? (
            <OverflowInterests interests={profile.interests} />
          ) : (
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              Thêm sở thích trong hồ sơ nhé.
            </Typography>
          )}
        </Box>
        <Button
          component={Link}
          href="/user/profile"
          onClick={onClose}
          variant="outlined"
          startIcon={<EditRounded fontSize="small" />}
          sx={{ flexShrink: 0, height: 38, fontSize: 11, borderRadius: "10px" }}
        >
          Chỉnh sửa hồ sơ
        </Button>
      </Box>
    </Box>
  );
}
