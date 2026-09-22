import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { matchPath, useLocation, useNavigate } from "react-router";
import {
  NAV_GROUPS,
  NAV_ITEMS,
  type NavItem,
} from "./navigation";

export const DRAWER_WIDTH = 260;
export const COLLAPSED_WIDTH = 68;
const ROUTABLE_PATHS = new Set(["/", "/acquisition", "/issues"]);

interface WidgetSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  open,
  onToggle,
}: WidgetSidebarProps) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const homeItem = NAV_ITEMS.find((item) => item.id === "home")!;

  const groupedItems = NAV_GROUPS.map((group) => ({
    ...group,
    items: NAV_ITEMS.filter((item) => item.group === group.id),
  }));

  const isActive = (item: NavItem) =>
    Boolean(matchPath({ path: item.path, end: true }, location.pathname));

  const isRoutable = (item: NavItem) => ROUTABLE_PATHS.has(item.path);

  const selectItem = (item: NavItem) => {
    if (isRoutable(item)) {
      navigate(item.path);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          bgcolor: "background.paper",
          boxShadow:
            theme.palette.mode === "light"
              ? "2px 0 8px rgba(0,0,0,0.04)"
              : "none",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          px: open ? 2 : 0,
          minHeight: "64px !important",
        }}
      >
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              N
            </Box>

            <Typography variant="subtitle1" noWrap fontWeight={700}>
              NBOS
            </Typography>
          </Box>
        )}

        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>

      <List disablePadding>
        <ListItem disablePadding>
          <Tooltip title={open ? "" : homeItem.label} placement="right">
            <ListItemButton
              selected={isActive(homeItem)}
              onClick={() => selectItem(homeItem)}
              disabled={!isRoutable(homeItem)}
              aria-current={isActive(homeItem) ? "page" : undefined}
              sx={{
                minHeight: 44,
                px: open ? 2.5 : 2,
                justifyContent: open ? "initial" : "center",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                  color: isActive(homeItem)
                    ? "primary.main"
                    : !isRoutable(homeItem)
                    ? "text.disabled"
                    : "text.secondary",
                }}
              >
                <homeItem.icon />
              </ListItemIcon>

              {open && <ListItemText primary={homeItem.label} />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>

      {groupedItems.map((group) => (
        <List
          key={group.id}
          disablePadding
          subheader={
            open ? (
              <ListSubheader
                sx={{
                  bgcolor: "transparent",
                  lineHeight: "32px",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "text.secondary",
                  mt: 1,
                }}
              >
                {group.label}
              </ListSubheader>
            ) : undefined
          }
        >
          {group.items.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Tooltip title={open ? "" : item.label} placement="right">
                <ListItemButton
                  selected={isActive(item)}
                  onClick={() => selectItem(item)}
                  disabled={!isRoutable(item)}
                  aria-current={isActive(item) ? "page" : undefined}
                  sx={{
                    minHeight: 44,
                    px: open ? 2.5 : 2,
                    justifyContent: open ? "initial" : "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color: isActive(item)
                        ? "primary.main"
                        : !isRoutable(item)
                        ? "text.disabled"
                        : "text.secondary",
                    }}
                  >
                    <item.icon />
                  </ListItemIcon>

                  {open && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      ))}
    </Drawer>
  );
}
