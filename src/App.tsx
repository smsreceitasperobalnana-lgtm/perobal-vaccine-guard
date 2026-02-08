import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lotes from "./pages/Lotes";
import Aplicacoes from "./pages/Aplicacoes";
import Temperatura from "./pages/Temperatura";
import Perdas from "./pages/Perdas";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lotes" element={<Lotes />} />
          <Route path="/aplicacoes" element={<Aplicacoes />} />
          <Route path="/temperatura" element={<Temperatura />} />
          <Route path="/perdas" element={<Perdas />} />
          <Route path="/checklist" element={<Placeholder title="Checklist Diário" subtitle="Verificação de rotinas da sala de vacina" />} />
          <Route path="/reports" element={<Placeholder title="Relatórios" subtitle="Relatórios gerenciais e de auditoria" />} />
          <Route path="/settings" element={<Placeholder title="Configurações" subtitle="Configurações do sistema" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
