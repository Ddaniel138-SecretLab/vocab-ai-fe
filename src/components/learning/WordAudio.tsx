import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Link, Stack, Typography } from "@mui/material";
import VolumeUpOutlined from "@mui/icons-material/VolumeUpOutlined";
import type { AudioMetadata } from "@/types/learning";
export function safeAudioLink(value?: string | null) {
  try {
    const url = new URL(value || "");
    return ["http:", "https:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
export default function WordAudio({
  word,
  audioUrl,
  audioProvider,
  audioSourceUrl,
  audioLicense,
  audioLicenseUrl,
}: AudioMetadata & { word: string }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const ownsSpeech = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const [browserSpeech, setBrowserSpeech] = useState(false);
  useEffect(() => {
    const stop = () => {
      audio.current?.pause();
      const cancelSpeech = ownsSpeech.current;
      ownsSpeech.current = false;
      if (cancelSpeech) window.speechSynthesis?.cancel();
      setPlaying(false);
    };
    window.addEventListener("word-audio:stop", stop);
    return () => {
      audio.current?.pause();
      if (ownsSpeech.current) window.speechSynthesis?.cancel();
      window.removeEventListener("word-audio:stop", stop);
    };
  }, []);
  async function play() {
    window.dispatchEvent(new Event("word-audio:stop"));
    window.speechSynthesis?.cancel();
    setError("");
    setBrowserSpeech(false);
    const url = safeAudioLink(audioUrl);
    if (!url) {
      speak();
      return;
    }
    const instance = new Audio(url);
    audio.current = instance;
    instance.onended = () => setPlaying(false);
    instance.onerror = () => {
      setPlaying(false);
      setError(
        "Không tải được audio. Bạn có thể dùng giọng đọc của trình duyệt.",
      );
    };
    try {
      setPlaying(true);
      await instance.play();
    } catch {
      setPlaying(false);
      setError(
        "Chưa phát được audio. Thử lại hoặc dùng giọng đọc trình duyệt.",
      );
    }
  }
  function speak() {
    window.dispatchEvent(new Event("word-audio:stop"));
    audio.current?.pause();
    if (!("speechSynthesis" in window)) {
      setError("Trình duyệt chưa hỗ trợ giọng đọc.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    ownsSpeech.current = true;
    utterance.onend = () => {
      ownsSpeech.current = false;
    };
    utterance.onerror = () => {
      if (!ownsSpeech.current) return;
      ownsSpeech.current = false;
      setError(
        "Chưa đọc được từ này bằng giọng trình duyệt. Thử lại hoặc bổ sung audio.",
      );
    };
    setBrowserSpeech(true);
    setError("");
    window.speechSynthesis.speak(utterance);
  }
  const source = safeAudioLink(audioSourceUrl);
  const license = safeAudioLink(audioLicenseUrl);
  return (
    <Box>
      <Button
        size="small"
        startIcon={<VolumeUpOutlined />}
        onClick={() => void play()}
        disabled={playing}
        aria-label={`Nghe từ ${word}`}
      >
        {playing ? "Đang phát…" : "Nghe phát âm"}
      </Button>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        {source && (
          <Link
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
          >
            {audioProvider === "DICTIONARY" ? "Nguồn bản ghi" : "Nguồn TTS"}
          </Link>
        )}
        {audioLicense &&
          (license ? (
            <Link
              href={license}
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
            >
              {audioLicense}
            </Link>
          ) : (
            <Typography variant="caption">{audioLicense}</Typography>
          ))}
      </Stack>
      {browserSpeech && (
        <Typography variant="caption" color="text.secondary">
          Giọng đọc trình duyệt; tùy thiết bị và giọng đã cài.
        </Typography>
      )}
      {error && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          {error}
          <Button size="small" onClick={speak}>
            Dùng giọng đọc trình duyệt
          </Button>
        </Alert>
      )}
    </Box>
  );
}
