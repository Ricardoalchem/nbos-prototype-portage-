import { createTheme, type ThemeOptions } from "@mui/material/styles";

const shared: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: "none" },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    primary: { main: "#1565C0" },
    secondary: { main: "#C9A84C" },
    background: { default: "#F4F6F8", paper: "#FFFFFF" },
    text: { primary: "#1A2027", secondary: "#5A6672" },
    divider: "rgba(0,0,0,0.08)",
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    primary: { main: "#00B4D8" },
    secondary: { main: "#C9A84C" },
    background: { default: "#0D1B2A", paper: "#1B2838" },
    text: { primary: "#E8EEF4", secondary: "#8FA8C0" },
    divider: "rgba(255,255,255,0.08)",
  },
});
