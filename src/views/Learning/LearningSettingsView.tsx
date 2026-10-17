import { useRef, useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useApiQuery } from "@/hooks/useApiQuery";
import { learningApi } from "@/services/learning-api";
import { errorMessage } from "@/lib/api-client";
import type {
  LearningSettings,
  SettingsResponse,
  ReminderDelivery,
} from "@/types/learning";
import {
  dateTime,
  EmptyState,
  PageTitle,
  QueryState,
} from "@/components/learning/Common";
function editableSettings(settings: LearningSettings): LearningSettings {
  return {
    reminderEnabled: settings.reminderEnabled,
    reminderHour: settings.reminderHour,
    reminderMinute: settings.reminderMinute,
    reviewBatchSize: settings.reviewBatchSize,
  };
}
function SettingsForm({ initial }: { initial: SettingsResponse }) {
  const [settings, setSettings] = useState<LearningSettings>(() =>
    editableSettings(initial.settings),
  );
  const [time, setTime] = useState(
    `${String(initial.settings.reminderHour).padStart(2, "0")}:${String(initial.settings.reminderMinute).padStart(2, "0")}`,
  );
  const [busy, setBusy] = useState("");
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;
    const [hour, minute] = time.split(":").map(Number);
    if (
      !/^\d{2}:\d{2}$/.test(time) ||
      !Number.isInteger(hour) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59 ||
      !Number.isInteger(settings.reviewBatchSize) ||
      settings.reviewBatchSize < 1 ||
      settings.reviewBatchSize > 20
    ) {
      setError("Kiểm tra giờ nhắc và số từ mỗi phiên (1–20).");
      return;
    }
    lock.current = true;
    setBusy("save");
    setError("");
    setNotice("");
    try {
      const result = await learningApi.saveSettings({
        reminderEnabled: settings.reminderEnabled,
        reviewBatchSize: settings.reviewBatchSize,
        reminderHour: hour,
        reminderMinute: minute,
      });
      setSettings(editableSettings(result.settings));
      setNotice("Đã lưu cài đặt học tập.");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy("");
    }
  }
  async function test() {
    if (lock.current) return;
    lock.current = true;
    setBusy("test");
    setError("");
    setNotice("");
    try {
      await learningApi.testReminder();
      setNotice(
        "Đã gửi email thử đến email tài khoản. Với môi trường local, hãy mở Mailpit để xem thư.",
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      lock.current = false;
      setBusy("");
    }
  }
  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
      <Stack component="form" onSubmit={submit} spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        {notice && <Alert severity="success">{notice}</Alert>}
        {!initial.schedulerEnabled && (
          <Alert severity="warning">
            Lịch gửi tự động đang tắt trên máy chủ. Bạn vẫn lưu được lựa chọn và
            gửi email thử.
          </Alert>
        )}
        <FormControlLabel
          control={
            <Switch
              checked={settings.reminderEnabled}
              onChange={(_, checked) =>
                setSettings({ ...settings, reminderEnabled: checked })
              }
              disabled={!!busy}
            />
          }
          label="Nhận email nhắc học mỗi ngày"
        />
        <TextField
          required
          label="Giờ nhắc học"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 60 } }}
          helperText="Chọn giờ bạn muốn nhận email nhắc học."
          disabled={!!busy}
        />
        <TextField
          required
          label="Số từ mỗi phiên ôn"
          type="number"
          value={settings.reviewBatchSize}
          onChange={(e) =>
            setSettings({
              ...settings,
              reviewBatchSize: Number(e.target.value),
            })
          }
          slotProps={{ htmlInput: { min: 1, max: 20 } }}
          disabled={!!busy}
        />
        <Button type="submit" variant="contained" disabled={!!busy}>
          {busy === "save" ? "Đang lưu…" : "Lưu cài đặt"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => void test()}
          disabled={!!busy}
        >
          {busy === "test" ? "Đang gửi…" : "Gửi email nhắc học thử"}
        </Button>
        <Typography variant="body2" color="text.secondary">
          Email tự động chỉ gửi khi bạn bật nhận thư, lịch chạy trên BE được bật
          và bạn chưa hoàn thành phiên học trong ngày. Email thử được gửi ngay;
          không cần bật nhận thư và không xuất hiện trong lịch sử gửi tự động.
        </Typography>
      </Stack>
    </Paper>
  );
}
export default function LearningSettingsView() {
  const query = useApiQuery<SettingsResponse>("/learning/settings");
  const history = useApiQuery<{ deliveries: ReminderDelivery[] }>(
    "/learning/reminders",
  );
  return (
    <>
      <PageTitle
        title="Cài đặt học tập"
        subtitle="Chọn lịch nhắc học và số từ phù hợp cho mỗi lần ôn."
      />
      <QueryState {...query} retry={query.reload} />
      {query.data && <SettingsForm initial={query.data} />}
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
      >
        <Typography variant="h6">Lịch sử email tự động</Typography>
        <Button onClick={history.reload}>Tải lại</Button>
      </Stack>
      <QueryState {...history} retry={history.reload} />
      {history.data &&
        (history.data.deliveries.length ? (
          <Stack spacing={2}>
            {history.data.deliveries.map((entry) => (
              <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>
                  {entry.dateKey} ·{" "}
                  {entry.status === "SENT"
                    ? "Đã gửi"
                    : entry.status === "FAILED"
                      ? "Gửi thất bại"
                      : "Đang xử lý"}
                </Typography>
                <Typography variant="body2">
                  Lần thử: {entry.attempts} · Gửi lúc:{" "}
                  {dateTime(entry.sentAt, query.data?.timeZone)}
                </Typography>
                {entry.lastError && (
                  <Typography variant="body2" color="error">
                    {entry.lastError}
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        ) : (
          <EmptyState text="Chưa có lịch sử gửi email tự động." />
        ))}
    </>
  );
}
