import { TooltipProvider } from "@/components/ui/tooltip"
import { createRoot } from 'react-dom/client'
import { Toaster } from "sonner"
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <TooltipProvider>
    <Toaster />
    <App />
  </TooltipProvider>
)
