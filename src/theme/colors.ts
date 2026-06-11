export const palette = {
  blue: {
    50:  "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#2563EB",
    600: "#1d4ed8",
    700: "#1e40af",
    800: "#1e3a8a",
    900: "#1e3270",
  },
  yellow: {
    50:  "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#EAB308",
    600: "#ca8a04",
    700: "#a16207",
  },
  // keep legacy aliases so existing code referencing palette.saffron/gold/navy still compiles
  saffron: {
    50:  "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#2563EB",
    600: "#1d4ed8",
    700: "#1e40af",
    800: "#1e3a8a",
    900: "#1e3270",
  },
  navy: {
    50:  "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#1e3a8a",
    600: "#1e3270",
    700: "#162456",
    800: "#0e1a40",
    900: "#08112a",
  },
  gold: {
    300: "#fde047",
    400: "#facc15",
    500: "#EAB308",
    600: "#ca8a04",
    700: "#a16207",
  },
  green: {
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
  },
  red: {
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
  },
  gray: {
    50:  "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
};

export const light = {
  primary: palette.blue[500],
  primaryLight: palette.blue[100],
  primaryDark: palette.blue[700],
  secondary: palette.blue[800],
  accent: palette.yellow[500],
  accentLight: palette.yellow[200],

  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceSecondary: "#F8FAFC",
  card: "#FFFFFF",
  cardBorder: palette.gray[200],

  textPrimary: palette.gray[900],
  textSecondary: palette.gray[500],
  textTertiary: palette.gray[400],
  textInverse: "#FFFFFF",
  textOnPrimary: "#FFFFFF",

  border: palette.gray[200],
  divider: palette.gray[100],

  success: palette.green[500],
  error: palette.red[500],
  warning: palette.yellow[500],
  info: palette.blue[500],

  tabBar: "#FFFFFF",
  tabBarBorder: palette.gray[200],
  tabBarActive: palette.blue[500],
  tabBarInactive: palette.gray[400],

  statusBar: "dark" as const,
  overlay: "rgba(0,0,0,0.4)",
  shimmer: ["#f0f4ff", "#e0eaff", "#f0f4ff"] as string[],
};

export const dark = {
  primary: palette.blue[400],
  primaryLight: "rgba(37,99,235,0.18)",
  primaryDark: palette.blue[600],
  secondary: palette.blue[300],
  accent: palette.yellow[400],
  accentLight: "rgba(234,179,8,0.2)",

  background: "#0A0A0F",
  surface: "#16161E",
  surfaceSecondary: "#1E1E2A",
  card: "#1C1C28",
  cardBorder: "rgba(255,255,255,0.08)",

  textPrimary: "#F8F8FF",
  textSecondary: palette.gray[400],
  textTertiary: palette.gray[600],
  textInverse: palette.gray[900],
  textOnPrimary: "#FFFFFF",

  border: "rgba(255,255,255,0.10)",
  divider: "rgba(255,255,255,0.06)",

  success: palette.green[400],
  error: palette.red[400],
  warning: palette.yellow[400],
  info: palette.blue[400],

  tabBar: "#16161E",
  tabBarBorder: "rgba(255,255,255,0.08)",
  tabBarActive: palette.blue[400],
  tabBarInactive: palette.gray[600],

  statusBar: "light" as const,
  overlay: "rgba(0,0,0,0.7)",
  shimmer: ["#1e1e2a", "#2a2a3a", "#1e1e2a"] as string[],
};

export type ColorTheme = typeof light;
