import { createRoot } from "react-dom/client";
import { FoundryWidget } from "@osdk/widget.client-react";
import config from "./nbos.config";
import NbosWidget from "./NbosWidget";

createRoot(document.getElementById("root")!).render(
  <FoundryWidget config={config}>
    <NbosWidget />
  </FoundryWidget>,
);