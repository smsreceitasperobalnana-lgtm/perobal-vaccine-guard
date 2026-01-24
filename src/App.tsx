import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lots from "./pages/Lots";
import Applications from "./pages/Applications";
import Temperature from "./pages/Temperature";
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
          <Route path="/lots" element={<Lots />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/temperature" element={<Temperature />} />
          <Route path="/checklist" element={<Placeholder title="Checklist Diário" subtitle="Verificação de rotinas da sala de vacina" />} />
          <Route path="/losses" element={<Placeholder title="Registro de Perdas" subtitle="Controle de doses descartadas" />} />
          <Route path="/reports" element={<Placeholder title="Relatórios" subtitle="Relatórios gerenciais e de auditoria" />} />
          <Route path="/settings" element={<Placeholder title="Configurações" subtitle="Configurações do sistema" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
