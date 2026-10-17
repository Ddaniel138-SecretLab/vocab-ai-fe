// Chromium supports a precise 2px scrollbar; Firefox uses its native thin size.
export const thinScrollbarSx = {
  scrollbarWidth: "thin",
  scrollbarColor: "#AC92D8 transparent",
  scrollbarGutter: "stable",
  "@supports selector(::-webkit-scrollbar)": {
    scrollbarWidth: "auto",
    scrollbarColor: "auto",
  },
  "&::-webkit-scrollbar": { width: "2px", height: "2px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: "#AC92D8", borderRadius: "99px" },
  "&::-webkit-scrollbar-thumb:hover": { background: "#7955C6" },
} as const;
