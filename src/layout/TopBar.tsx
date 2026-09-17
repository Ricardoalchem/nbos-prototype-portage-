import {
  AppBar,
  Box,
  Chip,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeMode } from "../theme/useThemeMode";
import { COLLAPSED_WIDTH, DRAWER_WIDTH } from "./Sidebar";

interface WidgetTopBarProps {
  title: string;
  sidebarOpen: boolean;
}

export default function TopBar({ title, sidebarOpen }: WidgetTopBarProps) {
  const { mode, toggleTheme } = useThemeMode();

  const sidebarWidth = sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${sidebarWidth}px)`,
        ml: `${sidebarWidth}px`,
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
        transition: (theme) =>
          theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography variant="h6" noWrap>
            {title}
          </Typography>

          <Chip
            label="PROTOTYPE"
            size="small"
            color="secondary"
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: 10,
              height: 22,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label="NAVAIR · NBOS"
            size="small"
            variant="outlined"
            sx={{ fontSize: 11, fontWeight: 600 }}
          />

          <IconButton
            onClick={toggleTheme}
            color="inherit"
            size="small"
            aria-label={
              mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
