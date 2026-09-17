import { ThemeProvider } from "./theme/ThemeContext";
import WidgetDashboardLayout from "./layout/DashboardLayout";
import AcquisitionDashboardPage from "./pages/AcquisitionDashboardPage";

export default function NbosWidget() {
  return (
    <ThemeProvider>
      <WidgetDashboardLayout>
        <AcquisitionDashboardPage />
      </WidgetDashboardLayout>
    </ThemeProvider>
  );
}
