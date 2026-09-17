import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import BalanceIcon from "@mui/icons-material/Balance";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StorageIcon from "@mui/icons-material/Storage";
import FlightIcon from "@mui/icons-material/Flight";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SearchIcon from "@mui/icons-material/Search";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import type { SvgIconComponent } from "@mui/icons-material";

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: SvgIconComponent;
  group: string;
}

export interface NavGroup {
  id: string;
  label: string;
}

export const NAV_GROUPS: NavGroup[] = [
  { id: "issue-management", label: "Issue Management" },
  { id: "decision-support", label: "Decision Support" },
  { id: "data-administration", label: "Data & Administration" },
];

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", path: "/", icon: DashboardIcon, group: "" },
  { id: "issues", label: "Issue Dashboard", path: "/issues", icon: AssignmentIcon, group: "issue-management" },
  { id: "drafts", label: "Create Issue", path: "/drafts", icon: NoteAddIcon, group: "issue-management" },
  { id: "rebalancing", label: "Load Sheet Generator", path: "/rebalancing", icon: BalanceIcon, group: "issue-management" },
  { id: "load-sheets", label: "Validate Load Sheet", path: "/load-sheets", icon: UploadFileIcon, group: "issue-management" },
  { id: "pbis", label: "PBIS Simulator", path: "/pbis", icon: StorageIcon, group: "issue-management" },
  { id: "acquisition", label: "Acquisition Dashboard", path: "/acquisition", icon: FlightIcon, group: "decision-support" },
  { id: "assistant", label: "Baseline Assistant", path: "/assistant", icon: SmartToyIcon, group: "decision-support" },
  { id: "search", label: "J-Book Evidence", path: "/search", icon: SearchIcon, group: "decision-support" },
  { id: "qa", label: "Pipeline QA", path: "/pipeline-qa", icon: FactCheckIcon, group: "data-administration" },
];
