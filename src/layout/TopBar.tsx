import {
  AppBar,
  Toolbar,
  Typography,
  //IconButton,
  Box,
  Chip,
} from "@mui/material";
//import Brightness4Icon from "@mui/icons-material/Brightness4";
//import Brightness7Icon from "@mui/icons-material/Brightness7";
//import { useThemeMode } from "../theme/ThemeContext";
import { DRAWER_WIDTH, COLLAPSED_WIDTH } from "./Sidebar";

interface TopBarProps {
  title: string;
  sidebarOpen: boolean;
}

export default function TopBar({ title, sidebarOpen }: TopBarProps) {
 // const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)`,
        ml: `${sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px`,
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          <Chip
            label="PROTOTYPE"
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: 10, height: 22 }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label="NAVAIR · NBOS"
            size="small"
            variant="outlined"
            sx={{ fontSize: 11, fontWeight: 600 }}
          />
          {/* <IconButton onClick={toggleTheme} color="inherit" size="small">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
