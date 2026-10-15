import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/contexts/AuthContext";
import { englishLevels, schoolStages } from "@/types/auth";
interface Props {
  isMobile?: boolean;
  onClose?: () => void;
}
export default function YourProfile({ isMobile, onClose }: Props) {
  const { user, profile, isProfileComplete } = useAuth();
  const name = profile?.displayName || user?.email.split("@")[0] || "Bạn";
  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Hồ sơ của bạn
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose} aria-label="Đóng hồ sơ">
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <Stack spacing={2} sx={{ alignItems: "center" }}>
        <Avatar
          sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 32 }}
        >
          {name[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ overflowWrap: "anywhere" }}>
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ overflowWrap: "anywhere" }}
        >
          {user?.email}
        </Typography>
        <Chip
          size="small"
          color={isProfileComplete ? "success" : "warning"}
          label={
            isProfileComplete ? "Đã hoàn thiện hồ sơ" : "Cần hoàn thiện hồ sơ"
          }
        />
        {profile?.schoolStage && (
          <Typography>{schoolStages[profile.schoolStage]}</Typography>
        )}
        {profile?.englishLevel && (
          <Typography>{englishLevels[profile.englishLevel]}</Typography>
        )}
        <Button
          component={Link}
          href="/user/profile"
          variant="outlined"
          onClick={onClose}
        >
          Chỉnh sửa hồ sơ
        </Button>
      </Stack>
    </Box>
  );
}
