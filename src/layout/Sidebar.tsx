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
import {
  NAV_GROUPS,
  NAV_ITEMS,
  type NavItem,
} from "./navigation";

export const DRAWER_WIDTH = 260;
export const COLLAPSED_WIDTH = 68;

interface WidgetSidebarProps {
  open: boolean;
  onToggle: () => void;

  // The page currently displayed inside the widget.
  activeItemId?: string;

  // Optional: use this later to switch locally rendered widget pages.
  onSelect?: (item: NavItem) => void;
}

export default function Sidebar({
  open,
  onToggle,
  activeItemId = "acquisition",
  onSelect,
}: WidgetSidebarProps) {
  const theme = useTheme();

  const homeItem = NAV_ITEMS.find((item) => item.id === "home")!;

  const groupedItems = NAV_GROUPS.map((group) => ({
    ...group,
    items: NAV_ITEMS.filter((item) => item.group === group.id),
  }));

  const isActive = (itemId: string) => itemId === activeItemId;

  const selectItem = (item: NavItem) => {
    onSelect?.(item);
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
              selected={isActive(homeItem.id)}
              onClick={
                onSelect ? () => selectItem(homeItem) : undefined
              }
              aria-current={isActive(homeItem.id) ? "page" : undefined}
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
                  color: isActive(homeItem.id)
                    ? "primary.main"
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
                  selected={isActive(item.id)}
                  onClick={
                    onSelect ? () => selectItem(item) : undefined
                  }
                  aria-current={isActive(item.id) ? "page" : undefined}
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
                      color: isActive(item.id)
                        ? "primary.main"
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