import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

// Force dark dans localStorage AVANT que ThemeProvider le lise
// Comme ça peu importe ce qui était stocké avant, on démarre toujours en dark
localStorage.setItem("altereon-theme", "dark")
document.documentElement.classList.remove("light", "system")
document.documentElement.classList.add("dark")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="altereon-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
)