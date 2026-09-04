import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
 import i18n from "./i18n";
import { TranslationProvider } from "./components/ui/translationtoggele";
createRoot(document.getElementById("root")!).render(
<TranslationProvider><App /></TranslationProvider>);
i18n.init();
