import "./main.css";

import { FoundryWidget } from "@osdk/widget.client-react";
import { createRoot } from "react-dom/client";
import AcquisitionDashboardConfig from "./acquisitionDashboard.config.js";
import AcquisitionDashboardPage from "./AcquisitionDashboardPage.js";

const root = document.getElementById("root")!;

createRoot(root).render(
  <FoundryWidget config={AcquisitionDashboardConfig}>
    <AcquisitionDashboardPage />
  </FoundryWidget>,
);
