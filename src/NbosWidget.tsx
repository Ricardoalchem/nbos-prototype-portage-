import { MemoryRouter, Navigate, Route, Routes } from "react-router";
import { ThemeProvider } from "./theme/ThemeContext";
import DashboardLayout from "./layout/DashboardLayout";
import AcquisitionDashboardPage from "./pages/AcquisitionDashboardPage";
import IssueDashboardPage from "./pages/IssueDashboardPage";

export default function NbosWidget() {
  return (
    <ThemeProvider>
      <MemoryRouter initialEntries={["/acquisition"]}>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/acquisition" replace />} />
            <Route path="/acquisition" element={<AcquisitionDashboardPage />} />
            <Route path="/issues" element={<IssueDashboardPage />} />
            <Route path="*" element={<Navigate to="/acquisition" replace />} />
          </Routes>
        </DashboardLayout>
      </MemoryRouter>
    </ThemeProvider>
  );
}
