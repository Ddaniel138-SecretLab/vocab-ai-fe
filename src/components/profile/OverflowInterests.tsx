import { thinScrollbarSx } from "@/styles/scrollbar";
import { useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  ButtonBase,
  Chip,
  ClickAwayListener,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
const GAP = 6,
  HEIGHT = 24;
const chipSx = {
  height: HEIGHT,
  fontSize: 10,
  bgcolor: "#F4F0FA",
  maxWidth: "100%",
  flexShrink: 0,
  "& .MuiChip-label": { px: 1.2 },
};
export default function OverflowInterests({
  interests,
}: {
  interests: string[];
}) {
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up("sm"));
  const root = useRef<HTMLDivElement>(null),
    measurement = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(0),
    [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    let active = true;
    function measure() {
      if (!active || !root.current || !measurement.current) return;
      const width = root.current.clientWidth,
        height = root.current.clientHeight;
      if (!width || !height) return;
      const widths = Array.from(measurement.current.children).map(
        (child) => child.getBoundingClientRect().width,
      );
      function fits(n: number, ellipsis: boolean) {
        let x = 0,
          rows = 1;
        const sizes = widths.slice(0, n);
        if (ellipsis) sizes.push(widths[interests.length] || 32);
        for (const size of sizes) {
          if (x > 0 && x + GAP + size > width + 0.25) {
            rows++;
            x = size;
          } else {
            x += (x ? GAP : 0) + size;
          }
        }
        return rows * HEIGHT + (rows - 1) * GAP <= height + 0.25;
      }
      let count = interests.length;
      if (!fits(count, false)) {
        count = Math.max(0, count - 1);
        while (count > 0 && !fits(count, true)) count--;
      }
      setVisible((previous) => (previous === count ? previous : count));
    }
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    const frame = requestAnimationFrame(measure);
    void document.fonts.ready.then(measure);
    return () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [interests]);
  const shown = Math.min(visible, interests.length),
    hidden = interests.slice(shown);
  return (
    <Box
      ref={root}
      data-testid="profile-interests"
      data-hidden-count={hidden.length}
      sx={{
        position: "relative",
        flex: 1,
        minHeight: HEIGHT,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <Box
        ref={measurement}
        aria-hidden
        inert
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          visibility: "hidden",
          display: "flex",
          flexWrap: "wrap",
          gap: `${GAP}px`,
          pointerEvents: "none",
        }}
      >
        {interests.map((tag, index) => (
          <Chip key={index} size="small" label={tag} sx={chipSx} />
        ))}
        <Box sx={{ width: 32, height: HEIGHT, flexShrink: 0 }} />
      </Box>
      <Stack
        direction="row"
        sx={{ flexWrap: "wrap", gap: `${GAP}px`, alignContent: "flex-start" }}
      >
        {interests.slice(0, shown).map((tag, index) => (
          <Tooltip key={index} title={tag}>
            <Chip size="small" label={tag} tabIndex={0} sx={chipSx} />
          </Tooltip>
        ))}
        {hidden.length > 0 && (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box
              component="span"
              sx={{ display: "inline-flex", height: HEIGHT }}
            >
              <Tooltip
                disableTouchListener
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                placement={wide ? "left" : "top"}
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: { padding: 12, altAxis: true },
                      },
                    ],
                  },
                  tooltip: {
                    sx: {
                      ...thinScrollbarSx,
                      maxHeight: "calc(100dvh - 24px)",
                      overflowY: "auto",
                      bgcolor: "#433657",
                      maxWidth: "min(300px, calc(100vw - 24px))",
                      p: 1.5,
                      boxSizing: "border-box",
                    },
                  },
                }}
                arrow
                title={
                  <Box sx={{ maxWidth: 270, p: 0.5 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, mb: 1 }}>
                      Sở thích còn lại ({hidden.length})
                    </Typography>
                    <Stack spacing={0.75}>
                      {hidden.map((tag, index) => (
                        <Typography
                          key={index}
                          sx={{
                            fontSize: 11,
                            lineHeight: 1.7,
                            overflowWrap: "anywhere",
                          }}
                        >
                          • {tag}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                }
              >
                <ButtonBase
                  aria-label={`Xem ${hidden.length} sở thích còn lại`}
                  onClick={() => setOpen(true)}
                  sx={{
                    width: 32,
                    height: HEIGHT,
                    bgcolor: "#E8DFF7",
                    color: "primary.dark",
                    borderRadius: 2,
                    fontWeight: 700,
                    "&:focus-visible": {
                      outline: "2px solid #9E7DD4",
                      outlineOffset: -2,
                    },
                  }}
                >
                  …
                </ButtonBase>
              </Tooltip>
            </Box>
          </ClickAwayListener>
        )}
      </Stack>
    </Box>
  );
}
