import { useState, type ReactNode } from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar, { DRAWER_WIDTH, COLLAPSED_WIDTH } from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const title = "Acquisition Dashboard";

  return (
    <Box sx={{ display: "flex", minHeight: "100%" }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((previous) => !previous)}
        activeItemId="acquisition"
      />
      <TopBar title={title} sidebarOpen={sidebarOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${
            sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH
          }px)`,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
