import { ThemeProvider } from "./theme/ThemeContext";
import DashboardLayout from "./layout/DashboardLayout";
import AcquisitionDashboardPage from "./pages/AcquisitionDashboardPage";

export default function NbosWidget() {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <AcquisitionDashboardPage />
      </DashboardLayout>
    </ThemeProvider>
  );
}
