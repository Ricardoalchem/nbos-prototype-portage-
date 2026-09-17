import { useState } from "react";
//import { Outlet, useLocation } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Sidebar, { DRAWER_WIDTH, COLLAPSED_WIDTH } from "./Sidebar";
import TopBar from "./TopBar";
import { NAV_ITEMS } from "./navigation";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
 // const location = useLocation();

  const current = NAV_ITEMS.find((item) =>
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  );
  const title = current?.label ?? "NBOS";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      <TopBar title={title} sidebarOpen={sidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)`,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {/* <Outlet /> */}
        </Box>
      </Box>
    </Box>
  );
}
